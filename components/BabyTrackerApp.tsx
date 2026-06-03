"use client";

import { useMemo, useState } from "react";
import { Settings } from "lucide-react";
import Link from "next/link";
import { AppNav } from "@/components/AppNav";
import { DailySummary } from "@/components/DailySummary";
import { QuickActions } from "@/components/QuickActions";
import { ActivityModal } from "@/components/ActivityModal";
import { Timeline } from "@/components/Timeline";
import { demoBaby, seedActivities } from "@/lib/mock-data";
import { formatBabyAge } from "@/lib/utils";
import type { Activity, ActivityDraft, ActivityType } from "@/lib/types";

export function BabyTrackerApp() {
  const [activities, setActivities] = useState<Activity[]>(seedActivities);
  const [activeAction, setActiveAction] = useState<ActivityType | null>(null);

  const sortedActivities = useMemo(
    () =>
      [...activities].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      ),
    [activities],
  );

  function saveActivity(draft: ActivityDraft) {
    setActivities((current) => [
      {
        id: crypto.randomUUID(),
        babyId: demoBaby.id,
        timestamp:
          draft.type === "sleep" ? draft.metadata.startTime : new Date().toISOString(),
        ...draft,
      },
      ...current,
    ]);
    setActiveAction(null);
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col px-4 pb-28 pt-5">
      <header className="mb-5 flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-peach-200">Baby Activity Tracker</p>
          <h1 className="mt-1 font-display text-4xl font-semibold text-cream-50">
            {demoBaby.name}
          </h1>
          <p className="mt-1 text-sm text-cream-300">
            {formatBabyAge(demoBaby.birthDate)} · Today
          </p>
        </div>
        <Link
          aria-label="Open settings"
          className="grid h-12 w-12 place-items-center rounded-full border border-white/10 bg-white/7 text-cream-100 shadow-soft transition active:scale-95"
          href="/settings"
        >
          <Settings className="h-5 w-5" />
        </Link>
      </header>

      <DailySummary activities={activities} />

      <section className="mt-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-2xl font-semibold text-cream-50">
            Quick log
          </h2>
          <span className="rounded-full bg-mint-400/12 px-3 py-1 text-xs font-bold text-mint-200">
            2 taps
          </span>
        </div>
        <QuickActions onSelect={setActiveAction} />
      </section>

      <section className="mt-6 flex-1">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-2xl font-semibold text-cream-50">
            Recent activity
          </h2>
          <Link className="text-sm font-bold text-peach-200" href="/timeline">
            See all
          </Link>
        </div>
        <Timeline activities={sortedActivities.slice(0, 5)} compact />
      </section>

      <AppNav />
      <ActivityModal
        activityType={activeAction}
        onClose={() => setActiveAction(null)}
        onSave={saveActivity}
      />
    </main>
  );
}
