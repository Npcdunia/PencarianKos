// External API: OpenStreetMap lewat Overpass API (gratis, tanpa API key).
// Dokumentasi: https://wiki.openstreetmap.org/wiki/Overpass_API

export const OVERPASS_URL = "https://overpass-api.de/api/interpreter";

// Kotak area pencarian: sekitar Kota Malang (selatan, barat, utara, timur).
const AREA = "-8.03,112.57,-7.90,112.69";

// Query Overpass: cari guest house, hostel, asrama, dan tempat bernama "Kos ...".
// "out center tags 50" = ambil maksimal 50 data beserta titik koordinatnya.
const QUERY = `
[out:json][timeout:25];
(
  nwr["tourism"~"guest_house|hostel"]["name"](${AREA});
  nwr["building"="dormitory"]["name"](${AREA});
  nwr["name"~"^(kos|kost) ",i](${AREA});
);
out center tags 50;
`;

// Alamat lengkap endpoint (query dikirim lewat parameter ?data=)
export const KOS_API_URL = `${OVERPASS_URL}?data=${encodeURIComponent(QUERY)}`;
