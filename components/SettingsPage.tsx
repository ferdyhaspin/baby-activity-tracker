"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Baby, Calendar, CheckCircle2, LogOut, Moon, UserRound, XCircle } from "lucide-react";
import {
  signInWithGoogleAction,
  signOutAction,
  upsertBabyAction,
  type SettingsFormState,
} from "@/app/actions";
import { AppNav } from "@/components/AppNav";
import { PageHeader } from "@/components/PageHeader";
import type { AppData } from "@/lib/data";

export function SettingsPage({ data }: { data: AppData }) {
  const initialState: SettingsFormState = { status: "idle", message: "" };
  const [state, formAction] = useFormState(upsertBabyAction, initialState);

  return (
    <main className="mx-auto min-h-screen w-full max-w-[430px] px-4 pb-28 pt-5">
      <PageHeader title="Settings" subtitle="Baby profile" />
      <form
        action={formAction}
        className="space-y-4 rounded-[8px] border border-white/10 bg-white/7 p-4 shadow-soft"
      >
        <input name="babyId" type="hidden" value={data.baby.id} />
        <Field icon={UserRound} label="Baby name" name="name" value={data.baby.name} />
        <Field
          icon={Calendar}
          label="Birth date"
          name="birthDate"
          type="date"
          value={data.baby.birthDate}
        />
        <GenderField value={data.baby.gender ?? ""} />
        <div className="flex min-h-14 items-center justify-between rounded-[8px] bg-ink-800 px-3">
          <div className="flex items-center gap-3">
            <Moon className="h-5 w-5 text-lilac-200" />
            <div>
              <p className="text-sm font-bold text-cream-400">Theme</p>
              <p className="text-base font-black text-cream-50">Warm dark</p>
            </div>
          </div>
          <span className="rounded-full bg-mint-300/15 px-3 py-1 text-xs font-black text-mint-200">
            On
          </span>
        </div>
        {state.status !== "idle" ? (
          <p
            className={`flex items-center gap-2 rounded-[8px] border p-3 text-sm font-semibold ${
              state.status === "success"
                ? "border-mint-300/30 bg-mint-300/10 text-mint-200"
                : "border-peach-300/30 bg-peach-300/10 text-peach-100"
            }`}
          >
            {state.status === "success" ? (
              <CheckCircle2 className="h-4 w-4 shrink-0" />
            ) : (
              <XCircle className="h-4 w-4 shrink-0" />
            )}
            {state.message}
          </p>
        ) : null}
        <SaveButton />
      </form>

      <form
        action={data.isAuthenticated ? signOutAction : signInWithGoogleAction}
        className="mt-4"
      >
        <button
          className="flex min-h-14 w-full items-center justify-center gap-2 rounded-[8px] border border-peach-300/40 bg-peach-300/10 text-base font-black text-peach-100 transition active:scale-[0.98]"
          type="submit"
        >
          <LogOut className="h-5 w-5" />
          {data.isAuthenticated ? "Sign out" : "Sign in with Google"}
        </button>
      </form>

      {!data.isSupabaseConfigured ? (
        <p className="mt-4 rounded-[8px] border border-white/10 bg-white/7 p-3 text-sm font-semibold text-cream-300">
          Demo mode: add Supabase env vars to enable real auth and database writes.
        </p>
      ) : null}
      <AppNav />
    </main>
  );
}

function SaveButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="flex min-h-14 w-full items-center justify-center rounded-[8px] bg-cream-50 text-base font-black text-ink-950 transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
      disabled={pending}
      type="submit"
    >
      {pending ? "Saving..." : "Save profile"}
    </button>
  );
}

function GenderField({ value }: { value: string }) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-2 text-sm font-bold text-cream-300">
        <Baby className="h-4 w-4" />
        Gender
      </span>
      <select
        className="min-h-12 w-full rounded-[8px] border border-white/10 bg-ink-800 px-3 text-base font-semibold text-cream-50 outline-none focus:border-peach-200"
        defaultValue={value}
        name="gender"
      >
        <option value="">Not set</option>
        <option value="female">Female</option>
        <option value="male">Male</option>
        <option value="other">Other</option>
      </select>
    </label>
  );
}

function Field({
  icon: Icon,
  label,
  name,
  type = "text",
  value,
}: {
  icon: typeof UserRound;
  label: string;
  name: string;
  type?: string;
  value: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-2 text-sm font-bold text-cream-300">
        <Icon className="h-4 w-4" />
        {label}
      </span>
      <input
        className="min-h-12 w-full rounded-[8px] border border-white/10 bg-ink-800 px-3 text-base font-semibold text-cream-50 outline-none focus:border-peach-200"
        defaultValue={value}
        name={name}
        type={type}
      />
    </label>
  );
}
