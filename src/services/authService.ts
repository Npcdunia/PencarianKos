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
  if (error) {
    // Jika gagal (mis. offline), tetap hapus session di perangkat ini
    // supaya pengguna benar-benar keluar.
    const { error: errorLokal } = await supabase.auth.signOut({
      scope: "local",
    });
    if (errorLokal) throw new Error(terjemahkanError(errorLokal.message));
  }
}

// Dipanggil saat aplikasi baru dibuka: buang session lama di perangkat
// tanpa memanggil server, agar pengguna selalu mulai dari halaman login.
export async function bersihkanSessionLokal() {
  try {
    await supabase.auth.signOut({ scope: "local" });
  } catch (e) {
    console.error("Gagal membersihkan session:", e);
  }
}