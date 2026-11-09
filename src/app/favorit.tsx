import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";

import { useFavorit } from "../Context/FavoritContext";
import { useKos } from "../hooks/useKos";
import { parseHarga, saringKos } from "../services/filterKos";
import type { Kos } from "../types/kos";

export default function FavoritScreen() {
  const router = useRouter();
  const { kosTersimpan, toggleMarkah } = useFavorit();
  const { daftarKos } = useKos(); // data API yang sudah di-load (cache yang sama dengan halaman utama)

  const [kataKunci, setKataKunci] = useState("");
  const [teksMin, setTeksMin] = useState("");
  const [teksMax, setTeksMax] = useState("");
  const [pesanFilter, setPesanFilter] = useState<string | null>(null);
  const [daftarFavorit, setDaftarFavorit] = useState<Kos[]>([]);

  // Langkah 1: ambil hanya kos yang ditandai favorit dari data API.
  const favoritDariApi = useMemo(
    () => daftarKos.filter((kos) => kosTersimpan.includes(kos.id)),
    [daftarKos, kosTersimpan],
  );

  // Langkah 2: saring favorit tadi (nama + rentang harga) dengan saringKos.
  useEffect(() => {
    let dibatalkan = false;

    saringKos(favoritDariApi, {
      kataKunci,
      hargaMin: parseHarga(teksMin),
      hargaMax: parseHarga(teksMax),
    })
      .then((hasil) => {
        if (dibatalkan) return;
        setDaftarFavorit(hasil);
        setPesanFilter(null);
      })
      .catch((e: Error) => {
        if (dibatalkan) return;
        setDaftarFavorit([]);
        setPesanFilter(e.message);
      });

    return () => {
      dibatalkan = true;
    };
  }, [favoritDariApi, kataKunci, teksMin, teksMax]);

  const adaFilter = kataKunci !== "" || teksMin !== "" || teksMax !== "";
  const resetFilter = () => {
    setKataKunci("");
    setTeksMin("");
    setTeksMax("");
  };

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
        Kos Favorit ({favoritDariApi.length})
      </Text>

      {/* Filter favorit */}
      <TextInput
        placeholder="Cari di favorit..."
        value={kataKunci}
        onChangeText={setKataKunci}
        style={{
          backgroundColor: "#FFFFFF",
          borderWidth: 1,
          borderColor: "#D1FAE5",
          borderRadius: 10,
          paddingHorizontal: 12,
          paddingVertical: 10,
          marginBottom: 10,
        }}
      />

      <View style={{ flexDirection: "row", gap: 8 }}>
        {[
          { nilai: teksMin, ubah: setTeksMin, label: "Harga min" },
          { nilai: teksMax, ubah: setTeksMax, label: "Harga max" },
        ].map((f) => (
          <TextInput
            key={f.label}
            placeholder={f.label}
            keyboardType="numeric"
            value={f.nilai === "" ? "" : Number(f.nilai).toLocaleString("id-ID")}
            onChangeText={(t) => f.ubah(t.replace(/\D/g, ""))}
            accessibilityLabel={f.label}
            style={{
              flex: 1,
              backgroundColor: "#FFFFFF",
              borderWidth: 1,
              borderColor: pesanFilter ? "#DC2626" : "#D1FAE5",
              borderRadius: 10,
              paddingHorizontal: 12,
              paddingVertical: 10,
            }}
          />
        ))}
      </View>

      {pesanFilter && (
        <Text style={{ color: "#DC2626", marginTop: 8 }}>{pesanFilter}</Text>
      )}

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginVertical: 10,
        }}
      >
        <Text style={{ color: "#166534" }}>
          {daftarFavorit.length} dari {favoritDariApi.length} favorit
        </Text>
        {adaFilter && (
          <Pressable onPress={resetFilter}>
            <Text style={{ color: "#2563EB", fontWeight: "bold" }}>Reset</Text>
          </Pressable>
        )}
      </View>

      <FlatList
        data={daftarFavorit}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text style={{ fontSize: 16, marginTop: 20 }}>
            {favoritDariApi.length === 0
              ? "Belum ada kos favorit. Tandai kos dari halaman utama, ya!"
              : "Tidak ada favorit yang cocok dengan filter."}
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
              Rp{item.harga.toLocaleString("id-ID")} / bulan (estimasi)
            </Text>

            <Text style={{ marginTop: 5 }}>⭐ {item.rating}</Text>

            <Text style={{ marginTop: 5 }}>
              {item.sisaKamar} kamar tersedia
            </Text>

            <Text style={{ marginTop: 5 }}>
              Fasilitas:{" "}
              {item.fasilitas.length ? item.fasilitas.join(", ") : "-"}
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