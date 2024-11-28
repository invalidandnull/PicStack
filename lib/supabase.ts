import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getCredits = async (email: string) => {
  const { data, error } = await supabase.from('users').select('credits').eq('email', email).single();
  return data?.credits || 0;
};

export const decrementCredits = async (email: string) => {
  const credits = await getCredits(email);
  if (credits <= 0) return false;
  const newCredits = credits - 1;
  const { error } = await supabase
    .from('users')
    .update({ credits: newCredits })
    .eq('email', email)
    .single();
  return error ? false : true;
};
