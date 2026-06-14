const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://hemofpnccbnfcmlibxbr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhlbW9mcG5jY2JuZmNtbGlieGJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwMTkwMTYsImV4cCI6MjA3MzU5NTAxNn0.RDK5ZGGoJHY0K2dbIZKZKz1em6m-bS-NCJGdjSFO-No';
const supabase = createClient(supabaseUrl, supabaseKey);

const firstNames = ['Srinivas', 'Rajesh', 'Anjali', 'Hema', 'Krishna', 'Vikram', 'Sneha', 'Ramesh', 'Suresh', 'Rahul', 'Priya', 'Kiran', 'Amit', 'Divya', 'Sanjay', 'Geetha', 'Mahesh', 'Arjun', 'Pranav', 'Shreya'];
const lastNames = ['Reddy', 'Rao', 'Naidu', 'Verma', 'Sharma', 'Patel', 'Gupta', 'Singh', 'Joshi', 'Nair', 'Choudhury', 'Prasad', 'Kumar', 'Shetty', 'Bhatt', 'Menon'];
const areas = ['Jubilee Hills', 'Banjara Hills', 'Madhapur', 'Gachibowli', 'Kukatpally', 'Secunderabad', 'Begumpet', 'Kondapur', 'Hitech City', 'Miyapur', 'LB Nagar', 'Dilsukhnagar', 'Chanda Nagar', 'Himayatnagar', 'Ameerpet', 'Nampally', 'Abids', 'Somajiguda', 'Koti', 'Film Nagar'];

const keywordsByCategory = {
  'Photography/Videography': ['Studio', 'Photography', 'Pixels', 'Captures', 'Films', 'Weddings', 'Lens', 'Clicks', 'Creations', 'Media', 'Visuals', 'Memories', 'Digital', 'Shots'],
  'Event Planners': ['Events', 'Planners', 'Concepts', 'Weddings', 'Elite', 'Signature', 'Dream', 'Royal', 'Celebrations', 'Planners', 'Designs', 'Gala', 'Affair', 'Occasions'],
  'Decorators': ['Decors', 'Flowers', 'Theme', 'Creations', 'Art', 'Designs', 'Stylists', 'Craft', 'Drapes', 'Flora', 'Vibe', 'Ambiance', 'Petals', 'Glow'],
  'Caterers': ['Caters', 'Food', 'Kitchen', 'Catering', 'Hospitality', 'Flavors', 'Feast', 'Gourmet', 'Culinary', 'Delight', 'Bites', 'Spices', 'Taste', 'Banquet'],
  'Makeup Artists': ['Makeover', 'Studio', 'Bridal', 'Beauty', 'Glam', 'Artistry', 'Salon', 'Blush', 'Glow', 'Stylist', 'Cosmetics', 'Chic', 'Faces', 'Divine'],
  'Venues': ['Convention Centre', 'Grand', 'Convention', 'Palace', 'Garden', 'Hall', 'Banquet', 'Lawn', 'Pavilion', 'Arena', 'Resort', 'Villa', 'Plaza', 'Manor']
};

const highlightFeaturesByCategory = {
  'Photography/Videography': ['Premium Equipment', 'Same Day Delivery', 'Drone Photography', 'Candid Specialist', 'Cinematic Video', 'Album Printing'],
  'Event Planners': ['End-to-End Execution', 'Theme Customization', 'Vendor Coordination', 'Budget Friendly', 'Destination Weddings', 'Corporate Events'],
  'Decorators': ['Floral Arches', 'LED Lighting setup', 'Eco-friendly Materials', 'Theme Customization', 'Mandap Designs', 'Stage Backgrounds'],
  'Caterers': ['Live Counter', 'Multi-cuisine Menu', 'Professional Servers', 'Hygiene Certified', 'Customized Mocktails', 'Premium Crockery'],
  'Makeup Artists': ['HD Makeup', 'Airbrush Makeup', 'Hairstyling Included', 'Premium Brand Products', 'Pre-bridal Consultations', 'Travels to Venue'],
  'Venues': ['Valet Parking', 'AC Banquet Halls', 'In-house Decorators', 'Power Backup', 'Catering Friendly', 'Green Rooms Included']
};

function generateVendorsForCategory(category, count) {
  const vendors = [];
  const kws = keywordsByCategory[category];
  const features = highlightFeaturesByCategory[category];

  for (let i = 1; i <= count; i++) {
    const fName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const kw1 = kws[Math.floor(Math.random() * kws.length)];
    const kw2 = kws[(Math.floor(Math.random() * kws.length) + 1) % kws.length];
    
    let brandName = "";
    if (Math.random() > 0.5) {
      brandName = `${fName} ${kw1}`;
    } else {
      brandName = `${kw1} ${kw2}`;
    }
    
    // Append index to brand name to guarantee uniqueness
    brandName = `${brandName} ${i}`;

    const area = areas[Math.floor(Math.random() * areas.length)];
    const address = `${i * 10 + 5}, Road No ${Math.floor(Math.random() * 15) + 1}, ${area}, Hyderabad, Telangana 5000${Math.floor(Math.random() * 80 + 10)}`;
    const phone = `9${Math.floor(Math.random() * 9)}000${Math.floor(10000 + Math.random() * 90000)}`;
    const email = `${brandName.toLowerCase().replace(/[^a-z0-9]/g, '')}@gmail.com`;
    const expYears = Math.floor(Math.random() * 15) + 2;
    const experience = `${expYears} Years`;
    const eventsCompleted = Math.floor(Math.random() * 400) + 50;
    const rating = parseFloat((4.0 + Math.random() * 1.0).toFixed(1));
    
    let basePrice = 20000;
    if (category === 'Venues') basePrice = 100000 + Math.floor(Math.random() * 10) * 50000;
    else if (category === 'Event Planners') basePrice = 50000 + Math.floor(Math.random() * 8) * 20000;
    else if (category === 'Caterers') basePrice = 40000 + Math.floor(Math.random() * 6) * 10000;
    else if (category === 'Photographers') basePrice = 30000 + Math.floor(Math.random() * 8) * 15000;
    else if (category === 'Makeup Artists') basePrice = 15000 + Math.floor(Math.random() * 5) * 5000;
    else basePrice = 20000 + Math.floor(Math.random() * 5) * 10000;

    const slug = `${brandName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${area.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

    const vendorFeatures = [];
    const shuf = [...features].sort(() => 0.5 - Math.random());
    vendorFeatures.push(shuf[0], shuf[1], shuf[2]);

    vendors.push({
      brand_name: brandName,
      spoc_name: `${fName} ${lName}`,
      category: [category],
      categories: [category],
      phone_number: phone,
      whatsapp_number: phone,
      email: email,
      address: address,
      experience: experience,
      quick_intro: `Professional ${category.toLowerCase()} services based in ${area}, Hyderabad.`,
      detailed_intro: `With ${experience} of professional service in the wedding and event industry, ${brandName} has delivered premium service for over ${eventsCompleted} celebrations. We guarantee high quality results, competitive pricing, and client satisfaction.`,
      highlight_features: vendorFeatures,
      events_completed: eventsCompleted,
      rating: rating,
      verified: true,
      starting_price: basePrice,
      languages: ['Telugu', 'English', 'Hindi'],
      services: [
        { name: `Standard ${category} Service`, description: `Full professional ${category.toLowerCase()} package`, price: basePrice },
        { name: `Premium ${category} Service`, description: `Deluxe customizable ${category.toLowerCase()} setup`, price: Math.round(basePrice * 1.5) }
      ],
      packages: [
        { name: 'Standard Package', price: `₹${basePrice.toLocaleString()}`, popular: false, features: [`Standard ${category.toLowerCase()} deliverables`, 'Professional assistance', 'Full event coverage'] },
        { name: 'Elite Package', price: `₹${Math.round(basePrice * 1.5).toLocaleString()}`, popular: true, features: [`Premium ${category.toLowerCase()} customization`, 'Senior crew coverage', 'Priority delivery and support'] }
      ],
      deliverables: [`Complete event setup for ${category.toLowerCase()}`, 'High-resolution resources', 'Post-event service support'],
      slug: slug
    });
  }
  return vendors;
}

async function main() {
  const categories = ['Photography/Videography', 'Event Planners', 'Decorators', 'Caterers', 'Makeup Artists', 'Venues'];
  console.log("🚀 Starting vendor database seed operation...");

  for (const category of categories) {
    console.log(`\n--------------------------------------------`);
    console.log(`Generating 100 vendors for Category: "${category}"...`);
    const vendors = generateVendorsForCategory(category, 100);
    
    // Batch insert 50 records at a time to prevent payload errors
    const batchSize = 50;
    for (let i = 0; i < vendors.length; i += batchSize) {
      const batch = vendors.slice(i, i + batchSize);
      const batchNum = i / batchSize + 1;
      console.log(`👉 Inserting batch ${batchNum}/2 of ${category}...`);
      
      const { data: inserted, error } = await supabase
        .from('vendors')
        .insert(batch)
        .select('vendor_id, brand_name');
        
      if (error) {
        console.error(`❌ Error inserting batch ${batchNum} of ${category}:`, error.message);
        continue;
      }
      
      console.log(`✅ Stored ${inserted.length} vendors. Generating user logins...`);
      
      const creds = inserted.map(v => ({
        vendor_id: v.vendor_id,
        username: v.vendor_id.toString(),
        password: 'password123',
        is_active: true,
        created_at: new Date().toISOString(),
        last_login: null,
        vendor_name: v.brand_name
      }));
      
      const { error: credError } = await supabase
        .from('vendor_credentials')
        .insert(creds);
        
      if (credError) {
        console.error(`❌ Error inserting credentials for batch ${batchNum}:`, credError.message);
      } else {
        console.log(`✅ Login credentials created successfully for all ${creds.length} vendors.`);
      }
    }
  }
  console.log("\n============================================");
  console.log("🎉 DATA SEED COMPLETED: 600 vendors added!");
  console.log("============================================");
}

main();
