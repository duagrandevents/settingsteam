
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rstllmtiofeopdxfgpjj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzdGxsbXRpb2Zlb3BkeGZncGpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4NDM2ODEsImV4cCI6MjA4NTQxOTY4MX0.kVcKi2bTyjiufEyJYWrr8aVJsz4kcufaFGxmzqsGTS4';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
    console.log('Testing connection to:', supabaseUrl);
    try {
        const { data, error } = await supabase.from('sites').select('*').limit(1);
        if (error) {
            console.log('❌ CONNECTION FAILED');
            console.log('Error Code:', error.code);
            console.log('Error Message:', error.message);
            console.log('Error Hint:', error.hint);
            console.log('Full Error:', JSON.stringify(error, null, 2));
        } else {
            console.log('✅ CONNECTION SUCCESSFUL');
            console.log('Data sample:', data);
        }
    } catch (err) {
        console.log('💥 UNEXPECTED CRASH:', err.message);
    }
}

testConnection();
