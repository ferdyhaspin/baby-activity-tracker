"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { ensureBabyId } from "@/lib/babies";
import { hasSupabaseEnv } from "@/lib/env";
import { mapActivity } from "@/lib/mappers";
import { createClient } from "@/lib/supabase/server";
import type { Activity, ActivityDraft, SleepMeta } from "@/lib/types";

export type SettingsFormState = {
  status: "idle" | "success" | "error";
  message: string;
};

export async function createActivityAction(
  draft: ActivityDraft,
  babyId?: string,
): Promise<Activity> {
  const normalizedBabyId = babyId?.trim() || undefined;
  const fallback: Activity = {
    id: crypto.randomUUID(),
    babyId: normalizedBabyId ?? "local-baby",
    type: draft.type,
    timestamp: draft.type === "sleep" ? draft.metadata.startTime : new Date().toISOString(),
    metadata: draft.metadata,
  };

  if (!hasSupabaseEnv()) return fallback;

  const supabase = createClient();
  if (!supabase) return fallback;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Please sign in before saving activities to Supabase");
  }

  const resolvedBabyId = normalizedBabyId ?? (await ensureBabyId(user.id));

  if (draft.type === "sleep" && draft.metadata.endTime) {
    const sleepMeta = draft.metadata as SleepMeta;
    const { data: existingSleep } = await supabase
      .from("activities")
      .select("id")
      .eq("baby_id", resolvedBabyId)
      .eq("user_id", user.id)
      .eq("type", "sleep")
      .eq("metadata->>startTime", sleepMeta.startTime)
      .is("metadata->>endTime", null)
      .order("timestamp", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existingSleep?.id) {
      const { data, error } = await supabase
        .from("activities")
        .update({
          timestamp: sleepMeta.startTime,
          metadata: sleepMeta,
        })
        .eq("id", existingSleep.id)
        .eq("user_id", user.id)
        .select("*")
        .single();

      if (error || !data) {
        throw new Error(error?.message ?? "Failed to end sleep activity");
      }

      revalidatePath("/");
      revalidatePath("/timeline");
      revalidatePath("/analytics");

      return mapActivity(data);
    }
  }

  const { data, error } = await supabase
    .from("activities")
    .insert({
      baby_id: resolvedBabyId,
      user_id: user.id,
      type: draft.type,
      timestamp: fallback.timestamp,
      metadata: draft.metadata,
    })
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Failed to create activity");
  }

  revalidatePath("/");
  revalidatePath("/timeline");
  revalidatePath("/analytics");

  return mapActivity(data);
}

export async function upsertBabyAction(
  _previousState: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const birthDate = String(formData.get("birthDate") ?? "").trim();
  const babyId = String(formData.get("babyId") ?? "").trim();
  const genderValue = String(formData.get("gender") ?? "").trim();
  const gender = ["male", "female", "other"].includes(genderValue)
    ? (genderValue as "male" | "female" | "other")
    : null;

  if (!name || !birthDate) {
    return { status: "error", message: "Baby name and birth date are required." };
  }

  if (!hasSupabaseEnv()) {
    return { status: "error", message: "Supabase env vars are not configured." };
  }

  const supabase = createClient();
  if (!supabase) {
    return { status: "error", message: "Supabase client is not available." };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { status: "error", message: "Please sign in before saving baby profile." };
  }

  const query = babyId
    ? supabase
      .from("babies")
      .update({ name, birth_date: birthDate, gender })
      .eq("id", babyId)
      .eq("user_id", user.id)
      .select("*")
      .single()
    : supabase
      .from("babies")
      .insert({ name, birth_date: birthDate, gender, user_id: user.id })
      .select("*")
      .single();

  const { data, error } = await query;

  if (error || !data) {
    return { status: "error", message: error?.message ?? "Failed to save baby profile." };
  }

  revalidatePath("/");
  revalidatePath("/settings");

  return { status: "success", message: "Baby profile saved." };
}

export async function signInWithGoogleAction() {
  if (!hasSupabaseEnv()) {
    throw new Error("Supabase env vars are not configured");
  }

  const supabase = createClient();
  if (!supabase) {
    throw new Error("Supabase client is not available");
  }

  const origin = process.env.NEXT_PUBLIC_SITE_URL
    ?? headers().get("origin");

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error || !data.url) {
    throw new Error(error?.message ?? "Failed to start Google sign in");
  }

  redirect(data.url);
}

export async function signOutAction() {
  const supabase = createClient();
  if (supabase) {
    await supabase.auth.signOut();
  }

  revalidatePath("/");
  redirect("/");
}
