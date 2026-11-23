import { supabase } from './supabase';

export async function testSupabaseConnection() {
  const { data, error } = await supabase
    .from('kos')
    .select('id, nama')
    .limit(5);

  if (error) {
    console.log('Koneksi gagal:', error.message);
    return;
  }

  console.log('Koneksi berhasil!');
  console.log('Data kos:', data);
}