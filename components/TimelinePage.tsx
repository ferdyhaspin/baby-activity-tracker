"use client";

import { useMemo, useState } from "react";
import { deleteActivityAction } from "@/app/actions";
import { AppNav } from "@/components/AppNav";
import { PageHeader } from "@/components/PageHeader";
import { Timeline } from "@/components/Timeline";
import type { Activity, ActivityType } from "@/lib/types";
import { cn } from "@/lib/utils";

const filters: Array<"all" | ActivityType> = ["all", "feeding", "sleep", "diaper", "pumping"];

export function TimelinePage({ activities: initialActivities }: { activities: Activity[] }) {
  const [allActivities, setAllActivities] = useState<Activity[]>(initialActivities);
  const [filter, setFilter] = useState<"all" | ActivityType>("all");
  const [deletingActivityId, setDeletingActivityId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const activities = useMemo(
    () =>
      allActivities
        .filter((activity) => filter === "all" || activity.type === filter)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
    [allActivities, filter],
  );

  async function deleteActivity(activity: Activity) {
    const confirmed = window.confirm("Delete this activity?");
    if (!confirmed) return;

    setDeletingActivityId(activity.id);
    setDeleteError(null);
    try {
      const result = await deleteActivityAction(activity.id);
      if (!result.ok) {
        setDeleteError(result.error);
        return;
      }

      setAllActivities((current) => current.filter((item) => item.id !== activity.id));
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : "Failed to delete activity");
    } finally {
      setDeletingActivityId(null);
    }
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-[430px] px-4 pb-28 pt-5">
      <PageHeader title="Timeline" subtitle="Newest first" />
      <div className="mb-4 overflow-x-auto">
        <div className="flex min-w-max gap-2">
          {filters.map((item) => (
            <button
              className={cn(
                "min-h-12 rounded-[8px] px-4 text-sm font-black capitalize transition active:scale-95",
                filter === item
                  ? "bg-cream-50 text-ink-950"
                  : "border border-white/10 bg-white/7 text-cream-300",
              )}
              key={item}
              onClick={() => setFilter(item)}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      {deleteError ? (
        <p className="mb-3 rounded-[8px] border border-peach-300/30 bg-peach-300/10 p-3 text-sm font-semibold text-peach-100">
          {deleteError}
        </p>
      ) : null}
      <Timeline
        activities={activities}
        deletingActivityId={deletingActivityId}
        onDelete={deleteActivity}
      />
      <AppNav />
    </main>
  );
}
