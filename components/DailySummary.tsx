import { Baby, Droplets, Milk, Moon, Waves } from "lucide-react";
import type {
  Activity,
  DiaperMeta,
  FeedingMeta,
  PumpingMeta,
  SleepMeta,
} from "@/lib/types";
import { formatDuration, isTodayActivity } from "@/lib/utils";

type DailySummaryProps = {
  activities: Activity[];
};

export function DailySummary({ activities }: DailySummaryProps) {
  const today = activities.filter(isTodayActivity);
  const feeding = today.filter((activity) => activity.type === "feeding").length;
  const pumped = today
    .filter((activity) => activity.type === "pumping")
    .reduce((total, activity) => total + ((activity.metadata as PumpingMeta).totalMl || 0), 0);
  const sleep = today
    .filter((activity) => activity.type === "sleep")
    .reduce((total, activity) => total + ((activity.metadata as SleepMeta).duration || 0), 0);
  const pee = today.filter((activity) => {
    if (activity.type !== "diaper") return false;
    const diaperType = (activity.metadata as DiaperMeta).diaperType;
    return diaperType === "pee" || diaperType === "both";
  }).length;
  const poop = today.filter((activity) => {
    if (activity.type !== "diaper") return false;
    const diaperType = (activity.metadata as DiaperMeta).diaperType;
    return diaperType === "poop" || diaperType === "both";
  }).length;
  const breastMinutes = today
    .filter((activity) => activity.type === "feeding")
    .reduce((total, activity) => total + ((activity.metadata as FeedingMeta).duration || 0), 0);

  const stats = [
    { label: "Feeding", value: `${feeding}x`, icon: Milk, tone: "text-peach-200" },
    { label: "Sleep", value: formatDuration(sleep), icon: Moon, tone: "text-lilac-200" },
    { label: "Poop", value: `${poop}x`, icon: Baby, tone: "text-amber-200" },
    { label: "Pumped", value: `${pumped}ml`, icon: Waves, tone: "text-mint-200" },
    { label: "Pee", value: `${pee}x`, icon: Droplets, tone: "text-sky-200" },
    { label: "Nursing", value: `${breastMinutes}m`, icon: Milk, tone: "text-rose-200" },
  ];

  return (
    <section className="rounded-[8px] border border-white/10 bg-white/8 p-4 shadow-soft">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-cream-400">
            Today
          </p>
          <h2 className="font-display text-2xl font-semibold text-cream-50">
            Daily summary
          </h2>
        </div>
        <span className="rounded-full bg-peach-300/15 px-3 py-1 text-xs font-bold text-peach-100">
          {today.length} logs
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {stats.map((stat) => (
          <div
            className="flex min-h-[66px] items-center gap-3 rounded-[8px] bg-ink-800/70 px-3"
            key={stat.label}
          >
            <stat.icon className={`h-5 w-5 ${stat.tone}`} />
            <div>
              <p className="text-xs font-semibold text-cream-400">{stat.label}</p>
              <p className="text-lg font-black text-cream-50">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
