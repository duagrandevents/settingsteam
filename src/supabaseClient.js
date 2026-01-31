import { createClient } from '@supabase/supabase-js';

// Replace these with your actual Supabase credentials
const supabaseUrl = 'https://rstllmtiofeopdxfgpjj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzdGxsbXRpb2Zlb3BkeGZncGpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4NDM2ODEsImV4cCI6MjA4NTQxOTY4MX0.kVcKi2bTyjiufEyJYWrr8aVJsz4kcufaFGxmzqsGTS4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
