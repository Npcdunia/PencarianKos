import { useCallback, useEffect, useState } from "react";

import { ambilDataKos, ambilDataKosPromise } from "../services/kosApi";
import type { Kos } from "../types/kos";

let kosCache: Kos[] | null = null;

export function useKos() {
  const [daftarKos, setDaftarKos] = useState<Kos[]>(kosCache ?? []);
  const [loading, setLoading] = useState<boolean>(kosCache === null);
  const [error, setError] = useState<string | null>(null);
  const muatData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ambilDataKos(); 
      kosCache = data;
      console.log("Jumlah kos dari API:", data.length); 
      setDaftarKos(data);
    } catch (e) {
      
      setError(e instanceof Error ? e.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }, []);

  const muatUlang = useCallback(() => {
    setLoading(true);
    setError(null);
    return ambilDataKosPromise()
      .then((data) => {
        kosCache = data; 
        setDaftarKos(data);
      })
      .catch((e: unknown) => {
      
        setError(e instanceof Error ? e.message : "Terjadi kesalahan");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (kosCache === null) {
      muatData();
    }
  }, [muatData]);

  return { daftarKos, loading, error, muatUlang };
}
