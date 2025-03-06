import { createClient } from "@supabase/supabase-js";

export const supabaseBaseUrl = process.env.SUPABASE_URL;
// console.log(process.env);
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseBaseUrl, supabaseKey);
export default supabase;
