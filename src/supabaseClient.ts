import { createClient } from '@supabase/supabase-js';
import data from './envData';
const { dbURL, dbAnon } = data;
const supabase = createClient(`${dbURL}`, `${dbAnon}`);

export default supabase;
