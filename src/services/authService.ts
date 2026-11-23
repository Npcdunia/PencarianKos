import { supabase } from "../lib/supabase";

function terjemahkanError(pesan: string): string {
  const p = pesan.toLowerCase();
  if (p.includes("invalid login credentials"))
    return "Email atau password salah.";
  if (p.includes("email not confirmed"))
    return "Email belum dikonfirmasi. Cek inbox Anda.";
  if (p.includes("already registered"))
    return "Email sudah terdaftar.";
  if (p.includes("password should be at least"))
    return "Password minimal 6 karakter.";
  if (p.includes("network"))
    return "Koneksi bermasalah. Coba lagi.";
  return pesan;
}

export async function signInEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });
  if (error) throw new Error(terjemahkanError(error.message));
  return data;
}

export async function signUpEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
  });
  if (error) throw new Error(terjemahkanError(error.message));

  // Jika "Confirm email" aktif di Supabase, session = null sampai email dikonfirmasi.
  return { perluKonfirmasi: !data.session };
}

export async function signOutSupabase() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(terjemahkanError(error.message));
}