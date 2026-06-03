"use client";

import { useMemo, useState } from "react";
import { AppNav } from "@/components/AppNav";
import { PageHeader } from "@/components/PageHeader";
import { Timeline } from "@/components/Timeline";
import { seedActivities } from "@/lib/mock-data";
import type { ActivityType } from "@/lib/types";
import { cn } from "@/lib/utils";

const filters: Array<"all" | ActivityType> = ["all", "feeding", "sleep", "diaper", "pumping"];

export function TimelinePage() {
  const [filter, setFilter] = useState<"all" | ActivityType>("all");
  const activities = useMemo(
    () =>
      seedActivities
        .filter((activity) => filter === "all" || activity.type === filter)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
    [filter],
  );

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
      <Timeline activities={activities} />
      <AppNav />
    </main>
  );
}
