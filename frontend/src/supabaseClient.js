import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fqhbgiyjebnkljuvybro.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxaGJnaXlqZWJua2xqdXZ5YnJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzMDU3NTUsImV4cCI6MjA5Nzg4MTc1NX0.qGhJTJDcjUIWAA-dMJLgcjqpVw2VSAqZT7ao464pItI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);