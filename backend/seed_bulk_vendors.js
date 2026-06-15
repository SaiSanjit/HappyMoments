const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://hemofpnccbnfcmlibxbr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhlbW9mcG5jY2JuZmNtbGlieGJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwMTkwMTYsImV4cCI6MjA3MzU5NTAxNn0.RDK5ZGGoJHY0K2dbIZKZKz1em6m-bS-NCJGdjSFO-No';

const supabase = createClient(supabaseUrl, supabaseKey);

// Categories
const categoriesList = [
  'Event Planners',
  'Decorators',
  'Venues',
  'Photography/Videography',
  'Caterers',
  'DJs, Lighting, and Entertainment',
  'Makeup Artists'
];

// Areas in Hyderabad
const areas = [
  'Hitech City', 'Madhapur', 'Gachibowli', 'Kondapur', 'Banjara Hills', 
  'Jubilee Hills', 'Kukatpally', 'Begumpet', 'Secunderabad', 'Ameerpet', 
  'Miyapur', 'Nanakramguda', 'Manikonda', 'Kothaguda', 'Tolichowki', 
  'Somajiguda', 'Film Nagar', 'Kavuri Hills', 'Chanda Nagar', 'Nallagandla'
];

// Names generation banks
const namesBank = {
  'Event Planners': {
    prefixes: ['Dream', 'Elite', 'Royal', 'Perfect', 'Golden', 'Vibrant', 'Sparkle', 'Epic', 'Celebrations', 'Crafted', 'Magical', 'Memorable', 'Infinite', 'Signature', 'Grandeur', 'Splendid', 'Serene', 'Blissful', 'Divine', 'Radiant'],
    suffixes: ['Events', 'Event Planners', 'Weddings', 'Celebrations', 'Occasions', 'Management', 'Studio', 'Planners']
  },
  'Decorators': {
    prefixes: ['Glow', 'Blossom', 'Flora', 'Decora', 'Petals', 'Artistic', 'Elegant', 'Marigold', 'Orchid', 'Jasmine', 'Vivid', 'Classic', 'Luxury', 'Sleek', 'Graceful', 'Exquisite', 'Trendy', 'Traditional', 'Fairy', 'Radiant'],
    suffixes: ['Decorators', 'Flower Decor', 'Events & Decor', 'Designs', 'Concepts', 'Themes', 'Styling']
  },
  'Venues': {
    prefixes: ['Grand', 'Royal', 'Silver', 'Golden', 'Park', 'Rivera', 'Orchid', 'Palm', 'Meadow', 'Pine', 'Crystal', 'Pearl', 'Lakeview', 'Sovereign', 'Heritage', 'Capital', 'Metropolitan', 'Castle', 'Prestige', 'Elite'],
    suffixes: ['Gardens', 'Convention Center', 'Palace', 'Banquet Hall', 'Resorts', 'Lawn', 'Plaza']
  },
  'Photography/Videography': {
    prefixes: ['Pixel', 'Lens', 'Frame', 'Capture', 'Focus', 'Shutter', 'Vivid', 'Click', 'Snap', 'Candid', 'Visuals', 'Moments', 'Memory', 'Golden Hour', 'Cinematic', 'Flash', 'Zoom', 'Portraits', 'Studio'],
    suffixes: ['Photography', 'Films & Photography', 'Candid Studios', 'Media', 'Cinemas', 'Creations', 'Visuals']
  },
  'Caterers': {
    prefixes: ['Spiceland', 'Feast', 'Gourmet', 'Flavor', 'Royal', 'Delight', 'Saffron', 'Cinnamon', 'Masala', 'Curry', 'Tasty', 'Yummy', 'Delicious', 'Plate', 'Chef', 'Kitchen', 'Banquet', 'Ambrosia', 'Elite', 'Traditional'],
    suffixes: ['Caterers', 'Foods', 'Feasts', 'Culinary Services', 'Kitchens']
  },
  'DJs, Lighting, and Entertainment': {
    prefixes: ['Bass', 'Beat', 'Sound', 'Rhythm', 'Glow', 'Laser', 'Sonic', 'Vibe', 'Stereo', 'Dynamic', 'Flash', 'Pulse', 'Disco', 'Acoustic', 'Amplified', 'Ultra', 'Fusion', 'DJ', 'Party', 'Wave'],
    suffixes: ['Entertainment', 'Sounds & Lights', 'DJs & Lighting', 'Acoustics', 'Vibes', 'Production']
  },
  'Makeup Artists': {
    prefixes: ['Glow', 'Glam', 'Beauty', 'Chic', 'Flawless', 'Blush', 'Grace', 'Style', 'Signature', 'Bridal', 'Velvet', 'Divine', 'Radiant', 'Stunning', 'Elite', 'Aura', 'Elegance', 'Pretty', 'Mirror', 'Cosmo'],
    suffixes: ['Makeover Studio', 'Bridal Makeup Artist', 'Beauty Lounge', 'Salons & Makeovers', 'Glam Studio']
  }
};

const firstNames = ['Amit', 'Raj', 'Srinivas', 'Mallik', 'Vijay', 'Rahul', 'Sai', 'Kiran', 'Prasad', 'Ravi', 'Sandeep', 'Priya', 'Anjali', 'Kavitha', 'Sneha', 'Deepika', 'Divya', 'Sanjay', 'Vikram', 'Arjun', 'Ramesh', 'Harish'];
const lastNames = ['Reddy', 'Rao', 'Sharma', 'Verma', 'Kumar', 'Goud', 'Naidu', 'Yadav', 'Patel', 'Choudhary', 'Sen', 'Joshi'];

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function main() {
  console.log('--- STARTING BULK VENDOR SEEDING ---');
  const targetPerCategory = 50;
  
  // Set to track generated brand names globally to avoid duplicates
  const generatedNames = new Set();
  
  // Fetch existing vendor names to avoid naming conflicts
  const { data: existingVendors, error: fetchError } = await supabase
    .from('vendors')
    .select('brand_name');
    
  if (fetchError) {
    console.error('Error fetching existing vendors:', fetchError);
    return;
  }
  
  if (existingVendors) {
    existingVendors.forEach(v => generatedNames.add(v.brand_name.toLowerCase()));
  }
  
  console.log(`Loaded ${generatedNames.size} existing names to prevent duplicates.`);

  for (const cat of categoriesList) {
    console.log(`\nGenerating 50 vendors for category: "${cat}"...`);
    let insertedCount = 0;
    
    for (let i = 1; i <= targetPerCategory; i++) {
      const bank = namesBank[cat];
      const area = getRandomElement(areas);
      
      // Keep trying until we generate a unique brand name
      let brandName = '';
      let attempts = 0;
      while (attempts < 100) {
        const prefix = getRandomElement(bank.prefixes);
        const suffix = getRandomElement(bank.suffixes);
        brandName = `${prefix} ${suffix} ${area}`;
        
        // Add random number suffix if duplicate attempts are high
        if (attempts > 20) {
          brandName += ` ${Math.floor(Math.random() * 100)}`;
        }
        
        if (!generatedNames.has(brandName.toLowerCase())) {
          generatedNames.add(brandName.toLowerCase());
          break;
        }
        attempts++;
      }
      
      const spocName = `${getRandomElement(firstNames)} ${getRandomElement(lastNames)}`;
      const slug = brandName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const username = slug.replace(/-/g, '').slice(0, 20) + Math.floor(Math.random() * 1000); // ensure unique username
      
      // Random Phone Number starting with +91 and 9, 8, 7, or 6
      const randomDigits = Math.floor(100000000 + Math.random() * 900000000);
      const phoneNumber = `+91 ${getRandomElement(['9', '8', '7', '6'])}${randomDigits}`;
      
      const rating = (3.8 + Math.random() * 1.2).toFixed(1);
      const reviewCount = Math.floor(Math.random() * 180) + 12;
      const experienceYears = Math.floor(Math.random() * 10) + 2;
      const totalEvents = Math.floor(Math.random() * 250) + 30;
      
      // Starting Price based on category to make it realistic
      let startingPrice = 10000;
      if (cat === 'Venues') startingPrice = Math.floor(Math.random() * 15 + 5) * 10000; // 50k - 200k
      else if (cat === 'Caterers') startingPrice = Math.floor(Math.random() * 3 + 2) * 200; // 400 - 1000 per plate
      else if (cat === 'Photography/Videography') startingPrice = Math.floor(Math.random() * 8 + 3) * 10000; // 30k - 110k
      else startingPrice = Math.floor(Math.random() * 5 + 1) * 10000; // 10k - 60k

      const vendorPayload = {
        brand_name: brandName,
        spoc_name: spocName,
        slug,
        phone_number: phoneNumber,
        whatsapp_number: phoneNumber,
        email: `${username}@happymoments.in`,
        address: `${Math.floor(Math.random() * 300) + 1}, Main Road, near Landmark, ${area}, Hyderabad, Telangana`,
        description: `Welcome to ${brandName}. We are premium service providers for ${cat} in ${area}, Hyderabad. With over ${experienceYears} years of experience, we specialize in delivering beautiful event solutions and grand memories for your special days.`,
        category: [cat],
        categories: [cat],
        rating: parseFloat(rating),
        review_count: reviewCount,
        verified: Math.random() > 0.25,
        currently_available: true,
        experience: `${experienceYears}+ years`,
        starting_price: startingPrice,
        total_events: totalEvents,
        events_completed: totalEvents,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Insert vendor row
      const { data: newVendor, error: insertError } = await supabase
        .from('vendors')
        .insert([vendorPayload])
        .select()
        .single();
        
      if (insertError) {
        console.error(`❌ Failed to insert vendor "${brandName}":`, insertError.message);
        continue;
      }
      
      // Create portal credentials
      const password = `${username}123!`;
      const credentialPayload = {
        vendor_id: newVendor.vendor_id,
        vendor_name: newVendor.brand_name,
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
        console.error(`❌ Failed to create login credentials for "${newVendor.brand_name}":`, credError.message);
      } else {
        insertedCount++;
      }
    }
    
    console.log(`✅ Successfully seeded ${insertedCount} vendors for category: "${cat}".`);
  }
  
  console.log('\n--- SEEDING COMPLETED SUCCESSFULLY ---');
}

main();
