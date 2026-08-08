const puppeteer = require('puppeteer');
const axios = require('axios');
const crypto = require('crypto');
require('dotenv').config();
const { supabase } = require('./config/supabase');

// Constants
const BUCKET_NAME = 'vendor-images';
const IMAGES_PER_VENDOR = 4; // Number of images to scrape per vendor
const BATCH_SIZE = 5; // Default batch size for testing

async function getVendorsLackingImages(limit = BATCH_SIZE) {
  console.log(`🔍 Fetching up to ${limit} vendors lacking images...`);
  const { data, error } = await supabase
    .from('vendors')
    .select('vendor_id, brand_name, category, address')
    .or('catalog_images_metadata.eq.[],catalog_images_metadata.is.null')
    .limit(limit);

  if (error) {
    console.error('❌ Error fetching vendors:', error);
    return [];
  }

  return data || [];
}

async function scrapeImageUrls(page, brandName, category, area) {
  const cleanCategory = Array.isArray(category) ? category[0] : (category || '');
  const cleanArea = area ? area.split(',')[0] : '';
  
  // Construct search query
  let searchQuery = `${brandName}`;
  if (cleanCategory) searchQuery += ` ${cleanCategory}`;
  if (cleanArea) searchQuery += ` ${cleanArea}`;
  searchQuery += ' Hyderabad';
  
  console.log(`🌐 Searching DuckDuckGo Images for: "${searchQuery}"`);
  
  const url = `https://duckduckgo.com/?q=${encodeURIComponent(searchQuery)}&iax=images&ia=images`;
  
  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 15000 });
    
    // Wait for the image grid tiles to load
    await page.waitForSelector('.tile--img__img', { timeout: 8000 });
    
    // Extract image sources
    const urls = await page.evaluate(() => {
      const images = Array.from(document.querySelectorAll('.tile--img__img'));
      return images
        .map(img => img.src || img.getAttribute('data-src'))
        .filter(src => src && src.startsWith('http'));
    });
    
    return urls.slice(0, IMAGES_PER_VENDOR);
  } catch (error) {
    console.warn(`⚠️ Timeout/Error searching for "${brandName}". Trying fallback simple search.`);
    try {
      // Fallback query (just brand name)
      const fallbackUrl = `https://duckduckgo.com/?q=${encodeURIComponent(brandName + ' Hyderabad')}&iax=images&ia=images`;
      await page.goto(fallbackUrl, { waitUntil: 'networkidle2', timeout: 10000 });
      await page.waitForSelector('.tile--img__img', { timeout: 5000 });
      
      const urls = await page.evaluate(() => {
        const images = Array.from(document.querySelectorAll('.tile--img__img'));
        return images
          .map(img => img.src || img.getAttribute('data-src'))
          .filter(src => src && src.startsWith('http'));
      });
      return urls.slice(0, IMAGES_PER_VENDOR);
    } catch (fallbackError) {
      console.error(`❌ Failed to scrape images for "${brandName}":`, fallbackError.message);
      return [];
    }
  }
}

async function downloadAndUploadImage(supabaseClient, imageUrl, vendorId, index) {
  try {
    // Download image
    const response = await axios.get(imageUrl, { 
      responseType: 'arraybuffer',
      timeout: 8000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    });
    
    const buffer = Buffer.from(response.data);
    const contentType = response.headers['content-type'] || 'image/jpeg';
    
    // Create fileName
    const timestamp = Date.now();
    const extension = contentType.split('/')[1] || 'jpeg';
    const filename = `${timestamp}_scraped_${index}.${extension}`;
    const uploadPath = `${vendorId}/catalog/${filename}`;
    
    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseClient.storage
      .from(BUCKET_NAME)
      .upload(uploadPath, buffer, {
        contentType: contentType,
        cacheControl: '3600',
        upsert: true
      });
      
    if (uploadError) {
      console.error(`❌ Failed to upload image ${index} to storage:`, uploadError.message);
      return null;
    }
    
    // Get public URL
    const { data: urlData } = supabaseClient.storage
      .from(BUCKET_NAME)
      .getPublicUrl(uploadPath);
      
    const publicUrl = urlData.publicUrl;
    
    return {
      id: crypto.randomUUID(),
      filename: filename,
      title: filename,
      size: buffer.length,
      media_url: publicUrl,
      created_at: new Date().toISOString(),
      is_highlighted: false
    };
  } catch (error) {
    console.error(`❌ Failed downloading image ${imageUrl}:`, error.message);
    return null;
  }
}

async function main() {
  // Parse command line arguments for limit
  const args = process.argv.slice(2);
  const limitArg = args.find(arg => arg.startsWith('--limit='));
  const limit = limitArg ? parseInt(limitArg.split('=')[1], 10) : BATCH_SIZE;

  console.log('--- STARTING VENDOR IMAGE SCRAPER ---');
  console.log(`Target Limit: ${limit} vendors`);

  const vendors = await getVendorsLackingImages(limit);
  if (vendors.length === 0) {
    console.log('✅ No vendors found lacking images. Exiting.');
    return;
  }

  console.log(`Found ${vendors.length} vendors to process.`);

  // Launch browser
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  
  let successCount = 0;

  for (let i = 0; i < vendors.length; i++) {
    const vendor = vendors[i];
    console.log(`\n--------------------------------------------`);
    console.log(`[${i + 1}/${vendors.length}] Vendor ID: ${vendor.vendor_id} | Name: "${vendor.brand_name}"`);
    
    // 1. Scrape image URLs
    const imageUrls = await scrapeImageUrls(page, vendor.brand_name, vendor.category, vendor.address);
    console.log(`Found ${imageUrls.length} images to download.`);
    
    if (imageUrls.length === 0) {
      console.log(`⚠️ No image URLs found for "${vendor.brand_name}". Skipping.`);
      continue;
    }
    
    // 2. Download and upload each image
    const uploadedImagesMetadata = [];
    const vendorMediaRecords = [];
    
    for (let j = 0; j < imageUrls.length; j++) {
      const url = imageUrls[j];
      console.log(`Downloading and uploading image ${j + 1}/${imageUrls.length}...`);
      
      const meta = await downloadAndUploadImage(supabase, url, vendor.vendor_id, j);
      if (meta) {
        uploadedImagesMetadata.push(meta);
        
        // Build record for vendor_media table
        vendorMediaRecords.push({
          id: meta.id,
          vendor_id: vendor.vendor_id.toString(), // Ensure text type references if needed
          media_url: meta.media_url,
          gdrive_file_id: meta.filename,
          original_filename: meta.filename,
          file_size: meta.size,
          compressed_size: meta.size,
          media_type: 'image',
          category: 'catalog',
          title: meta.title,
          description: `Scraped from DuckDuckGo search`,
          alt_text: `${vendor.brand_name} catalog image`,
          order_index: j,
          featured: j === 0, // Set first image as featured
          public: true,
          is_highlighted: false,
          upload_status: 'completed',
          uploaded_at: new Date().toISOString()
        });
      }
    }
    
    if (uploadedImagesMetadata.length === 0) {
      console.log(`❌ Failed to upload any images for "${vendor.brand_name}". Skipping db update.`);
      continue;
    }
    
    console.log(`Uploading database entries for "${vendor.brand_name}"...`);
    
    // 3. Insert vendor_media records
    const { error: mediaError } = await supabase
      .from('vendor_media')
      .insert(vendorMediaRecords);
      
    if (mediaError) {
      console.error(`❌ Failed to insert vendor_media records:`, mediaError.message);
    } else {
      console.log(`✅ Saved ${vendorMediaRecords.length} records to vendor_media table.`);
    }
    
    // 4. Update catalog_images_metadata on vendor
    const { error: vendorError } = await supabase
      .from('vendors')
      .update({
        catalog_images_metadata: uploadedImagesMetadata,
        updated_at: new Date().toISOString()
      })
      .eq('vendor_id', vendor.vendor_id);
      
    if (vendorError) {
      console.error(`❌ Failed to update vendors table:`, vendorError.message);
    } else {
      console.log(`✅ Successfully updated catalog_images_metadata for "${vendor.brand_name}"!`);
      successCount++;
    }
  }

  await browser.close();
  console.log(`\n============================================`);
  console.log(`🏁 SCRAPING COMPLETED: Successfully processed ${successCount}/${vendors.length} vendors.`);
  console.log(`============================================`);
}

main().catch(err => {
  console.error('❌ Critical script error:', err);
  process.exit(1);
});
