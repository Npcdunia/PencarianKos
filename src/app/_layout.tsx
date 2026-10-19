import { Stack } from "expo-router";
import { Pressable, Text } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";

import { FavoritProvider } from "../Context/FavoritContext";
import { ThemeProvider, useTheme } from "../Context/ThemeContext";

function AppNavigator() {
  const { isDark, colors, toggleTheme } = useTheme();

  useEffect(() => {
    AsyncStorage.setItem("app-theme", isDark ? "dark" : "light").catch(
      (error) => {
        console.error("Gagal menyimpan tema:", error);
      },
    );
  }, [isDark]);

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          color: colors.text,
        },
        contentStyle: {
          backgroundColor: colors.background,
        },
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
            <Text
              style={{
                color: colors.text,
                fontWeight: "600",
                fontSize: 13,
              }}
            >
              {isDark ? "☀️ Terang" : "🌙 Gelap"}
            </Text>
          </Pressable>
        ),
      }}
    >
      <Stack.Screen name="index" options={{ title: "Pencarian Kos" }} />
      <Stack.Screen name="explore" options={{ title: "Jelajahi Kos" }} />
      <Stack.Screen name="favorit" options={{ title: "Kos Favorit" }} />
      <Stack.Screen name="detail" options={{ title: "Detail Kos" }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <FavoritProvider>
        <AppNavigator />
      </FavoritProvider>
    </ThemeProvider>
  );
}
