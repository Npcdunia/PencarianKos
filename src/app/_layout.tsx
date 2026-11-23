import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Pressable, Text } from "react-native";

import { AuthProvider, useAuth } from "../Context/authContext";
import { FavoritProvider } from "../Context/FavoritContext";
import { ThemeProvider, useTheme } from "../Context/ThemeContext";

// Tahan splash screen sampai status login selesai dicek.
SplashScreen.preventAutoHideAsync();

function AppNavigator() {
  const { isDark, colors, toggleTheme } = useTheme();
  const { session, isLoading } = useAuth();

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

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerTitleStyle: { color: colors.text },
        contentStyle: { backgroundColor: colors.background },
        headerRight: () => (
          <Pressable
            onPress={toggleTheme}
            style={{
              marginRight: 12,
              paddingVertical: 8,
              paddingHorizontal: 10,
              borderRadius: 8,
              backgroundColor: isDark ? "#374151" : "#E5E7EB",
            }}
            accessibilityRole="button"
            accessibilityLabel="Ganti tema aplikasi"
          >
            <Text style={{ color: colors.text, fontWeight: "600", fontSize: 13 }}>
              {isDark ? "☀️ Terang" : "🌙 Gelap"}
            </Text>
          </Pressable>
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