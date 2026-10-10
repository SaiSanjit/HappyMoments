const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://hemofpnccbnfcmlibxbr.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhlbW9mcG5jY2JuZmNtbGlieGJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwMTkwMTYsImV4cCI6MjA3MzU5NTAxNn0.RDK5ZGGoJHY0K2dbIZKZKz1em6m-bS-NCJGdjSFO-No';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log('Testing insert event...');
  const eventData = {
    title: 'Test Event ' + Date.now(),
    description: 'This is a test event description',
    location: 'Test Location',
    start_datetime: new Date(Date.now() + 3600000).toISOString(),
    end_datetime: new Date(Date.now() + 7200000).toISOString(),
    all_day: false,
    event_type: 'booking',
    status: 'tentative',
    client_name: 'Test Client',
    client_phone: '1234567890',
    client_email: 'test@example.com',
    color: '#3B82F6',
    priority: 'medium',
    vendor_id: 73,
    created_by: 'vendor'
  };

  const { data, error } = await supabase
    .from('vendor_events')
    .insert([eventData])
    .select();

  if (error) {
    console.error('❌ Insert failed:', error);
  } else {
    console.log('✅ Insert succeeded:', data);
  }
}

run();
