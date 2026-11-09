
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ActivityIndicator,
  View,
  Text,
  Pressable,
  ScrollView,
} from "react-native";

import { useKos } from "../hooks/useKos";

export default function DetailKos() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { daftarKos, loading } = useKos(); // data dari API (sudah di-cache)

  const kos = daftarKos.find(
    (item) => item.id === Number(id)
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#16A34A" />
      </View>
    );
  }

  if (!kos) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Kos tidak ditemukan</Text>

        <Pressable
          style={styles.button}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>Kembali</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{kos.nama}</Text>

      <Text style={styles.info}>
        {kos.tipe}
        {kos.alamat ? ` • ${kos.alamat}` : ""}
      </Text>

      <Text style={styles.price}>
        Rp{kos.harga.toLocaleString("id-ID")} / bulan (estimasi)
      </Text>

      <Text style={styles.info}>⭐ Rating: {kos.rating}</Text>

      <Text style={styles.info}>
        Kamar tersedia: {kos.sisaKamar}
      </Text>

      <Text style={styles.heading}>Fasilitas</Text>

      {kos.fasilitas.map((fasilitas) => (
        <Text key={fasilitas} style={styles.info}>
          • {fasilitas}
        </Text>
      ))}

      <Text style={styles.heading}>Lokasi</Text>

      <Text style={styles.info}>
        Latitude: {kos.latitude}
      </Text>

      <Text style={styles.info}>
        Longitude: {kos.longitude}
      </Text>

      <Pressable
        style={styles.button}
        onPress={() => router.back()}
      >
        <Text style={styles.buttonText}>
          Kembali ke Daftar Kos
        </Text>
      </Pressable>

      <Pressable
        style={styles.homeButton}
        onPress={() => router.replace("/")}
      >
        <Text style={styles.buttonText}>
          Ke Halaman Utama
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = {
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: "#F0FFF5",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold" as const,
    marginBottom: 16,
    color: "#166534",
  },
  price: {
    fontSize: 20,
    fontWeight: "bold" as const,
    marginBottom: 16,
  },
  info: {
    fontSize: 16,
    marginBottom: 10,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold" as const,
    marginTop: 18,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#16A34A",
    padding: 14,
    borderRadius: 8,
    alignItems: "center" as const,
    marginTop: 24,
  },
  homeButton: {
    backgroundColor: "#2563EB",
    padding: 14,
    borderRadius: 8,
    alignItems: "center" as const,
    marginTop: 12,
    marginBottom: 20,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold" as const,
    fontSize: 15,
  },
};
