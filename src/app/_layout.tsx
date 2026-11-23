import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Alert, Platform, Pressable, Text, View } from "react-native";

import { AuthProvider, useAuth } from "../Context/authContext";
import { FavoritProvider } from "../Context/FavoritContext";
import { ThemeProvider, useTheme } from "../Context/ThemeContext";

// Tahan splash screen sampai status login selesai dicek.
SplashScreen.preventAutoHideAsync();

function AppNavigator() {
  const { isDark, colors, toggleTheme } = useTheme();
  const { session, isLoading, signOut } = useAuth();

  useEffect(() => {
    AsyncStorage.setItem("app-theme", isDark ? "dark" : "light").catch(
      (error) => {
        console.error("Gagal menyimpan tema:", error);
      },
    );
  }, [isDark]);

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  // Selama session dicek, jangan render navigator.
  if (isLoading) return null;

  const isLoggedIn = !!session;

  const prosesLogout = async () => {
    try {
      await signOut();
      // Tidak perlu router.replace: guard di bawah otomatis ke halaman login.
    } catch (e) {
      const pesan = e instanceof Error ? e.message : "Gagal keluar.";
      if (Platform.OS === "web") window.alert(pesan);
      else Alert.alert("Gagal keluar", pesan);
    }
  };

  const konfirmasiLogout = () => {
    if (Platform.OS === "web") {
      // Alert.alert tidak berfungsi di web, pakai confirm bawaan browser.
      if (window.confirm("Yakin ingin keluar dari akun?")) prosesLogout();
      return;
    }
    Alert.alert("Keluar", "Yakin ingin keluar dari akun?", [
      { text: "Batal", style: "cancel" },
      { text: "Keluar", style: "destructive", onPress: prosesLogout },
    ]);
  };

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerTitleStyle: { color: colors.text },
        contentStyle: { backgroundColor: colors.background },
        headerRight: () => (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Pressable
              onPress={toggleTheme}
              style={{
                marginRight: isLoggedIn ? 8 : 12,
                paddingVertical: 8,
                paddingHorizontal: 10,
                borderRadius: 8,
                backgroundColor: isDark ? "#374151" : "#E5E7EB",
              }}
              accessibilityRole="button"
              accessibilityLabel="Ganti tema aplikasi"
            >
              <Text
                style={{ color: colors.text, fontWeight: "600", fontSize: 13 }}
              >
                {isDark ? "☀️ Terang" : "🌙 Gelap"}
              </Text>
            </Pressable>

            {isLoggedIn && (
              <Pressable
                onPress={konfirmasiLogout}
                style={{
                  marginRight: 12,
                  paddingVertical: 8,
                  paddingHorizontal: 10,
                  borderRadius: 8,
                  backgroundColor: "#DC2626",
                }}
                accessibilityRole="button"
                accessibilityLabel="Keluar dari akun"
              >
                <Text
                  style={{ color: "#FFFFFF", fontWeight: "600", fontSize: 13 }}
                >
                  Keluar
                </Text>
              </Pressable>
            )}
          </View>
        ),
      }}
    >
      {/* Hanya bisa diakses jika SUDAH login */}
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name="index" options={{ title: "Pencarian Kos" }} />
        <Stack.Screen name="explore" options={{ title: "Jelajahi Kos" }} />
        <Stack.Screen name="favorit" options={{ title: "Kos Favorit" }} />
        <Stack.Screen name="detail" options={{ title: "Detail Kos" }} />
      </Stack.Protected>

      {/* Hanya bisa diakses jika BELUM login */}
      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name="login" options={{ title: "Masuk" }} />
        <Stack.Screen name="register" options={{ title: "Daftar" }} />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <FavoritProvider>
          <AppNavigator />
        </FavoritProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}