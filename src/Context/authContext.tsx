import type { Session, User } from "@supabase/supabase-js";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { supabase } from "../lib/supabase";
import {
  bersihkanSessionLokal,
  signInEmail,
  signOutSupabase,
  signUpEmail,
} from "../services/authService";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  isLoading: boolean; // true selama pengecekan session awal
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
  ) => Promise<{ perluKonfirmasi: boolean }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let aktif = true;
    let subscription: { unsubscribe: () => void } | null = null;

    const mulai = async () => {
      // 1. Setiap aplikasi baru dibuka (setelah ditutup), session lama
      //    dibuang sehingga pengguna kembali ke halaman login/daftar.
      await bersihkanSessionLokal();
      if (!aktif) return;

      setSession(null);
      setIsLoading(false);

      // 2. Setelah bersih, baru dengarkan perubahan auth (SIGNED_IN,
      //    SIGNED_OUT, TOKEN_REFRESHED, dll.) selama aplikasi berjalan.
      //    Callback sengaja non-async agar tidak deadlock.
      const { data } = supabase.auth.onAuthStateChange((_event, sessionBaru) => {
        setSession(sessionBaru);
      });
      subscription = data.subscription;
    };

    mulai();

    // 3. Cleanup agar tidak terjadi memory leak.
    return () => {
      aktif = false;
      subscription?.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      session,
      user: session?.user ?? null,
      isLoading,
      signIn: async (email, password) => {
        await signInEmail(email, password);
      },
      signUp: signUpEmail,
      signOut: signOutSupabase,
    }),
    [session, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth harus digunakan di dalam AuthProvider");
  }
  return context;
}