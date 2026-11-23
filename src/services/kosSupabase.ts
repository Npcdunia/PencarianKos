
import { supabase } from "../lib/supabase";
import type { KosDatabase } from "../types/kosDatabase";

export async function ambilKosSupabase(): Promise<KosDatabase[]> {
  const { data, error } = await supabase
    .from("kos")
    .select("*")
    .order("id", { ascending: true })
    .range(0, 19);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as KosDatabase[];
}
