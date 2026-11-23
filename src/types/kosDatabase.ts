export interface KosDatabase {
  id: number;
  nama: string;
  tipe: string | null;
  alamat: string | null;
  kota: string | null;
  kecamatan: string | null;
  telepon: string | null;
  fasilitas: string[] | null;
  harga: number | null;
  rating: number | null;
  sisa_kamar: number | null;
  created_at: string;
}