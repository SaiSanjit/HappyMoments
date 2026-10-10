const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://hemofpnccbnfcmlibxbr.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhlbW9mcG5jY2JuZmNtbGlieGJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwMTkwMTYsImV4cCI6MjA3MzU5NTAxNn0.RDK5ZGGoJHY0K2dbIZKZKz1em6m-bS-NCJGdjSFO-No';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const vendorId = 73;
  const startDateTime = '2026-08-09T09:00:00+05:30';
  const endDateTime = '2026-08-09T17:00:00+05:30';

  console.log(`Testing conflict check for vendor ${vendorId}...`);
  try {
    let query = supabase
      .from('vendor_events')
      .select('id, title, start_datetime, end_datetime')
      .eq('vendor_id', vendorId)
      .not('status', 'in', '(cancelled,completed)')
      .or(`and(start_datetime.lte.${startDateTime},end_datetime.gt.${startDateTime}),and(start_datetime.lt.${endDateTime},end_datetime.gte.${endDateTime}),and(start_datetime.gte.${startDateTime},end_datetime.lte.${endDateTime})`);

    const { data, error } = await query;
    if (error) {
      console.error('❌ Conflict query error:', error);
    } else {
      console.log('✅ Conflict query succeeded, found conflicts:', data);
    }
  } catch (err) {
    console.error('💥 Exception during conflict check:', err);
  }
}

run();
