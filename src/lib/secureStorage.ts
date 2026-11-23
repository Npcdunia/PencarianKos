import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

// SecureStore dibatasi ±2KB per nilai, jadi session dipecah per 1800 karakter.
const CHUNK_SIZE = 1800;

const kunciCount = (key: string) => `${key}.count`;
const kunciChunk = (key: string, i: number) => `${key}.${i}`;

async function hapusSemua(key: string) {
  const count = Number(await SecureStore.getItemAsync(kunciCount(key)));
  for (let i = 0; i < count; i++) {
    await SecureStore.deleteItemAsync(kunciChunk(key, i));
  }
  await SecureStore.deleteItemAsync(kunciCount(key));
}

const nativeStorage = {
  async getItem(key: string): Promise<string | null> {
    const count = Number(await SecureStore.getItemAsync(kunciCount(key)));
    if (!count) return null;

    let hasil = "";
    for (let i = 0; i < count; i++) {
      const potongan = await SecureStore.getItemAsync(kunciChunk(key, i));
      if (potongan === null) return null; // data rusak -> anggap tidak ada
      hasil += potongan;
    }
    return hasil;
  },

  async setItem(key: string, value: string): Promise<void> {
    await hapusSemua(key);

    const jumlah = Math.ceil(value.length / CHUNK_SIZE);
    for (let i = 0; i < jumlah; i++) {
      await SecureStore.setItemAsync(
        kunciChunk(key, i),
        value.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE),
      );
    }
    await SecureStore.setItemAsync(kunciCount(key), String(jumlah));
  },

  async removeItem(key: string): Promise<void> {
    await hapusSemua(key);
  },
};

// SecureStore tidak tersedia di web -> pakai AsyncStorage.
export const secureStorage =
  Platform.OS === "web" ? AsyncStorage : nativeStorage;