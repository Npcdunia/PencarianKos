
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";

import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useFavorit } from "../Context/FavoritContext";
import { useTheme } from "../Context/ThemeContext";
import { useKosSupabase } from "../hooks/usekosSupabase";
import { parseHarga, saringKos } from "../services/filterKos";
import { ubahKeKos } from "../services/kosAdepter";
import { styles } from "../styles/styles";
import type { Kos } from "../types/kos";

function formatHarga(harga: number) {
  return `Rp${harga.toLocaleString("id-ID")}`;
}

const PILIHAN_HARGA: {
  label: string;
  min: number | null;
  max: number | null;
}[] = [
  { label: "Semua", min: null, max: null },
  { label: "< Rp500rb", min: null, max: 500000 },
  { label: "Rp500rb - 700rb", min: 500000, max: 700000 },
  { label: "> Rp700rb", min: 700000, max: null },
];

export default function HomeScreen() {
  const router = useRouter();
  const { kosTersimpan, toggleMarkah } = useFavorit();
  const { colors, isDark } = useTheme();

  const [kataKunci, setKataKunci] = useState("");
  const [teksMin, setTeksMin] = useState("");
  const [teksMax, setTeksMax] = useState("");
  const [pesanFilter, setPesanFilter] = useState<string | null>(null);

  const {
    daftarKos: dataSupabase,
    loading,
    error,
    muatKos,
  } = useKosSupabase();

  const daftarKos = useMemo(
    () => ubahKeKos(dataSupabase),
    [dataSupabase]
  );

  const [kosTerfilter, setKosTerfilter] = useState<Kos[]>([]);

  useEffect(() => {
    let dibatalkan = false;

    saringKos(daftarKos, {
      kataKunci,
      hargaMin: parseHarga(teksMin),
      hargaMax: parseHarga(teksMax),
    })
      .then((hasil) => {
        if (dibatalkan) return;

        setKosTerfilter(hasil);
        setPesanFilter(null);
      })
      .catch((e: Error) => {
        if (dibatalkan) return;

        setKosTerfilter([]);
        setPesanFilter(e.message);
      });

    return () => {
      dibatalkan = true;
    };
  }, [kataKunci, teksMin, teksMax, daftarKos]);

  const pilihanAktif = PILIHAN_HARGA.findIndex(
    (p) =>
      (p.min === null ? "" : String(p.min)) === teksMin &&
      (p.max === null ? "" : String(p.max)) === teksMax
  );

  const terapkanPilihan = (
    min: number | null,
    max: number | null
  ) => {
    setTeksMin(min === null ? "" : String(min));
    setTeksMax(max === null ? "" : String(max));
  };

  const adaFilterHarga = teksMin !== "" || teksMax !== "";

  // Semua komponen bagian atas dashboard.
  const HeaderDashboard = (
    <View>
      <Text style={[styles.title, { color: colors.text }]}>
        KosFinder
      </Text>

      {/* Tombol Favorit */}
      <Pressable
        onPress={() => router.push("/favorit")}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.favoriteBackground,
          padding: 12,
          borderRadius: 10,
          marginBottom: 10,
        }}
      >
        <Ionicons
          name="bookmark"
          size={20}
          color={colors.favoriteText}
        />

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

      {/* Tombol Explore */}
      <Pressable
        onPress={() => router.push("/explore")}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.primary,
          padding: 12,
          borderRadius: 10,
          marginBottom: 15,
        }}
      >
        <Ionicons
          name="compass-outline"
          size={20}
          color="#FFFFFF"
        />

        <Text
          style={{
            color: "#FFFFFF",
            fontWeight: "bold",
            marginLeft: 8,
          }}
        >
          Jelajahi Penginapan (OpenStreetMap)
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
        <Text style={{ fontSize: 20, marginRight: 8 }}>
          🔍
        </Text>

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

      {/* Filter Harga */}
      <View style={{ marginBottom: 12 }}>
        <Text
          style={{
            color: colors.text,
            fontWeight: "bold",
            marginBottom: 8,
          }}
        >
          Filter harga per bulan
        </Text>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}
        >
          {[
            {
              nilai: teksMin,
              ubah: setTeksMin,
              label: "Harga min",
            },
            {
              nilai: teksMax,
              ubah: setTeksMax,
              label: "Harga max",
            },
          ].map((f) => (
            <View
              key={f.label}
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: colors.input,
                borderWidth: 1,
                borderColor: pesanFilter
                  ? "#DC2626"
                  : colors.border,
                borderRadius: 10,
                paddingHorizontal: 10,
              }}
            >
              <Text
                style={{
                  color: colors.secondaryText,
                  marginRight: 4,
                }}
              >
                Rp
              </Text>

              <TextInput
                placeholder={f.label}
                placeholderTextColor={colors.secondaryText}
                keyboardType="numeric"
                value={
                  f.nilai === ""
                    ? ""
                    : Number(f.nilai).toLocaleString("id-ID")
                }
                onChangeText={(t) =>
                  f.ubah(t.replace(/\D/g, ""))
                }
                style={{
                  flex: 1,
                  paddingVertical: 10,
                  color: colors.text,
                }}
                accessibilityLabel={f.label}
              />
            </View>
          ))}
        </View>

        {/* Pilihan cepat harga */}
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 8,
            marginTop: 10,
          }}
        >
          {PILIHAN_HARGA.map((p, index) => {
            const aktif = index === pilihanAktif;

            return (
              <Pressable
                key={p.label}
                onPress={() => terapkanPilihan(p.min, p.max)}
                style={{
                  paddingVertical: 6,
                  paddingHorizontal: 12,
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: aktif
                    ? colors.primary
                    : colors.border,
                  backgroundColor: aktif
                    ? colors.primary
                    : colors.surface,
                }}
              >
                <Text
                  style={{
                    color: aktif ? "#FFFFFF" : colors.text,
                    fontSize: 13,
                  }}
                >
                  {p.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {pesanFilter && (
          <Text style={{ color: "#DC2626", marginTop: 8 }}>
            {pesanFilter}
          </Text>
        )}

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 8,
          }}
        >
          <Text style={{ color: colors.secondaryText }}>
            {kosTerfilter.length} kos ditemukan
          </Text>

          {adaFilterHarga && (
            <Pressable
              onPress={() => terapkanPilihan(null, null)}
            >
              <Text
                style={{
                  color: colors.primary,
                  fontWeight: "bold",
                }}
              >
                Reset harga
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );

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
      <FlatList
        data={kosTerfilter}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={HeaderDashboard}
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingBottom: 40,
          paddingHorizontal: 0,
        }}
        keyboardShouldPersistTaps="handled"
        refreshing={loading && dataSupabase.length > 0}
        onRefresh={muatKos}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator
              size="large"
              color={colors.primary}
              style={{ marginTop: 20 }}
            />
          ) : error ? (
            <View>
              <Text
                style={[
                  styles.info,
                  { color: colors.secondaryText },
                ]}
              >
                Gagal memuat data: {error}
              </Text>

              <Pressable
                onPress={muatKos}
                style={{
                  backgroundColor: colors.primary,
                  padding: 10,
                  borderRadius: 8,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontWeight: "bold",
                  }}
                >
                  Coba Lagi
                </Text>
              </Pressable>
            </View>
          ) : (
            <Text
              style={[
                styles.info,
                { color: colors.secondaryText },
              ]}
            >
              Kos tidak ditemukan.
            </Text>
          )
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
              <Text
                style={[
                  styles.kosName,
                  { color: colors.text },
                ]}
              >
                {item.nama}
              </Text>

              <Text
                style={[
                  styles.price,
                  {
                    color: isDark ? "#86EFAC" : "#15803D",
                  },
                ]}
              >
                {formatHarga(item.harga)} (estimasi)
              </Text>

              <Text
                style={[
                  styles.info,
                  { color: colors.secondaryText },
                ]}
              >
                ⭐ {item.rating}
              </Text>

              <Text
                style={[
                  styles.info,
                  { color: colors.secondaryText },
                ]}
              >
                {item.sisaKamar} kamar tersedia
              </Text>

              <Text
                style={[
                  styles.facilityTitle,
                  { color: colors.text },
                ]}
              >
                Fasilitas:
              </Text>

              <View style={styles.facilityContainer}>
                {item.fasilitas.map((fasilitas, index) => (
                  <View
                    key={index}
                    style={[
                      styles.facilityItem,
                      {
                        backgroundColor: isDark
                          ? "#374151"
                          : "#E5E7EB",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.facilityText,
                        { color: colors.text },
                      ]}
                    >
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
                    name={
                      sudahDisimpan
                        ? "bookmark"
                        : "bookmark-outline"
                    }
                    size={28}
                    color={
                      sudahDisimpan
                        ? colors.primary
                        : colors.bookmark
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
