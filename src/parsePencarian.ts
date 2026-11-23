// Mengubah teks pencarian menjadi { teks nama, budget maksimal }.
// Contoh: "melati 600rb" -> { teks: "melati", budget: 600000 }
// Format budget yang dikenali: 600rb, 600k, 1jt, 1,5jt, Rp600.000, 600000
const POLA = /(?:rp\.?\s*)?(\d+(?:[.,]\d+)*)\s*(rb|ribu|k|jt|juta)?(?![a-z0-9])/gi;

export function parsePencarian(input: string): {
  teks: string;
  budget: number | null;
} {
  let budget: number | null = null;

  const teks = input.replace(POLA, (cocok, angka: string, satuan?: string) => {
    let nilai: number;

    if (satuan) {
      // "1,5jt" -> 1.5 lalu dikali satuan
      nilai = parseFloat(angka.replace(",", "."));
      const s = satuan.toLowerCase();
      nilai *= s === "jt" || s === "juta" ? 1_000_000 : 1_000;
    } else {
      // "600.000" atau "600000" -> hapus pemisah ribuan
      nilai = Number(angka.replace(/[.,]/g, ""));
    }

    // Hanya angka >= 100.000 yang dianggap budget,
    // supaya nama seperti "Kos 77" tidak salah terbaca.
    if (nilai >= 100_000) {
      budget = nilai;
      return " ";
    }
    return cocok;
  });

  return { teks: teks.replace(/\s+/g, " ").trim(), budget };
}