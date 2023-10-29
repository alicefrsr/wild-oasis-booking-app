import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = 'https://mhrmpbmfuesesuyejzmo.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ocm1wYm1mdWVzZXN1eWVqem1vIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTYyNjEzMDUsImV4cCI6MjAxMTgzNzMwNX0.ZGJDbfdB8TK1VXa4RGwxJ3xyv3Oit78lWv19CrkrEvw';
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
