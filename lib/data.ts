import { hasSupabaseEnv } from "@/lib/env";
import { mapActivity, mapBaby } from "@/lib/mappers";
import { createClient } from "@/lib/supabase/server";
import type { Activity, Baby } from "@/lib/types";

const defaultBaby: Baby = {
  id: "",
  name: "My Baby",
  birthDate: new Date().toISOString().split("T")[0],
  gender: "other",
};

export type AppData = {
  baby: Baby;
  activities: Activity[];
  isAuthenticated: boolean;
  isSupabaseConfigured: boolean;
};

export async function getAppData(): Promise<AppData> {
  const isSupabaseConfigured = hasSupabaseEnv();
  const supabase = createClient();

  if (!isSupabaseConfigured || !supabase) {
    return {
      baby: defaultBaby,
      activities: [],
      isAuthenticated: false,
      isSupabaseConfigured,
    };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      baby: defaultBaby,
      activities: [],
      isAuthenticated: false,
      isSupabaseConfigured,
    };
  }

  const { data: babyRow } = await supabase
    .from("babies")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (!babyRow) {
    return {
      baby: defaultBaby,
      activities: [],
      isAuthenticated: true,
      isSupabaseConfigured,
    };
  }

  const { data: activityRows } = await supabase
    .from("activities")
    .select("*")
    .eq("baby_id", babyRow.id)
    .order("timestamp", { ascending: false })
    .limit(200);

  return {
    baby: mapBaby(babyRow),
    activities: (activityRows ?? []).map(mapActivity),
    isAuthenticated: true,
    isSupabaseConfigured,
  };
}