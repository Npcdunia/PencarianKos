
import { Stack } from "expo-router";
import { FavoritProvider } from "../Context/FavoritContext";

export default function RootLayout() {
  return (
    <FavoritProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </FavoritProvider>
  );
}
