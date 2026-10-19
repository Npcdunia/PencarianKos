
import { useRouter } from "expo-router";
import {
  View,
  Text,
  FlatList,
  Pressable,
} from "react-native";

import { useFavorit } from "../Context/FavoritContext";

const kosData = [
  {
    id: 1,
    nama: "Kos Mawar",
    harga: 750000,
    rating: 4.5,
    sisaKamar: 2,
    fasilitas: ["WiFi", "AC", "Parkir"],
  },
  {
    id: 2,
    nama: "Kos Melati",
    harga: 650000,
    rating: 4.2,
    sisaKamar: 4,
    fasilitas: ["WiFi", "Parkir"],
  },
  {
    id: 3,
    nama: "Kos Anggrek",
    harga: 850000,
    rating: 4.7,
    sisaKamar: 1,
    fasilitas: ["WiFi", "AC", "Kamar Mandi Dalam"],
  },
];

export default function FavoritScreen() {
  const router = useRouter();
  const { kosTersimpan, toggleMarkah } = useFavorit();

  const daftarFavorit = kosData.filter((kos) =>
    kosTersimpan.includes(kos.id)
  );

  return (
    <View
      style={{
        flex: 1,
        padding: 20,
        backgroundColor: "#F0FFF5",
      }}
    >
      <Text
        style={{
          fontSize: 26,
          fontWeight: "bold",
          color: "#166534",
          marginBottom: 20,
        }}
      >
        Kos Favorit ({daftarFavorit.length})
      </Text>

      <FlatList
        data={daftarFavorit}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text style={{ fontSize: 16, marginTop: 20 }}>
            Belum ada kos favorit. Tandai kos dari halaman utama, ya!
          </Text>
        }
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: "#FFFFFF",
              padding: 16,
              borderRadius: 12,
              marginBottom: 14,
              borderWidth: 1,
              borderColor: "#D1FAE5",
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              {item.nama}
            </Text>

            <Text style={{ fontSize: 16, marginTop: 8 }}>
              Rp{item.harga.toLocaleString("id-ID")} / bulan
            </Text>

            <Text style={{ marginTop: 5 }}>
              ⭐ {item.rating}
            </Text>

            <Text style={{ marginTop: 5 }}>
              {item.sisaKamar} kamar tersedia
            </Text>

            <Text style={{ marginTop: 5 }}>
              Fasilitas: {item.fasilitas.join(", ")}
            </Text>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 16,
              }}
            >
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/detail",
                    params: { id: item.id.toString() },
                  })
                }
                style={{
                  backgroundColor: "#16A34A",
                  padding: 10,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  Lihat Detail
                </Text>
              </Pressable>

              <Pressable
                onPress={() => toggleMarkah(item.id)}
                style={{
                  backgroundColor: "#FEE2E2",
                  padding: 10,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: "#B91C1C", fontWeight: "bold" }}>
                  Hapus Favorit
                </Text>
              </Pressable>
            </View>
          </View>
        )}
      />

      <Pressable
        onPress={() => router.back()}
        style={{
          backgroundColor: "#2563EB",
          padding: 14,
          borderRadius: 10,
          alignItems: "center",
          marginTop: 10,
          marginBottom: 10,
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>
          Kembali ke Daftar Kos
        </Text>
      </Pressable>
    </View>
  );
}
