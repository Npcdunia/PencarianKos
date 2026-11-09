import { useCallback, useEffect, useState } from "react";

import { ambilDataKos } from "../services/kosApi";
import type { Kos } from "../types/kos";

// Menyimpan hasil API supaya halaman Detail tidak perlu memanggil API lagi.
let kosCache: Kos[] | null = null;

// Hook yang menyediakan data kos dari API untuk fitur pencarian.
export function useKos() {
  const [daftarKos, setDaftarKos] = useState<Kos[]>(kosCache ?? []);
  const [loading, setLoading] = useState<boolean>(kosCache === null);
  const [error, setError] = useState<string | null>(null);

  const muatUlang = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ambilDataKos(); // berhasil
      kosCache = data;
      console.log("Jumlah kos dari API:", data.length); // untuk uji
      setDaftarKos(data);
    } catch (e) {
      // gagal (tidak ada internet, server sibuk, dll.)
      setError(e instanceof Error ? e.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (kosCache === null) {
      muatUlang();
    }
  }, [muatUlang]);

  return { daftarKos, loading, error, muatUlang };
}
