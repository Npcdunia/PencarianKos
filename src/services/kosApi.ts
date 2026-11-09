import { KOS_API_URL } from "../constants/api";
import type { Kos, OverpassElement, OverpassResponse } from "../types/kos";

// ---------------------------------------------------------------
// FASILITAS TAMBAHAN
// ---------------------------------------------------------------
// Fasilitas ini tidak berasal dari API OSM.
// Ditentukan berdasarkan ID supaya hasilnya konsisten
// walaupun aplikasi di-reload.

const daftarFasilitas = [
  "WiFi",
  "AC",
  "Parkir",
  "Kamar Mandi Dalam",
  "Dapur",
];

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

  // ID OSM dibedakan berdasarkan jenis objek.
  const kodeJenis = el.type === "node" ? 1 : el.type === "way" ? 2 : 3;
  const id = el.id * 10 + kodeJenis;

  // -------------------------------------------------------------
  // JENIS TEMPAT
  // -------------------------------------------------------------
  let tipe = "Kos";

  if (tags.tourism === "guest_house") {
    tipe = "Guest house";
  } else if (tags.tourism === "hostel") {
    tipe = "Hostel";
  } else if (tags.building === "dormitory") {
    tipe = "Asrama";
  }

  // -------------------------------------------------------------
  // ALAMAT
  // -------------------------------------------------------------
  const jalan = [tags["addr:street"], tags["addr:housenumber"]]
    .filter(Boolean)
    .join(" ");

  const alamat = [
    jalan,
    tags["addr:suburb"],
    tags["addr:city"],
  ]
    .filter(Boolean)
    .join(", ");

  // -------------------------------------------------------------
  // FASILITAS DARI API
  // -------------------------------------------------------------
  const fasilitas: string[] = [];

  // WiFi dari data OSM
  if (
    tags.internet_access === "wlan" ||
    tags.internet_access === "yes"
  ) {
    fasilitas.push("WiFi");
  }

  // AC dari data OSM
  if (tags.air_conditioning === "yes") {
    fasilitas.push("AC");
  }

  // Parkir dari data OSM
  if (tags.parking && tags.parking !== "no") {
    fasilitas.push("Parkir");
  }

  // -------------------------------------------------------------
  // FASILITAS TAMBAHAN DARI APLIKASI
  // -------------------------------------------------------------
  // Menggunakan ID sebagai dasar perhitungan.
  // Karena ID kos sama, hasil fasilitas juga akan sama
  // walaupun data API di-load ulang.

  const fasilitasTambahan = [
    daftarFasilitas[id % daftarFasilitas.length],
    daftarFasilitas[(id + 2) % daftarFasilitas.length],
  ];

  // Masukkan fasilitas tambahan jika belum ada.
  for (const item of fasilitasTambahan) {
    if (!fasilitas.includes(item)) {
      fasilitas.push(item);
    }
  }

  // -------------------------------------------------------------
  // HASIL OBJECT KOS
  // -------------------------------------------------------------
  return {
    id,
    nama: tags.name,
    tipe,
    alamat,

    telepon:
      tags.phone ??
      tags["contact:phone"] ??
      "",

    fasilitas,

    latitude,
    longitude,

    // -----------------------------------------------------------
    // ESTIMASI DEMO
    // -----------------------------------------------------------
    // OpenStreetMap tidak menyediakan harga, rating,
    // dan jumlah kamar.
    //
    // Nilainya dihitung berdasarkan ID supaya konsisten.
    // -----------------------------------------------------------

    harga: 400000 + (id % 12) * 50000,

    rating: (35 + (id % 15)) / 10,

    sisaKamar: 1 + (id % 6),
  };
}

// ---------------------------------------------------------------
// Mengubah seluruh JSON respons menjadi daftar Kos
// ---------------------------------------------------------------
export function ubahKeDaftarKos(
  json: OverpassResponse
): Kos[] {
  const hasil: Kos[] = [];

  for (const el of json.elements) {
    const kos = ubahKeKos(el);

    if (kos) {
      hasil.push(kos);
    }
  }

  return hasil;
}

// ---------------------------------------------------------------
// BAGIAN B: Versi async/await
// Dipakai oleh aplikasi
// ---------------------------------------------------------------
export async function ambilDataKos(): Promise<Kos[]> {

  // 1. fetch() mengirim permintaan ke API
  const response = await fetch(KOS_API_URL);

  // 2. Cek apakah response dari server berhasil
  if (!response.ok) {
    throw new Error(
      `Gagal mengambil data (status ${response.status})`
    );
  }

  // 3. Ubah response JSON menjadi Object
  const json =
    (await response.json()) as OverpassResponse;

  // 4. Ubah data API menjadi daftar Kos
  return ubahKeDaftarKos(json);
}


export function ambilDataKosPromise(): Promise<Kos[]> {

  return new Promise<Kos[]>((resolve, reject) => {

    fetch(KOS_API_URL)

      .then((response) => {

        // Jika response gagal
        if (!response.ok) {
          throw new Error(
            `Gagal mengambil data (status ${response.status})`
          );
        }

        // Ambil data JSON
        return response.json();
      })

      .then((json: OverpassResponse) => {

        // Jika berhasil, ubah data menjadi daftar Kos
        resolve(ubahKeDaftarKos(json));

      })

      .catch((error) => {

        // Jika terjadi error
        reject(error);

      });
  });
}