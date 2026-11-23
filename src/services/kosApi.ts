import { KOS_API_URL } from "../constants/api";
import type { Kos, OverpassElement, OverpassResponse } from "../types/kos";


const daftarFasilitas = [
  "WiFi",
  "AC",
  "Parkir",
  "Kamar Mandi Dalam",
  "Dapur",
];


function ubahKeKos(el: OverpassElement): Kos | null {
  const tags = el.tags ?? {};


  const latitude = el.lat ?? el.center?.lat;
  const longitude = el.lon ?? el.center?.lon;

  
  if (!tags.name || latitude === undefined || longitude === undefined) {
    return null;
  }

  // ID OSM dibedakan berdasarkan jenis objek.
  const kodeJenis = el.type === "node" ? 1 : el.type === "way" ? 2 : 3;
  const id = el.id * 10 + kodeJenis;


  let tipe = "Kos";

  if (tags.tourism === "guest_house") {
    tipe = "Guest house";
  } else if (tags.tourism === "hostel") {
    tipe = "Hostel";
  } else if (tags.building === "dormitory") {
    tipe = "Asrama";
  }


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


    harga: 400000 + (id % 12) * 50000,

    rating: (35 + (id % 15)) / 10,

    sisaKamar: 1 + (id % 6),
  };
}


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


export async function ambilDataKos(): Promise<Kos[]> {

  
  const response = await fetch(KOS_API_URL);

  if (!response.ok) {
    throw new Error(
      `Gagal mengambil data (status ${response.status})`
    );
  }

  
  const json =
    (await response.json()) as OverpassResponse;


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