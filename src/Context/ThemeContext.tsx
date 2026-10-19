import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";

const lightColors = {
  background: "#F5F5F5",
  surface: "#FFFFFF",
  text: "#1F2937",
  secondaryText: "#6B7280",
  border: "#DDDDDD",
  input: "#FFFFFF",
  favoriteBackground: "#DCFCE7",
  favoriteText: "#166534",
  primary: "#16A34A",
  bookmark: "#000000",
};

const darkColors = {
  background: "#111827",
  surface: "#1F2937",
  text: "#F9FAFB",
  secondaryText: "#D1D5DB",
  border: "#374151",
  input: "#273449",
  favoriteBackground: "#173D2B",
  favoriteText: "#86EFAC",
  primary: "#16A34A",
  bookmark: "#F9FAFB",
};

type ThemeColors = typeof lightColors;

type ThemeContextType = {
  isDark: boolean;
  colors: ThemeColors;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function loadTheme() {
      try {
        const savedTheme = await AsyncStorage.getItem("app-theme");
        setIsDark(savedTheme === "dark");
      } catch (error) {
        console.error("Gagal memuat tema:", error);
      } finally {
        setIsLoaded(true);
      }
    }

    loadTheme();
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    AsyncStorage.setItem("app-theme", isDark ? "dark" : "light").catch(
      (error) => {
        console.error("Gagal menyimpan tema:", error);
      },
    );
  }, [isDark, isLoaded]);

  const toggleTheme = () => {
    setIsDark((previous) => !previous);
  };

  const colors: ThemeColors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ isDark, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme harus digunakan di dalam ThemeProvider");
  }

  return context;
}
