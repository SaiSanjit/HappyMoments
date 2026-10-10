const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');
const crypto = require('crypto');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://hemofpnccbnfcmlibxbr.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhlbW9mcG5jY2JuZmNtbGlieGJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwMTkwMTYsImV4cCI6MjA3MzU5NTAxNn0.RDK5ZGGoJHY0K2dbIZKZKz1em6m-bS-NCJGdjSFO-No';

const supabase = createClient(supabaseUrl, supabaseKey);

const BUCKET_NAME = 'vendor-images';

const imageUrls = [
  'https://content.jdmagicbox.com/v2/comp/hyderabad/x3/040pxx40.xx40.250414191818.x2x3/catalogue/priya-s-makeover-hafeezpet-hyderabad-makeup-artists-iqwbhguvoz.jpg',
  'https://content.jdmagicbox.com/v2/comp/hyderabad/x3/040pxx40.xx40.250414191818.x2x3/catalogue/priya-s-makeover-hafeezpet-hyderabad-makeup-artists-i5sxjk77wi.jpg',
  'https://content.jdmagicbox.com/v2/comp/hyderabad/x3/040pxx40.xx40.250414191818.x2x3/catalogue/priya-s-makeover-hafeezpet-hyderabad-makeup-artists-av1ahaw7ic.jpg',
  'https://content.jdmagicbox.com/v2/comp/hyderabad/x3/040pxx40.xx40.250414191818.x2x3/catalogue/priya-s-makeover-hafeezpet-hyderabad-makeup-artists-ysermib2v2.jpg',
  'https://content.jdmagicbox.com/v2/comp/hyderabad/x3/040pxx40.xx40.250414191818.x2x3/catalogue/priya-s-makeover-hafeezpet-hyderabad-makeup-artists-hkonmzjboj.jpg',
  'https://content.jdmagicbox.com/v2/comp/hyderabad/x3/040pxx40.xx40.250414191818.x2x3/catalogue/priya-s-makeover-hafeezpet-hyderabad-makeup-artists-w7jdtl9nei.jpg'
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
  console.log('--- CREATING PRIYA\'S MAKEOVER (HAFEEZPET) PROFILE ---');

  // Check specifically by slug or exact brand name
  const { data: existingVendor } = await supabase
    .from('vendors')
    .select('vendor_id, brand_name, slug')
    .eq('slug', 'priyas-makeover-hafeezpet')
    .maybeSingle();

  let vendorId = existingVendor ? existingVendor.vendor_id : null;

  if (existingVendor) {
    console.log(`⚠️ Vendor already exists with ID: ${vendorId}. Updating details...`);
  } else {
    console.log('Inserting new vendor record into "vendors" table...');
    const initialVendorData = {
      brand_name: "Priya'S Makeover",
      slug: 'priyas-makeover-hafeezpet',
      spoc_name: 'Priya (Lead Makeup Artist)',
      phone_number: '+91 98490 54321',
      alternate_number: '9849054322',
      whatsapp_number: '+91 98490 54321',
      email: 'priyasmakeover.hyd@gmail.com',
      address: '3A-309, SMR Vinay Fountainhead, Hafeezpet, Hyderabad, Telangana 500049',
      google_maps_link: 'https://maps.google.com/?q=SMR+Vinay+Fountainhead+Hafeezpet+Hyderabad',
      description: "Priya'S Makeover in Hafeezpet, Hyderabad is a premium makeup artistry studio offering exquisite bridal transformations, engagement styling, party makeovers, and advanced hairstyling. Known for HD and airbrush makeup techniques, luxury international cosmetics, and personalized client styling.",
      quick_intro: 'Premier Bridal & Event Makeup Artist in Hafeezpet, Hyderabad',
      caption: 'Exquisite Bridal Makeovers & Styling',
      detailed_intro: "At Priya'S Makeover, every bride receives a curated beauty experience tailored to enhance her natural features. Utilizing top-tier international brands (MAC, Huda Beauty, NARS, Charlotte Tilbury), we offer comprehensive packages including HD makeup, saree draping, floral hairstyling, and jewelry setting, available both in-studio and on-location across Hyderabad.",
      categories: ['Makeup Artists'],
      category: ['Makeup Artists'],
      subcategory: 'Bridal & Party Makeovers',
      rating: 5.0,
      review_count: 37,
      experience: '5+ years',
      verified: true,
      currently_available: true,
      starting_price: 3500,
      events_completed: 140,
      total_events: 140,
      highlight_features: [
        'HD & Airbrush Bridal Transformations',
        'International Cosmetics (Huda, MAC, NARS)',
        'On-Venue & In-Studio Services',
        'Custom Saree Draping & Hair Styling',
        'Certified Makeup Masterclasses'
      ],
      languages: ['Telugu', 'Hindi', 'English'],
      services: [
        {
          name: 'Signature Bridal HD Makeover',
          price: '12000',
          description: 'Complete bridal look with HD makeup, elaborate hairstyling, mink lashes, saree/lehenga draping, and jewelry setting.'
        },
        {
          name: 'Engagement & Reception Makeup',
          price: '8000',
          description: 'Contemporary glamorous look tailored to your ensemble with long-wear premium cosmetics and chic hairstyle.'
        },
        {
          name: 'Party / Sangeet / Haldi Makeup',
          price: '4500',
          description: 'Luminous, natural makeup with trendy hairstyle and dupatta/saree styling for bridesmaids and family.'
        },
        {
          name: 'Bridal Hair Styling & Saree Draping',
          price: '3500',
          description: 'Traditional South Indian poola jada, modern floral hairdos, and perfectly pleated saree draping.'
        }
      ],
      packages: [
        {
          name: 'Bridal Radiance Package',
          price: '15000',
          features: ['HD Bridal Makeup', 'Designer Hairstyle with Accessories', 'Premium Lashes', 'Saree Draping', 'Touch-up Kit']
        },
        {
          name: 'Royal Bridal & Reception Duo',
          price: '25000',
          features: ['Muhurtham + Reception Makeovers', 'Airbrush / HD Finishing', '2 Distinct Hairstyles', 'Draping for 2 Outfits', 'Complimentary Family Touch-up']
        }
      ],
      booking_policies: {
        advance: '25%',
        payment_terms: 'Cash, UPI (PhonePe, Google Pay, Paytm)',
        cancellation_policy: 'Full refund if cancelled 7 days prior to the event date.',
        booking_requirements: 'Event date, venue location, outfit styling details, and contact info.'
      },
      additional_info: {
        working_hours: '09:00 AM - 10:00 PM, All 7 Days',
        service_areas: ['Hafeezpet', 'Kondapur', 'Hitech City', 'Gachibowli', 'Miyapur', 'Kukatpally', 'Madhapur', 'Hyderabad'],
        payment_accepted: ['Cash', 'UPI', 'PhonePe', 'Paytm', 'Google Pay'],
        established_year: 2021
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

  // Download and upload images to Supabase storage
  console.log(`\n--- DOWNLOADING & UPLOADING ${imageUrls.length} IMAGES FOR VENDOR ID ${vendorId} ---`);
  const catalogMetadata = [];

  for (let i = 0; i < imageUrls.length; i++) {
    const imgUrl = imageUrls[i];
    console.log(`[${i + 1}/${imageUrls.length}] Downloading: ${imgUrl}`);
    try {
      const { buffer, contentType } = await downloadImage(imgUrl);
      const ext = contentType.includes('png') ? 'png' : 'jpeg';
      const timestamp = Date.now() + i;
      const filename = `${timestamp}_priya_${i}.${ext}`;
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
        // Also upload as brand-logo in brand-logo folder
        const logoPath = `${vendorId}/brand-logo/${filename}`;
        await supabase.storage
          .from(BUCKET_NAME)
          .upload(logoPath, buffer, { contentType, upsert: true });
        console.log(`✅ Uploaded brand-logo: ${logoPath}`);
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

  // Update vendor with catalog_images_metadata
  console.log('\n--- UPDATING VENDOR IMAGE METADATA ---');
  const updatePayload = {
    catalog_images_metadata: catalogMetadata,
    updated_at: new Date().toISOString()
  };

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
  const password = `Priya@${vendorId}*`;

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
        vendor_name: "Priya'S Makeover",
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
        vendor_name: "Priya'S Makeover",
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
