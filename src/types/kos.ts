// ===== 1. Bentuk data kos yang dipakai aplikasi =====
export interface Kos {
  id: number;
  nama: string;
  tipe: string; // contoh: "Guest house", "Hostel", "Asrama", "Kos"
  alamat: string; // "" jika tidak ada di OSM
  telepon: string; // "" jika tidak ada di OSM
  fasilitas: string[]; // dibuat dari tag OSM, bisa []
  latitude: number;
  longitude: number;
  // 3 field di bawah TIDAK ada di OpenStreetMap.
  // Nilainya hanya ESTIMASI untuk demo (dihitung di kosApi.ts).
  harga: number;
  rating: number;
  sisaKamar: number;
}

// ===== 2. Bentuk respons mentah dari Overpass API (OpenStreetMap) =====
export interface OverpassElement {
  type: "node" | "way" | "relation";
  id: number;
  lat?: number; // ada jika type = "node"
  lon?: number;
  center?: { lat: number; lon: number }; // ada jika type = "way" / "relation"
  tags?: Record<string, string>;
}

export interface OverpassResponse {
  elements: OverpassElement[];
}
