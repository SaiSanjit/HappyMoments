const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://hemofpnccbnfcmlibxbr.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhlbW9mcG5jY2JuZmNtbGlieGJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwMTkwMTYsImV4cCI6MjA3MzU5NTAxNn0.RDK5ZGGoJHY0K2dbIZKZKz1em6m-bS-NCJGdjSFO-No';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log('Inspecting vendor_events schema...');
  
  // Method 1: Try to query one row
  const { data: rowData, error: rowError } = await supabase
    .from('vendor_events')
    .select('*')
    .limit(1);
    
  if (rowError) {
    console.error('Error fetching from vendor_events:', rowError);
  } else {
    console.log('Sample row data:', rowData);
  }

  // Method 2: Query column information using RPC exec_sql
  const { data: schemaData, error: schemaError } = await supabase.rpc('exec_sql', {
    sql: `
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'vendor_events';
    `
  });

  if (schemaError) {
    console.error('Error querying information_schema via exec_sql:', schemaError);
  } else {
    console.log('Table columns:', schemaData);
  }
}

run();
