import type { Kos } from "../types/kos";

// Kriteria pencarian: kata kunci + rentang harga (kosong = tidak dibatasi).
export interface FilterKos {
  kataKunci: string;
  hargaMin: number | null;
  hargaMax: number | null;
}

export function saringKos(daftarKos: Kos[], filter: FilterKos): Promise<Kos[]> {
  return new Promise<Kos[]>((resolve, reject) => {
    const { kataKunci, hargaMin, hargaMax } = filter;

    if (
      (hargaMin !== null && hargaMin < 0) ||
      (hargaMax !== null && hargaMax < 0)
    ) {
      reject(new Error("Harga tidak boleh negatif."));
      return;
    }

    if (hargaMin !== null && hargaMax !== null && hargaMin > hargaMax) {
      reject(new Error("Harga minimum tidak boleh lebih besar dari maksimum."));
      return;
    }

    const kata = kataKunci.trim().toLowerCase();

    const hasil = daftarKos.filter((kos) => {
      const cocokNama = kos.nama.toLowerCase().includes(kata);
      const cocokMin = hargaMin === null || kos.harga >= hargaMin;
      const cocokMax = hargaMax === null || kos.harga <= hargaMax;
      return cocokNama && cocokMin && cocokMax;
    });

    resolve(hasil);
  });
}

// Mengubah teks input ("500.000", "500000", "") menjadi angka / null.
export function parseHarga(teks: string): number | null {
  const angka = teks.replace(/\D/g, "");
  return angka === "" ? null : Number(angka);
}
