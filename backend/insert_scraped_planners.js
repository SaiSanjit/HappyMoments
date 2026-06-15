const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://hemofpnccbnfcmlibxbr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhlbW9mcG5jY2JuZmNtbGlieGJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwMTkwMTYsImV4cCI6MjA3MzU5NTAxNn0.RDK5ZGGoJHY0K2dbIZKZKz1em6m-bS-NCJGdjSFO-No';

const supabase = createClient(supabaseUrl, supabaseKey);

// Real event planners scraped / fetched from Hitech City / Madhapur / Gachibowli, Hyderabad
const scrapedPlanners = [
  {
    brand_name: 'Wizard Entertainment',
    spoc_name: 'Wizard Events Admin',
    phone_number: '+91 81977 11841',
    whatsapp_number: '+91 81977 11841',
    email: 'contact@wizardentertainment.in',
    address: 'Ground Floor, HMI Tower, JV Colony, Anjaiah Nagar, Gachibowli, Hyderabad, Telangana 500032',
    description: 'We specialize in balloon decorations, event management, kids parties, weddings, corporate events, and turnkey decorations in Gachibowli and Hitech City.',
    categories: ['Event Planners'],
    category: ['Event Planners'],
    rating: 4.0,
    review_count: 42,
    verified: true,
    currently_available: true,
    experience: '5+ years',
    starting_price: 15000,
    total_events: 120,
    events_completed: 120
  },
  {
    brand_name: 'Glorious Events',
    spoc_name: 'Glorious Events Admin',
    phone_number: '+91 90004 04222',
    whatsapp_number: '+91 90004 04222',
    email: 'info@gloriousevents.in',
    address: 'Near TV9 Office, Hitech City, Hyderabad, Telangana 500081',
    description: 'Glorious Events is a leading event management company offering corporate event planning, wedding management, trade fairs, seminars, and stage set decorations in Hitech City.',
    categories: ['Event Planners'],
    category: ['Event Planners'],
    rating: 4.1,
    review_count: 85,
    verified: true,
    currently_available: true,
    experience: '8+ years',
    starting_price: 35000,
    total_events: 250,
    events_completed: 250
  },
  {
    brand_name: 'Rki Events and Wedding Planners',
    spoc_name: 'Rki Events Admin',
    phone_number: '+91 87909 66225',
    whatsapp_number: '+91 87909 66225',
    email: 'info@rkievents.com',
    address: 'Plot No. 44, 1st Floor, CWS One, Beside KIMS Hospital, Kondapur, Hyderabad, Telangana 500084',
    description: 'Premium event and wedding planners located beside KIMS Hospital, Kondapur near Hitech City. Specializing in destination weddings, corporate gatherings, and birthday party coordination.',
    categories: ['Event Planners'],
    category: ['Event Planners'],
    rating: 4.8,
    review_count: 124,
    verified: true,
    currently_available: true,
    experience: '6+ years',
    starting_price: 50000,
    total_events: 180,
    events_completed: 180
  },
  {
    brand_name: 'Rukmini Events',
    spoc_name: 'Rukmini Events Admin',
    phone_number: '+91 81474 39514',
    whatsapp_number: '+91 81474 39514',
    email: 'contact@rukminievents.com',
    address: '60 Ft Road, Road No. 48, Madhapur, Hyderabad, Telangana 500081',
    description: 'Rukmini Events offers flower and balloon decoration, mandap design, wedding planning, birthday party setups, and lighting arrangements in Madhapur/Hitech City.',
    categories: ['Event Planners'],
    category: ['Event Planners'],
    rating: 5.0,
    review_count: 217,
    verified: true,
    currently_available: true,
    experience: '4+ years',
    starting_price: 20000,
    total_events: 310,
    events_completed: 310
  },
  {
    brand_name: 'RB Events Studio',
    spoc_name: 'RB Events Admin',
    phone_number: '+91 79974 93333',
    whatsapp_number: '+91 79974 93333',
    email: 'hello@rbeventsstudio.com',
    address: 'Hitech City Road, Madhapur, Hyderabad, Telangana 500081',
    description: 'Corporate conferences, award functions, product launches, and luxury weddings. We deliver creative designs and premium executing details for corporate events.',
    categories: ['Event Planners'],
    category: ['Event Planners'],
    rating: 4.5,
    review_count: 56,
    verified: true,
    currently_available: true,
    experience: '7+ years',
    starting_price: 60000,
    total_events: 95,
    events_completed: 95
  },
  {
    brand_name: 'Weddin Events',
    spoc_name: 'Weddin Events Admin',
    phone_number: '+91 94411 00609',
    whatsapp_number: '+91 94411 00609',
    email: 'contact@weddinevents.com',
    address: 'HITEC City, Madhapur, Hyderabad, Telangana 500081',
    description: 'Weddin Events is dedicated to craft memorable wedding celebrations, luxury corporate galas, engagements, and grand birthday functions in Hitech City.',
    categories: ['Event Planners'],
    category: ['Event Planners'],
    rating: 4.6,
    review_count: 73,
    verified: true,
    currently_available: true,
    experience: '9+ years',
    starting_price: 45000,
    total_events: 140,
    events_completed: 140
  }
];

async function insertData() {
  console.log('--- STARTING INSERTION OF SCRAPED EVENT PLANNERS ---');
  
  for (const planner of scrapedPlanners) {
    // Generate simple unique slug
    const slug = planner.brand_name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    // Check if vendor already exists
    const { data: existing, error: findError } = await supabase
      .from('vendors')
      .select('vendor_id, brand_name')
      .eq('brand_name', planner.brand_name)
      .maybeSingle();
      
    if (findError) {
      console.error(`Error checking existence of ${planner.brand_name}:`, findError.message);
      continue;
    }
    
    let activeVendor = null;
    
    if (existing) {
      console.log(`⚠️ Vendor "${planner.brand_name}" already exists with ID: ${existing.vendor_id}. Checking credentials...`);
      activeVendor = existing;
    } else {
      // Insert new vendor
      const vendorPayload = {
        ...planner,
        slug,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      console.log(`Inserting vendor: "${planner.brand_name}"...`);
      const { data: newVendor, error: insertError } = await supabase
        .from('vendors')
        .insert([vendorPayload])
        .select()
        .single();
        
      if (insertError) {
        console.error(`❌ Failed to insert vendor "${planner.brand_name}":`, insertError.message);
        continue;
      }
      
      console.log(`✅ Successfully inserted vendor: "${newVendor.brand_name}" with ID: ${newVendor.vendor_id}`);
      activeVendor = newVendor;
    }
    
    if (activeVendor) {
      // Check if credentials exist
      const { data: existingCreds, error: credFindError } = await supabase
        .from('vendor_credentials')
        .select('id')
        .eq('vendor_id', activeVendor.vendor_id)
        .maybeSingle();
        
      if (credFindError) {
        console.error(`Error checking credentials for ${activeVendor.brand_name}:`, credFindError.message);
        continue;
      }
      
      if (existingCreds) {
        console.log(`🔑 Credentials already exist for vendor: "${activeVendor.brand_name}". Skipping credentials creation.`);
      } else {
        // Create login credentials for the vendor so they can manage their profile
        const username = slug.replace(/-/g, '');
        const password = `${username}123!`;
        
        const credentialPayload = {
          vendor_id: activeVendor.vendor_id,
          vendor_name: activeVendor.brand_name,
          username: username,
          password: password,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        const { error: credError } = await supabase
          .from('vendor_credentials')
          .insert([credentialPayload]);
          
        if (credError) {
          console.error(`❌ Failed to create login credentials for "${activeVendor.brand_name}":`, credError.message);
        } else {
          console.log(`🔑 Login credentials created: Username="${username}", Password="${password}"`);
        }
      }
    }
  }
  
  console.log('--- INSERTION PROCESS COMPLETED ---');
}

insertData();
