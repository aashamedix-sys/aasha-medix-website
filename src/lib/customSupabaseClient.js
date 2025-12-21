import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eybtqyuodacnlisbjzrw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5YnRxeXVvZGFjbmxpc2JqenJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5MzU0ODUsImV4cCI6MjA3NzUxMTQ4NX0.mVJ-KgJ3apLmNa4y_SbOhDxsFoezdzyQ8cdIU2wSFow';

const customSupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export default customSupabaseClient;

export { 
    customSupabaseClient,
    customSupabaseClient as supabase,
};
