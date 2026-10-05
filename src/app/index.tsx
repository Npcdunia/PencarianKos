import {
  View,
  Text,
  FlatList,
  TextInput,
} from "react-native";

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
    latitude: -7.920,
    longitude: 112.605,
  },
];

function formatHarga(harga: number) {
  return `Rp${harga.toLocaleString("id-ID")}`;
}

export default function HomeScreen() {
  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        KosFinder
      </Text>

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
          style={{
            flex: 1,
            paddingVertical: 12,
            fontSize: 15,
          }}
        />
      </View>

      <FlatList
        data={kosData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
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
              {item.fasilitas.map((fasilitas, index) => (
                <View
                  key={index}
                  style={styles.facilityItem}
                >
                  <Text style={styles.facilityText}>
                    {fasilitas}
                  </Text>
                </View>
              ))}
            </View>

          </View>
        )}
      />

    </View>
  );
}