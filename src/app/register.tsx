import { Link } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import { useAuth } from "../Context/authContext";
import { useTheme } from "../Context/ThemeContext";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterScreen() {
  const { signUp } = useAuth();
  const { colors } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [konfirmasi, setKonfirmasi] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const handleRegister = async () => {
    setInfo(null);

    if (!EMAIL_REGEX.test(email.trim())) {
      setError("Format email tidak valid.");
      return;
    }
    if (password.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }
    if (password !== konfirmasi) {
      setError("Konfirmasi password tidak sama.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const { perluKonfirmasi } = await signUp(email, password);

      if (perluKonfirmasi) {
        setInfo("Pendaftaran berhasil. Cek email Anda untuk konfirmasi, lalu masuk.");
      }
      // Jika konfirmasi email dimatikan, session langsung aktif dan guard memindahkan ke Home.
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal mendaftar.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    backgroundColor: colors.input,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: colors.text,
    marginBottom: 12,
  } as const;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={{ fontSize: 28, fontWeight: "bold", color: colors.text, marginBottom: 24 }}>
          Buat Akun
        </Text>

        <TextInput
          placeholder="Email"
          placeholderTextColor={colors.secondaryText}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          editable={!loading}
          style={inputStyle}
        />
        <TextInput
          placeholder="Password (min. 6 karakter)"
          placeholderTextColor={colors.secondaryText}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          editable={!loading}
          style={inputStyle}
        />
        <TextInput
          placeholder="Ulangi password"
          placeholderTextColor={colors.secondaryText}
          value={konfirmasi}
          onChangeText={setKonfirmasi}
          secureTextEntry
          autoCapitalize="none"
          editable={!loading}
          style={inputStyle}
        />

        {error && <Text style={{ color: "#DC2626", marginBottom: 12 }}>{error}</Text>}
        {info && <Text style={{ color: colors.primary, marginBottom: 12 }}>{info}</Text>}

        <Pressable
          onPress={handleRegister}
          disabled={loading}
          style={{
            backgroundColor: colors.primary,
            opacity: loading ? 0.7 : 1,
            padding: 14,
            borderRadius: 10,
            alignItems: "center",
          }}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={{ color: "#FFFFFF", fontWeight: "bold" }}>Daftar</Text>
          )}
        </Pressable>

        <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 18 }}>
          <Text style={{ color: colors.secondaryText }}>Sudah punya akun? </Text>
          <Link href="/login" style={{ color: colors.primary, fontWeight: "bold" }}>
            Masuk
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}