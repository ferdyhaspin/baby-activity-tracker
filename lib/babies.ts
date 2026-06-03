import { createClient } from "@/lib/supabase/server";

export async function ensureBabyId(userId: string) {
  const supabase = createClient();
  if (!supabase) throw new Error("Supabase client not available");

  const { data: existing, error: existingError } = await supabase
    .from("babies")
    .select("id")
    .eq("user_id", userId)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (existingError) {
    throw new Error(existingError.message);
  }

  if (existing?.id) return existing.id;

  const { data, error } = await supabase
    .from("babies")
    .insert({
      user_id: userId,
      name: "My Baby",
      birth_date: new Date().toISOString().split("T")[0],
      gender: null,
    })
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Failed to create baby profile");
  }

  return data.id;
}
