import { Baby, Droplets, Milk, Moon, Waves } from "lucide-react";
import { format, parseISO } from "date-fns";
import { activityLabel } from "@/lib/utils";
import type { Activity, DiaperMeta } from "@/lib/types";

type TimelineProps = {
  activities: Activity[];
  compact?: boolean;
};

export function Timeline({ activities, compact = false }: TimelineProps) {
  if (!activities.length) {
    return (
      <div className="grid min-h-40 place-items-center rounded-[8px] border border-dashed border-white/15 bg-white/5 text-center text-sm text-cream-300">
        No activity logged for this view.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {activities.map((activity, index) => {
        const Icon = getActivityIcon(activity);

        return (
          <article
            className="animate-fade-in rounded-[8px] border border-white/10 bg-white/7 p-3 shadow-soft"
            key={activity.id}
            style={{ animationDelay: `${index * 45}ms` }}
          >
            <div className="flex gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ink-800 text-peach-200">
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-black text-cream-50">
                    {activityLabel(activity)}
                  </p>
                  <time className="shrink-0 text-xs font-bold text-cream-400">
                    {format(parseISO(activity.timestamp), "HH:mm")}
                  </time>
                </div>
                {!compact ? (
                  <p className="mt-1 text-xs font-semibold capitalize text-cream-400">
                    {activity.type}
                  </p>
                ) : null}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function getActivityIcon(activity: Activity) {
  if (activity.type === "feeding") return Milk;
  if (activity.type === "sleep") return Moon;
  if (activity.type === "pumping") return Waves;
  if ((activity.metadata as DiaperMeta).diaperType === "pee") return Droplets;
  return Baby;
}
