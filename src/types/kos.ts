export interface Kos {
  id: number;
  nama: string;
  tipe: string; // contoh: "Guest house", "Hostel", "Asrama", "Kos"
  alamat: string; // "" jika tidak ada di OSM
  telepon: string; // "" jika tidak ada di OSM
  fasilitas: string[]; // dibuat dari tag OSM, bisa []
  latitude: number;
  longitude: number;
  harga: number;
  rating: number;
  sisaKamar: number;
}

export interface OverpassElement {
  type: "node" | "way" | "relation";
  id: number;
  lat?: number; 
  lon?: number;
  center?: { lat: number; lon: number }; 
  tags?: Record<string, string>;
}

export interface OverpassResponse {
  elements: OverpassElement[];
}
