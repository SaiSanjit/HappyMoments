const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://hemofpnccbnfcmlibxbr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhlbW9mcG5jY2JuZmNtbGlieGJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwMTkwMTYsImV4cCI6MjA3MzU5NTAxNn0.RDK5ZGGoJHY0K2dbIZKZKz1em6m-bS-NCJGdjSFO-No';

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log("Fetching vendors...");
  const { data: vendors, error: vendorsError } = await supabase
    .from('vendors')
    .select('vendor_id, brand_name');

  if (vendorsError) {
    console.error("Error fetching vendors:", vendorsError);
    return;
  }

  console.log(`Fetched ${vendors.length} vendors.`);

  console.log("Fetching vendor credentials...");
  const { data: credentials, error: credentialsError } = await supabase
    .from('vendor_credentials')
    .select('id, vendor_id');

  if (credentialsError) {
    console.error("Error fetching credentials:", credentialsError);
    return;
  }

  console.log(`Fetched ${credentials.length} credential records. Processing updates...`);

  // Build a map of vendor_id -> brand_name
  const vendorMap = new Map();
  vendors.forEach(v => {
    vendorMap.set(v.vendor_id, v.brand_name);
  });

  let updateCount = 0;
  for (const cred of credentials) {
    const brandName = vendorMap.get(cred.vendor_id);
    if (brandName) {
      console.log(`Updating credential ID ${cred.id} (Vendor ID ${cred.vendor_id}) with name: "${brandName}"...`);
      const { error: updateError } = await supabase
        .from('vendor_credentials')
        .update({ vendor_name: brandName })
        .eq('id', cred.id);

      if (updateError) {
        console.error(`Error updating credential record ${cred.id}:`, updateError.message);
      } else {
        updateCount++;
      }
    } else {
      console.log(`⚠️ No matching vendor found for vendor_id: ${cred.vendor_id}`);
    }
  }

  console.log(`--- UPDATES COMPLETED: Successfully updated ${updateCount}/${credentials.length} records ---`);
}

main();
