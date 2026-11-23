
import { useEffect, useState } from "react";
import { ambilKosSupabase } from "../services/kosSupabase";
import type { KosDatabase } from "../types/kosDatabase";

export function useKosSupabase() {
  const [daftarKos, setDaftarKos] = useState<KosDatabase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function muatKos() {
    try {
      setLoading(true);
      setError(null);

      const data = await ambilKosSupabase();
      setDaftarKos(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Terjadi kesalahan"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    muatKos();
  }, []);

  return {
    daftarKos,
    loading,
    error,
    muatKos,
  };
}
