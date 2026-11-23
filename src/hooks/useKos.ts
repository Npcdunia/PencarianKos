
import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { ambilDataKos } from "../services/kosApi";
import type { Kos } from "../types/kos";

const CACHE_KEY = "daftar-kos-openstreetmap";

export function useKos() {
  const [daftarKos, setDaftarKos] = useState<Kos[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const ambilDataTerbaru = useCallback(async (tampilkanLoading: boolean) => {
    if (tampilkanLoading) {
      setLoading(true);
    }

    setError(null);

    try {
      const data = await ambilDataKos();

      setDaftarKos(data);

      // Simpan hasil API ke penyimpanan lokal
      await AsyncStorage.setItem(
        CACHE_KEY,
        JSON.stringify(data)
      );
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Terjadi kesalahan saat mengambil data"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let aktif = true;

    async function mulai() {
      try {
        // Ambil data yang pernah disimpan
        const cache = await AsyncStorage.getItem(CACHE_KEY);

        if (cache && aktif) {
          const data = JSON.parse(cache) as Kos[];

          setDaftarKos(data);
          setLoading(false);
        }
      } catch (e) {
        console.log("Gagal membaca cache:", e);
      }

      // Tetap perbarui data dari OpenStreetMap
      if (aktif) {
        ambilDataTerbaru(false);
      }
    }

    mulai();

    return () => {
      aktif = false;
    };
  }, [ambilDataTerbaru]);

  const muatUlang = useCallback(() => {
    return ambilDataTerbaru(true);
  }, [ambilDataTerbaru]);

  return {
    daftarKos,
    loading,
    error,
    muatUlang,
  };
}
