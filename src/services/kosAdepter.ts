
import type { Kos } from "../types/kos";
import type { KosDatabase } from "../types/kosDatabase";

export function ubahKeKos(data: KosDatabase[]): Kos[] {
  return data.map((item) => ({
    id: item.id,
    nama: item.nama,
    tipe: item.tipe ?? "Kos",
    alamat: item.alamat ?? "",
    telepon: item.telepon ?? "",
    fasilitas: item.fasilitas ?? [],

    // Data katalog fiktif tidak memiliki koordinat lokasi nyata.
    latitude: 0,
    longitude: 0,

    harga: item.harga ?? 0,
    rating: item.rating ?? 0,
    sisaKamar: item.sisa_kamar ?? 0,
  }));
}
