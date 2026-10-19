import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

import { FlatList, Pressable, Text, TextInput, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useFavorit } from "../Context/FavoritContext";
import { useTheme } from "../Context/ThemeContext";
import { styles } from "../styles/styles";

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
    latitude: -7.92,
    longitude: 112.605,
  },
];

function formatHarga(harga: number) {
  return `Rp${harga.toLocaleString("id-ID")}`;
}

export default function HomeScreen() {
  const router = useRouter();
  const { kosTersimpan, toggleMarkah } = useFavorit();
  const { colors, isDark } = useTheme();

  const [kataKunci, setKataKunci] = useState("");
  const [kosTerfilter, setKosTerfilter] = useState<Kos[]>(kosData);

  useEffect(() => {
    const hasil = kosData.filter((kos) =>
      kos.nama.toLowerCase().includes(kataKunci.toLowerCase()),
    );

    setKosTerfilter(hasil);
  }, [kataKunci]);

  return (
    <View
      style={[
        styles.container,
        {
          flex: 1,
          backgroundColor: colors.background,
        },
      ]}
    >
      <Text style={[styles.title, { color: colors.text }]}>KosFinder</Text>

      {/* Tombol menuju halaman favorit */}
      <Pressable
        onPress={() => router.push("/favorit")}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.favoriteBackground,
          padding: 12,
          borderRadius: 10,
          marginBottom: 15,
        }}
      >
        <Ionicons name="bookmark" size={20} color={colors.favoriteText} />

        <Text
          style={{
            color: colors.favoriteText,
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
          backgroundColor: colors.input,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 10,
          marginBottom: 15,
          paddingHorizontal: 12,
        }}
      >
        <Text style={{ fontSize: 20, marginRight: 8 }}>🔍</Text>

        <TextInput
          placeholder="Cari kos..."
          placeholderTextColor={colors.secondaryText}
          value={kataKunci}
          onChangeText={setKataKunci}
          style={{
            flex: 1,
            paddingVertical: 12,
            fontSize: 15,
            color: colors.text,
          }}
        />
      </View>

      {/* Daftar Kos */}
      <FlatList
        style={{ flex: 1 }}
        data={kosTerfilter}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <Text style={[styles.info, { color: colors.secondaryText }]}>
            Kos tidak ditemukan.
          </Text>
        }
        renderItem={({ item }) => {
          const sudahDisimpan = kosTersimpan.includes(item.id);

          return (
            <View
              style={[
                styles.kosCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  borderWidth: 1,
                },
              ]}
            >
              <Text style={[styles.kosName, { color: colors.text }]}>
                {item.nama}
              </Text>

              <Text
                style={[
                  styles.price,
                  { color: isDark ? "#86EFAC" : "#15803D" },
                ]}
              >
                {formatHarga(item.harga)}
              </Text>

              <Text style={[styles.info, { color: colors.secondaryText }]}>
                ⭐ {item.rating}
              </Text>

              <Text style={[styles.info, { color: colors.secondaryText }]}>
                {item.sisaKamar} kamar tersedia
              </Text>

              <Text style={[styles.facilityTitle, { color: colors.text }]}>
                Fasilitas:
              </Text>

              <View style={styles.facilityContainer}>
                {item.fasilitas.map((fasilitas, index) => (
                  <View
                    key={index}
                    style={[
                      styles.facilityItem,
                      {
                        backgroundColor: isDark ? "#374151" : "#E5E7EB",
                      },
                    ]}
                  >
                    <Text style={[styles.facilityText, { color: colors.text }]}>
                      {fasilitas}
                    </Text>
                  </View>
                ))}
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
                    backgroundColor: colors.primary,
                    paddingVertical: 9,
                    paddingHorizontal: 14,
                    borderRadius: 8,
                  }}
                >
                  <Text
                    style={{
                      color: "#FFFFFF",
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
                    name={sudahDisimpan ? "bookmark" : "bookmark-outline"}
                    size={28}
                    color={sudahDisimpan ? colors.primary : colors.bookmark}
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
