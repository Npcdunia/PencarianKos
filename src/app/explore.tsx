
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

import { useKos } from "../hooks/useKos";

export default function ExploreScreen() {
  const { daftarKos, loading, error, muatUlang } = useKos();

  const [kataKunci, setKataKunci] = useState("");

  const daftarTerfilter = useMemo(() => {
    const keyword = kataKunci.toLowerCase().trim();

    if (!keyword) return daftarKos;

    return daftarKos.filter((item) => {
      return (
        item.nama.toLowerCase().includes(keyword) ||
        item.alamat.toLowerCase().includes(keyword) ||
        item.tipe.toLowerCase().includes(keyword)
      );
    });
  }, [daftarKos, kataKunci]);

  if (loading && daftarKos.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#16A34A" />
        <Text style={styles.info}>Mengambil data OpenStreetMap...</Text>
      </View>
    );
  }

  if (error && daftarKos.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Gagal mengambil data</Text>
        <Text style={styles.info}>{error}</Text>

        <Pressable style={styles.button} onPress={muatUlang}>
          <Text style={styles.buttonText}>Coba Lagi</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Jelajahi Penginapan</Text>

      <Text style={styles.info}>
        Temukan kos dan penginapan berdasarkan data OpenStreetMap.
      </Text>

      <TextInput
        placeholder="Cari nama, alamat, atau tipe..."
        value={kataKunci}
        onChangeText={setKataKunci}
        style={styles.input}
      />

      <Text style={styles.total}>
        {daftarTerfilter.length} penginapan ditemukan
      </Text>

      <FlatList
        data={daftarTerfilter}
        keyExtractor={(item) => item.id.toString()}
        refreshing={loading}
        onRefresh={muatUlang}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <Text style={styles.info}>
            Tidak ada penginapan yang cocok.
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.nama}>{item.nama}</Text>

            <Text style={styles.tipe}>{item.tipe}</Text>

            <Text style={styles.info}>
              📍 {item.alamat || "Alamat belum tersedia"}
            </Text>

            <Text style={styles.info}>
              ☎ {item.telepon || "Nomor telepon belum tersedia"}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F0FFF5",
  },
  center: {
    flex: 1,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    padding: 24,
    backgroundColor: "#F0FFF5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold" as const,
    color: "#166534",
    marginBottom: 10,
  },
  info: {
    fontSize: 14,
    color: "#374151",
    marginTop: 8,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1FAE5",
    borderRadius: 10,
    padding: 12,
    marginTop: 18,
  },
  total: {
    fontWeight: "600" as const,
    color: "#166534",
    marginVertical: 14,
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#D1FAE5",
  },
  nama: {
    fontSize: 18,
    fontWeight: "bold" as const,
    color: "#166534",
  },
  tipe: {
    fontSize: 13,
    color: "#2563EB",
    marginTop: 5,
  },
  button: {
    backgroundColor: "#16A34A",
    padding: 12,
    borderRadius: 8,
    marginTop: 15,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold" as const,
  },
};
