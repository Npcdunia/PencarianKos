
import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

interface FavoritContextType {
  kosTersimpan: number[];
  toggleMarkah: (id: number) => void;
}

const FavoritContext = createContext<
  FavoritContextType | undefined
>(undefined);

export function FavoritProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [kosTersimpan, setKosTersimpan] =
    useState<number[]>([]);

  const toggleMarkah = (id: number) => {
    setKosTersimpan((sebelumnya) =>
      sebelumnya.includes(id)
        ? sebelumnya.filter((kosId) => kosId !== id)
        : [...sebelumnya, id]
    );
  };

  return (
    <FavoritContext.Provider
      value={{ kosTersimpan, toggleMarkah }}
    >
      {children}
    </FavoritContext.Provider>
  );
}

export function useFavorit() {
  const context = useContext(FavoritContext);

  if (!context) {
    throw new Error(
      "useFavorit harus digunakan di dalam FavoritProvider"
    );
  }

  return context;
}
