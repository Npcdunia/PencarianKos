
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";

import {
  View,
  Text,
  FlatList,
  TextInput,
  Pressable,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { styles } from "../styles/styles";
import { useFavorit } from "../Context/FavoritContext";

interface Kos {
  id: number;
  nama: string;
  harga: number;
  rating: number;
  sisaKamar: number;
  fasilitas: string[];
  latitude: number;
  longitude: number;
}

const kosData: Kos[] = [
  {
    id: 1,
    nama: "Kos Mawar",
    harga: 750000,
    rating: 4.5,
    sisaKamar: 2,
    fasilitas: ["WiFi", "AC", "Parkir"],
    latitude: -7.921,
    longitude: 112.603,
  },
  {
    id: 2,
    nama: "Kos Melati",
    harga: 650000,
    rating: 4.2,
    sisaKamar: 4,
    fasilitas: ["WiFi", "Parkir"],
    latitude: -7.923,
    longitude: 112.604,
  },
  {
    id: 3,
    nama: "Kos Anggrek",
    harga: 850000,
    rating: 4.7,
    sisaKamar: 1,
    fasilitas: ["WiFi", "AC", "Kamar Mandi Dalam"],
    latitude: -7.920,
    longitude: 112.605,
  },
];

function formatHarga(harga: number) {
  return `Rp${harga.toLocaleString("id-ID")}`;
}

export default function HomeScreen() {
  const router = useRouter();

  const { kosTersimpan, toggleMarkah } = useFavorit();

  const [kataKunci, setKataKunci] = useState("");
  const [kosTerfilter, setKosTerfilter] =
    useState<Kos[]>(kosData);

  // Memfilter kos berdasarkan kata pencarian
  useEffect(() => {
    const hasil = kosData.filter((kos) =>
      kos.nama
        .toLowerCase()
        .includes(kataKunci.toLowerCase())
    );

    setKosTerfilter(hasil);
  }, [kataKunci]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        KosFinder
      </Text>

      {/* Tombol menuju halaman favorit */}
      <Pressable
        onPress={() => router.push("/favorit")}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#DCFCE7",
          padding: 12,
          borderRadius: 10,
          marginBottom: 15,
        }}
      >
        <Ionicons
          name="bookmark"
          size={20}
          color="#166534"
        />

        <Text
          style={{
            color: "#166534",
            fontWeight: "bold",
            marginLeft: 8,
          }}
        >
          Kos Favorit ({kosTersimpan.length})
        </Text>
      </Pressable>

      {/* Search Bar */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "white",
          borderWidth: 1,
          borderColor: "#ddd",
          borderRadius: 10,
          marginBottom: 15,
          paddingHorizontal: 12,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            marginRight: 8,
          }}
        >
          🔍
        </Text>

        <TextInput
          placeholder="Cari kos..."
          value={kataKunci}
          onChangeText={setKataKunci}
          style={{
            flex: 1,
            paddingVertical: 12,
            fontSize: 15,
          }}
        />
      </View>

      {/* Daftar Kos */}
      <FlatList
        data={kosTerfilter}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text style={styles.info}>
            Kos tidak ditemukan.
          </Text>
        }
        renderItem={({ item }) => {
          const sudahDisimpan =
            kosTersimpan.includes(item.id);

          return (
            <View style={styles.kosCard}>
              <Text style={styles.kosName}>
                {item.nama}
              </Text>

              <Text style={styles.price}>
                {formatHarga(item.harga)}
              </Text>

              <Text style={styles.info}>
                ⭐ {item.rating}
              </Text>

              <Text style={styles.info}>
                {item.sisaKamar} kamar tersedia
              </Text>

              <Text style={styles.facilityTitle}>
                Fasilitas:
              </Text>

              <View style={styles.facilityContainer}>
                {item.fasilitas.map(
                  (fasilitas, index) => (
                    <View
                      key={index}
                      style={styles.facilityItem}
                    >
                      <Text style={styles.facilityText}>
                        {fasilitas}
                      </Text>
                    </View>
                  )
                )}
              </View>

              {/* Tombol Detail dan Bookmark */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 12,
                }}
              >
                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: "/detail",
                      params: {
                        id: item.id.toString(),
                      },
                    })
                  }
                  style={{
                    backgroundColor: "#16A34A",
                    paddingVertical: 9,
                    paddingHorizontal: 14,
                    borderRadius: 8,
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    Lihat Detail
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => toggleMarkah(item.id)}
                  accessibilityRole="button"
                  accessibilityLabel={
                    sudahDisimpan
                      ? `Hapus markah ${item.nama}`
                      : `Simpan ${item.nama}`
                  }
                  hitSlop={8}
                >
                  <Ionicons
                    name={
                      sudahDisimpan
                        ? "bookmark"
                        : "bookmark-outline"
                    }
                    size={28}
                    color={
                      sudahDisimpan
                        ? "#16A34A"
                        : "#000000"
                    }
                  />
                </Pressable>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}
