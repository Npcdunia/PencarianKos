
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  View,
  Text,
  Pressable,
  ScrollView,
} from "react-native";

import { supabase } from "../lib/supabase";
import type { KosDatabase } from "../types/kosDatabase";

export default function DetailKos() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [kos, setKos] = useState<KosDatabase | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function ambilDetailKos() {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from("kos")
          .select("*")
          .eq("id", Number(id))
          .single();

        if (error) {
          throw error;
        }

        setKos(data as KosDatabase);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Gagal mengambil detail kos"
        );
      } finally {
        setLoading(false);
      }
    }

    if (id && !isNaN(Number(id))) {
      ambilDetailKos();
    } else {
      setError("ID kos tidak valid");
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#16A34A" />
        <Text>Memuat detail kos...</Text>
      </View>
    );
  }

  if (error || !kos) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Kos tidak ditemukan</Text>
        <Text style={styles.info}>
          {error ?? "Data kos tidak tersedia."}
        </Text>

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
        {kos.tipe ?? "Kos"}
      </Text>

      <Text style={styles.price}>
        Rp{(kos.harga ?? 0).toLocaleString("id-ID")} / bulan
      </Text>

      <Text style={styles.info}>
        ⭐ Rating: {kos.rating ?? "-"}
      </Text>

      <Text style={styles.info}>
        Kamar tersedia: {kos.sisa_kamar ?? "-"}
      </Text>

      <Text style={styles.heading}>Informasi Lokasi</Text>

      <Text style={styles.info}>
        Alamat: {kos.alamat || "-"}
      </Text>

      <Text style={styles.info}>
        Kecamatan: {kos.kecamatan || "-"}
      </Text>

      <Text style={styles.info}>
        Kota: {kos.kota || "-"}
      </Text>

      <Text style={styles.info}>
        Telepon: {kos.telepon || "-"}
      </Text>

      <Text style={styles.heading}>Fasilitas</Text>

      {kos.fasilitas && kos.fasilitas.length > 0 ? (
        kos.fasilitas.map((fasilitas, index) => (
          <Text key={`${fasilitas}-${index}`} style={styles.info}>
            • {fasilitas}
          </Text>
        ))
      ) : (
        <Text style={styles.info}>
          Belum ada informasi fasilitas.
        </Text>
      )}

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
