import { KOS_API_URL } from "../constants/api";
import type { Kos, OverpassElement, OverpassResponse } from "../types/kos";

// ---------------------------------------------------------------
// BAGIAN A: Mengubah 1 data mentah OSM menjadi 1 Object Kos
// ---------------------------------------------------------------
function ubahKeKos(el: OverpassElement): Kos | null {
  const tags = el.tags ?? {};

  // Node punya lat/lon langsung, way/relation punya center.
  const latitude = el.lat ?? el.center?.lat;
  const longitude = el.lon ?? el.center?.lon;

  // Data tanpa nama atau tanpa koordinat dibuang.
  if (!tags.name || latitude === undefined || longitude === undefined) {
    return null;
  }

  // id OSM bisa sama untuk node dan way, jadi kita bedakan dengan angka akhir.
  const kodeJenis = el.type === "node" ? 1 : el.type === "way" ? 2 : 3;
  const id = el.id * 10 + kodeJenis;

  // Jenis tempat
  let tipe = "Kos";
  if (tags.tourism === "guest_house") tipe = "Guest house";
  else if (tags.tourism === "hostel") tipe = "Hostel";
  else if (tags.building === "dormitory") tipe = "Asrama";

  // Alamat: gabungkan tag yang ada saja
  const jalan = [tags["addr:street"], tags["addr:housenumber"]]
    .filter(Boolean)
    .join(" ");
  const alamat = [jalan, tags["addr:suburb"], tags["addr:city"]]
    .filter(Boolean)
    .join(", ");

  // Fasilitas: hanya yang tertulis di tag OSM
  const fasilitas: string[] = [];
  if (tags.internet_access === "wlan" || tags.internet_access === "yes") {
    fasilitas.push("WiFi");
  }
  if (tags.air_conditioning === "yes") fasilitas.push("AC");
  if (tags.parking && tags.parking !== "no") fasilitas.push("Parkir");

  return {
    id,
    nama: tags.name,
    tipe,
    alamat,
    telepon: tags.phone ?? tags["contact:phone"] ?? "",
    fasilitas,
    latitude,
    longitude,
    // ESTIMASI DEMO: OpenStreetMap tidak punya harga, rating, dan sisa kamar.
    // Dihitung dari id supaya nilainya selalu sama untuk kos yang sama.
    harga: 400000 + (id % 12) * 50000, // Rp400.000 - Rp950.000
    rating: (35 + (id % 15)) / 10, // 3.5 - 4.9
    sisaKamar: 1 + (id % 6), // 1 - 6
  };
}

// Mengubah seluruh JSON respons menjadi daftar Kos
export function ubahKeDaftarKos(json: OverpassResponse): Kos[] {
  const hasil: Kos[] = [];
  for (const el of json.elements) {
    const kos = ubahKeKos(el);
    if (kos) hasil.push(kos);
  }
  return hasil;
}

// ---------------------------------------------------------------
// BAGIAN B: Versi async/await (dipakai oleh aplikasi)
// ---------------------------------------------------------------
export async function ambilDataKos(): Promise<Kos[]> {
  // 1. fetch() mengirim permintaan ke API, kita tunggu dengan await
  const response = await fetch(KOS_API_URL);

  // 2. Jika server membalas error (404, 429, 504, dst), anggap gagal
  if (!response.ok) {
    throw new Error(`Gagal mengambil data (status ${response.status})`);
  }

  // 3. Ubah isi balasan dari teks JSON menjadi Object
  const json = (await response.json()) as OverpassResponse;

  // 4. Ubah Object mentah menjadi daftar Kos sesuai Interface
  return ubahKeDaftarKos(json);
}

// ---------------------------------------------------------------
// BAGIAN C: Versi Promise murni (.then, resolve, reject) untuk demo
// Hasilnya sama persis dengan ambilDataKos().
// ---------------------------------------------------------------
export function ambilDataKosPromise(): Promise<Kos[]> {
  return new Promise<Kos[]>((resolve, reject) => {
    fetch(KOS_API_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Gagal mengambil data (status ${response.status})`);
        }
        return response.json();
      })
      .then((json: OverpassResponse) => {
        resolve(ubahKeDaftarKos(json)); // berhasil
      })
      .catch((error) => {
        reject(error); // gagal
      });
  });
}
