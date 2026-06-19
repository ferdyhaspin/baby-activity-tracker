"use client";

import { useMemo, useState } from "react";
import { createActivityAction } from "@/app/actions";
import { Settings } from "lucide-react";
import Link from "next/link";
import { AppNav } from "@/components/AppNav";
import { DailySummary } from "@/components/DailySummary";
import { QuickActions } from "@/components/QuickActions";
import { ActivityModal } from "@/components/ActivityModal";
import { Timeline } from "@/components/Timeline";
import { formatBabyAge } from "@/lib/utils";
import type { AppData } from "@/lib/data";
import type { Activity, ActivityDraft, ActivityType, SleepMeta } from "@/lib/types";

type BabyTrackerAppProps = {
  initialData: AppData;
};

export function BabyTrackerApp({ initialData }: BabyTrackerAppProps) {
  const [activities, setActivities] = useState<Activity[]>(initialData.activities);
  const [activeAction, setActiveAction] = useState<ActivityType | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const baby = initialData.baby;

  const sortedActivities = useMemo(
    () =>
      [...activities].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      ),
    [activities],
  );
  const activeSleep = sortedActivities.find(isOpenSleep);

  async function saveActivity(draft: ActivityDraft) {
    setIsSaving(true);
    setSaveError(null);
    try {
      const result = await createActivityAction(draft, baby.id);
      if (!result.ok) {
        setSaveError(result.error);
        setActiveAction(null);
        return;
      }

      const savedActivity = result.data;
      setActivities((current) => {
        if (savedActivity.type !== "sleep" || !(savedActivity.metadata as SleepMeta).endTime) {
          return [savedActivity, ...current];
        }

        const savedSleepMeta = savedActivity.metadata as SleepMeta;
        const replaced = current.map((activity) => {
          if (activity.id === savedActivity.id) return savedActivity;
          if (isOpenSleep(activity) && (activity.metadata as SleepMeta).startTime === savedSleepMeta.startTime) {
            return savedActivity;
          }
          return activity;
        });

        return replaced.some((activity) => activity.id === savedActivity.id)
          ? replaced
          : [savedActivity, ...replaced];
      });
      setActiveAction(null);
    } catch (error) {
      setActiveAction(null);
      setSaveError(error instanceof Error ? error.message : "Failed to save activity");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col px-4 pb-28 pt-5">
      <header className="mb-5 flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-peach-200">Baby Activity Tracker</p>
          <h1 className="mt-1 font-display text-4xl font-semibold text-cream-50">
            {baby.name}
          </h1>
          <p className="mt-1 text-sm text-cream-300">
            {formatBabyAge(baby.birthDate)} · Today
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

      {saveError ? (
        <p className="mb-1 mt-3 rounded-[8px] border border-peach-300/30 bg-peach-300/10 p-3 text-sm font-semibold text-peach-100">
          {saveError}
        </p>
      ) : null}

      <section className="mt-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-2xl font-semibold text-cream-50">
            Quick log
          </h2>
          <span className="rounded-full bg-mint-400/12 px-3 py-1 text-xs font-bold text-mint-200">
            2 taps
          </span>
        </div>
        <QuickActions hasActiveSleep={Boolean(activeSleep)} onSelect={setActiveAction} />
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
        activeSleepStart={(activeSleep?.metadata as SleepMeta | undefined)?.startTime ?? null}
        activityType={activeAction}
        isSaving={isSaving}
        onClose={() => setActiveAction(null)}
        onSave={saveActivity}
      />
    </main>
  );
}

function isOpenSleep(activity: Activity) {
  return activity.type === "sleep" && !(activity.metadata as SleepMeta).endTime;
}
