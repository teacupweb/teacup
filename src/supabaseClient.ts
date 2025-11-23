import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  `${import.meta.env.VITE_DB_URL}`,
  `${import.meta.env.VITE_DB_ANON}`
);
export default supabase;
