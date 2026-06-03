"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { demoBaby } from "@/lib/mock-data";
import { hasSupabaseEnv } from "@/lib/env";
import { mapActivity, mapBaby } from "@/lib/mappers";
import { createClient } from "@/lib/supabase/server";
import type { Activity, ActivityDraft } from "@/lib/types";

export async function createActivityAction(
  draft: ActivityDraft,
  babyId?: string,
): Promise<Activity> {
  const fallback: Activity = {
    id: crypto.randomUUID(),
    babyId: babyId ?? demoBaby.id,
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

  if (!user) return fallback;

  const resolvedBabyId = babyId ?? (await ensureBabyId(user.id));

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

export async function upsertBabyAction(formData: FormData): Promise<void> {
  const name = String(formData.get("name") ?? "").trim();
  const birthDate = String(formData.get("birthDate") ?? "").trim();
  const babyId = String(formData.get("babyId") ?? "").trim();

  if (!name || !birthDate) {
    throw new Error("Baby name and birth date are required");
  }

  if (!hasSupabaseEnv()) return;

  const supabase = createClient();
  if (!supabase) return;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const query = babyId
    ? supabase
        .from("babies")
        .update({ name, birth_date: birthDate })
        .eq("id", babyId)
        .eq("user_id", user.id)
        .select("*")
        .single()
    : supabase
        .from("babies")
        .insert({ name, birth_date: birthDate, user_id: user.id })
        .select("*")
        .single();

  const { data, error } = await query;

  if (error || !data) {
    throw new Error(error?.message ?? "Failed to save baby profile");
  }

  revalidatePath("/");
  revalidatePath("/settings");

  mapBaby(data);
}

export async function signInWithGoogleAction() {
  if (!hasSupabaseEnv()) {
    throw new Error("Supabase env vars are not configured");
  }

  const supabase = createClient();
  if (!supabase) {
    throw new Error("Supabase client is not available");
  }

  const origin = headers().get("origin") ?? "http://localhost:3000";
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

async function ensureBabyId(userId: string) {
  const supabase = createClient();
  if (!supabase) return demoBaby.id;

  const { data: existing } = await supabase
    .from("babies")
    .select("id")
    .eq("user_id", userId)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (existing?.id) return existing.id;

  const { data, error } = await supabase
    .from("babies")
    .insert({
      user_id: userId,
      name: demoBaby.name,
      birth_date: demoBaby.birthDate,
      gender: demoBaby.gender ?? null,
    })
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Failed to create baby profile");
  }

  return data.id;
}
