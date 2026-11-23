import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase URL terbaca:', !!supabaseUrl);
console.log('Supabase Key terbaca:', !!supabaseKey);

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);