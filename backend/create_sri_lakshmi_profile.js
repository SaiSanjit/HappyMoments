const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');
const crypto = require('crypto');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://hemofpnccbnfcmlibxbr.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhlbW9mcG5jY2JuZmNtbGlieGJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwMTkwMTYsImV4cCI6MjA3MzU5NTAxNn0.RDK5ZGGoJHY0K2dbIZKZKz1em6m-bS-NCJGdjSFO-No';

const supabase = createClient(supabaseUrl, supabaseKey);

const BUCKET_NAME = 'vendor-images';

const imageUrls = [
  'https://content.jdmagicbox.com/v2/comp/hyderabad/q7/040pxx40.xx40.260107102359.y8q7/catalogue/sri-lakshmi-balloon-decorators-lb-nagar-hyderabad-flower-decorators-2wfnnuv7ng.jpg',
  'https://content3.jdmagicbox.com/v2/comp/hyderabad/q7/040pxx40.xx40.260107102359.y8q7/catalogue/sri-lakshmi-balloon-decorators-lb-nagar-hyderabad-flower-decorators-vvv1ypzszg.jpg',
  'https://content3.jdmagicbox.com/v2/comp/hyderabad/q7/040pxx40.xx40.260107102359.y8q7/catalogue/sri-lakshmi-balloon-decorators-lb-nagar-hyderabad-flower-decorators-76p9delj4j.jpg',
  'https://content3.jdmagicbox.com/v2/comp/hyderabad/q7/040pxx40.xx40.260107102359.y8q7/catalogue/sri-lakshmi-balloon-decorators-lb-nagar-hyderabad-flower-decorators-k2ep6r4jmo.jpg',
  'https://content3.jdmagicbox.com/v2/comp/hyderabad/q7/040pxx40.xx40.260107102359.y8q7/catalogue/sri-lakshmi-balloon-decorators-lb-nagar-hyderabad-flower-decorators-ya016k7jvn.jpg',
  'https://content.jdmagicbox.com/v2/comp/hyderabad/q7/040pxx40.xx40.260107102359.y8q7/catalogue/sri-lakshmi-balloon-decorators-lb-nagar-hyderabad-flower-decorators-o8xuzo7l1p.jpg'
];

async function downloadImage(url) {
  const response = await axios.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      'Referer': 'https://www.justdial.com/'
    },
    responseType: 'arraybuffer',
    timeout: 15000
  });
  return {
    buffer: Buffer.from(response.data),
    contentType: response.headers['content-type'] || 'image/jpeg'
  };
}

async function run() {
  console.log('--- CREATING SRI LAKSHMI BALLOON DECORATORS PROFILE ---');

  // Check if already exists
  const { data: existingVendor } = await supabase
    .from('vendors')
    .select('vendor_id, brand_name, slug')
    .ilike('brand_name', '%Sri Lakshmi Balloon Decorators%')
    .maybeSingle();

  let vendorId = existingVendor ? existingVendor.vendor_id : null;

  if (existingVendor) {
    console.log(`⚠️ Vendor already exists with ID: ${vendorId}. Updating details...`);
  } else {
    console.log('Inserting new vendor record into "vendors" table...');
    const initialVendorData = {
      brand_name: 'Sri Lakshmi Balloon Decorators',
      slug: 'sri-lakshmi-balloon-decorators',
      spoc_name: 'Sri Lakshmi Decorators Admin',
      phone_number: '+91 84878 99931',
      alternate_number: '8589942784',
      whatsapp_number: '+91 78160 13106',
      email: 'srilakshmiballoons@gmail.com',
      address: 'Chandrapuri Colony, Near Hotel Sitara Grand, LB Nagar, Hyderabad, Telangana 500074',
      google_maps_link: 'https://maps.google.com/?q=17.34604,78.55793',
      description: 'Established in 2020, Sri Lakshmi Balloon Decorators in LB Nagar, Hyderabad offers top-rated balloon and floral decoration services for birthday parties, weddings, baby showers, naming ceremonies, housewarmings, and corporate events. Known for creative themes, reasonable pricing, and prompt setup across Hyderabad.',
      quick_intro: 'Premier balloon & theme event decorators in LB Nagar, Hyderabad',
      caption: 'Creative Balloon & Event Decorators',
      detailed_intro: 'Sri Lakshmi Balloon Decorators transforms spaces into captivating celebratory environments. We offer custom archways, ring backdrops, helium & chrome balloon setups, LED lighting, and floral combinations tailored to your celebration theme.',
      categories: ['Decorators'],
      category: ['Decorators'],
      subcategory: 'Balloon & Floral Decorations',
      rating: 4.9,
      review_count: 34,
      experience: '4+ years',
      verified: true,
      currently_available: true,
      starting_price: 2500,
      events_completed: 180,
      total_events: 180,
      highlight_features: [
        'Custom Theme Setups',
        'Budget-Friendly Packages',
        'Prompt & Courteous Team',
        'Same-Day Delivery & Setup',
        'Premium Quality Balloons'
      ],
      languages: ['Telugu', 'Hindi', 'English'],
      services: [
        {
          name: 'Theme Birthday Balloon Decoration',
          price: '2500',
          description: 'Vibrant theme-based balloon arch, backdrop ring, foil balloons, and LED illumination.'
        },
        {
          name: 'Baby Shower & Cradle Ceremony Setup',
          price: '4500',
          description: 'Pastel balloon decor with floral rings, cutouts, themed baby props, and customized name board.'
        },
        {
          name: 'Engagement & Wedding Stage Decor',
          price: '8500',
          description: 'Combination of exquisite balloon garland styling with fresh flower arrangements and stage backdrop.'
        },
        {
          name: 'Housewarming & Intimate Home Decor',
          price: '3000',
          description: 'Charming entrance arch, living room balloon bouquet, and decorative ceiling setups for home events.'
        }
      ],
      packages: [
        {
          name: 'Silver Birthday Package',
          price: '2500',
          features: ['Round ring backdrop', '200 metallic balloons', 'Happy Birthday LED neon sign', '2 cartoon foil balloons']
        },
        {
          name: 'Gold Grand Celebration Package',
          price: '5500',
          features: ['Grand double arch', '400 chrome & pastel balloons', 'Customized name board', 'LED pixel lights', 'Cake table styling']
        }
      ],
      booking_policies: {
        advance: '30%',
        payment_terms: 'Cash, UPI (PhonePe, Google Pay, Paytm)',
        cancellation_policy: 'Full refund if cancelled 48 hours prior to the event date.',
        booking_requirements: 'Event date, venue location, theme selection, and contact details.'
      },
      additional_info: {
        working_hours: '07:00 AM - 11:45 PM, All 7 Days',
        service_areas: ['LB Nagar', 'Dilsukhnagar', 'Hayathnagar', 'Nagole', 'Kothapet', 'Vanasthalipuram', 'Hyderabad'],
        payment_accepted: ['Cash', 'UPI', 'PhonePe', 'Paytm', 'Google Pay'],
        established_year: 2020
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: newVendor, error: insertError } = await supabase
      .from('vendors')
      .insert([initialVendorData])
      .select()
      .single();

    if (insertError) {
      console.error('❌ Error inserting vendor:', insertError);
      return;
    }

    vendorId = newVendor.vendor_id;
    console.log(`✅ Vendor created successfully with ID: ${vendorId}`);
  }

  // Download and upload images
  console.log(`\n--- DOWNLOADING & UPLOADING ${imageUrls.length} IMAGES FOR VENDOR ID ${vendorId} ---`);
  const catalogMetadata = [];
  let brandLogoUrl = null;
  let coverImageUrl = null;

  for (let i = 0; i < imageUrls.length; i++) {
    const imgUrl = imageUrls[i];
    console.log(`[${i + 1}/${imageUrls.length}] Downloading: ${imgUrl}`);
    try {
      const { buffer, contentType } = await downloadImage(imgUrl);
      const ext = contentType.includes('png') ? 'png' : 'jpeg';
      const timestamp = Date.now() + i;
      const filename = `${timestamp}_scraped_${i}.${ext}`;
      const catalogPath = `${vendorId}/catalog/${filename}`;

      console.log(`Uploading to storage at "${catalogPath}" (${buffer.length} bytes)...`);
      const { data: uploadData, error: uploadErr } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(catalogPath, buffer, {
          contentType: contentType,
          cacheControl: '3600',
          upsert: true
        });

      if (uploadErr) {
        console.error(`Upload error for image ${i}:`, uploadErr);
        continue;
      }

      const { data: urlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(catalogPath);

      const publicUrl = urlData.publicUrl;

      if (i === 0) {
        // Also upload as brand-logo
        const logoPath = `${vendorId}/brand-logo/${filename}`;
        await supabase.storage
          .from(BUCKET_NAME)
          .upload(logoPath, buffer, { contentType, upsert: true });

        const { data: logoUrlData } = supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(logoPath);
        brandLogoUrl = logoUrlData.publicUrl;
        coverImageUrl = publicUrl;
      }

      catalogMetadata.push({
        id: crypto.randomUUID(),
        title: filename,
        filename: filename,
        size: buffer.length,
        media_url: publicUrl,
        created_at: new Date().toISOString(),
        is_highlighted: i < 3 // Highlight first 3 images
      });
      console.log(`✅ Uploaded image ${i + 1}: ${publicUrl}`);
    } catch (imgErr) {
      console.error(`Failed to download/upload image ${i}:`, imgErr.message);
    }
  }

  // Update vendor with images
  console.log('\n--- UPDATING VENDOR IMAGE METADATA ---');
  const updatePayload = {
    catalog_images_metadata: catalogMetadata,
    updated_at: new Date().toISOString()
  };
  if (brandLogoUrl) updatePayload.brand_logo_url = brandLogoUrl;
  if (coverImageUrl) updatePayload.cover_image_url = coverImageUrl;
  if (brandLogoUrl) updatePayload.avatar_url = brandLogoUrl;

  const { error: updateError } = await supabase
    .from('vendors')
    .update(updatePayload)
    .eq('vendor_id', vendorId);

  if (updateError) {
    console.error('❌ Failed to update vendor images metadata:', updateError);
  } else {
    console.log(`✅ Successfully updated ${catalogMetadata.length} catalog images on vendor ${vendorId}`);
  }

  // Create or update login credentials
  console.log('\n--- SETTING UP VENDOR CREDENTIALS ---');
  const username = vendorId.toString();
  const password = `Lakshmi@${vendorId}*`;

  // Check if credentials already exist
  const { data: existingCreds } = await supabase
    .from('vendor_credentials')
    .select('id, username, password')
    .eq('vendor_id', vendorId)
    .maybeSingle();

  if (existingCreds) {
    console.log(`Updating existing credentials for vendor ${vendorId}...`);
    const { error: updateCredErr } = await supabase
      .from('vendor_credentials')
      .update({
        username: username,
        password: password,
        is_active: true,
        vendor_name: 'Sri Lakshmi Balloon Decorators',
        updated_at: new Date().toISOString()
      })
      .eq('vendor_id', vendorId);

    if (updateCredErr) {
      console.error('❌ Error updating credentials:', updateCredErr);
    } else {
      console.log('✅ Credentials updated successfully!');
    }
  } else {
    console.log(`Inserting new credentials for vendor ${vendorId}...`);
    const { error: credErr } = await supabase
      .from('vendor_credentials')
      .insert([{
        vendor_id: vendorId,
        username: username,
        password: password,
        is_active: true,
        vendor_name: 'Sri Lakshmi Balloon Decorators',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }]);

    if (credErr) {
      console.error('❌ Error creating credentials:', credErr);
    } else {
      console.log('✅ Credentials created successfully!');
    }
  }

  // Test the login
  console.log('\n--- TESTING VENDOR LOGIN ---');
  const { data: testLoginData, error: testLoginError } = await supabase
    .from('vendor_credentials')
    .select('vendor_id, username, password, vendors (*)')
    .eq('username', username)
    .eq('password', password)
    .eq('is_active', true)
    .maybeSingle();

  if (testLoginError || !testLoginData) {
    console.error('❌ Test login failed:', testLoginError);
  } else {
    console.log('🎉 TEST LOGIN SUCCESSFUL!');
    console.log({
      vendor_id: testLoginData.vendor_id,
      username: testLoginData.username,
      password: testLoginData.password,
      brand_name: testLoginData.vendors?.brand_name
    });
  }

  console.log('\n=========================================');
  console.log('VENDOR PROFILE READY:');
  console.log(`Vendor ID: ${vendorId}`);
  console.log(`Username:  ${username}`);
  console.log(`Password:  ${password}`);
  console.log(`Vendor Profile URL: http://localhost:8080/vendor/${vendorId}`);
  console.log('=========================================');
}

run();
