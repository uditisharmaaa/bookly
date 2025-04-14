import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lkvhbeylhvtaohucekff.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxrdmhiZXlsaHZ0YW9odWNla2ZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1NTIxNzYsImV4cCI6MjA2MDEyODE3Nn0.9q3lvgEa5niOwleYzdOotM7W-7lvyaMh8jXRS0C5jp0';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;