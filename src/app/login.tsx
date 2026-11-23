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

export default function LoginScreen() {
  const { signIn } = useAuth();
  const { colors } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setError("Email dan password wajib diisi.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await signIn(email, password);
      // Tidak perlu router.replace: guard di _layout otomatis memindahkan ke Home.
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal masuk.");
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
        <Text style={{ fontSize: 30, fontWeight: "bold", color: colors.text, marginBottom: 6 }}>
          KosFinder
        </Text>
        <Text style={{ color: colors.secondaryText, marginBottom: 24 }}>
          Masuk untuk mencari kos favoritmu.
        </Text>

        <TextInput
          placeholder="Email"
          placeholderTextColor={colors.secondaryText}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
          editable={!loading}
          style={inputStyle}
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor={colors.secondaryText}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          editable={!loading}
          style={inputStyle}
        />

        {error && <Text style={{ color: "#DC2626", marginBottom: 12 }}>{error}</Text>}

        <Pressable
          onPress={handleLogin}
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
            <Text style={{ color: "#FFFFFF", fontWeight: "bold" }}>Masuk</Text>
          )}
        </Pressable>

        <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 18 }}>
          <Text style={{ color: colors.secondaryText }}>Belum punya akun? </Text>
          <Link href="/register" style={{ color: colors.primary, fontWeight: "bold" }}>
            Daftar
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}