
import { View, Text, ActivityIndicator, FlatList } from "react-native";
import { useKosSupabase } from "../hooks/usekosSupabase";

export default function TestSupabaseScreen() {
  const { daftarKos, loading, error } = useKosSupabase();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text>Memuat data dari Supabase...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ padding: 20 }}>
        <Text>Gagal mengambil data: {error}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 15 }}>
        Data Kos dari Supabase
      </Text>

      <Text>Total data ditampilkan: {daftarKos.length}</Text>

      <FlatList
        data={daftarKos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ paddingVertical: 12, borderBottomWidth: 1, borderColor: "#ccc" }}>
            <Text style={{ fontWeight: "bold" }}>{item.nama}</Text>
            <Text>{item.kota} - {item.kecamatan}</Text>
            <Text>Harga: Rp{item.harga?.toLocaleString("id-ID")}</Text>
            <Text>Rating: {item.rating ?? "-"}</Text>
          </View>
        )}
      />
    </View>
  );
}
