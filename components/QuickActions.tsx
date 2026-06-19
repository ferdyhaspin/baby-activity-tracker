import { Baby, Droplets, Milk, Moon, Waves } from "lucide-react";
import type { ActivityType } from "@/lib/types";

type QuickActionsProps = {
  hasActiveSleep?: boolean;
  onSelect: (type: ActivityType) => void;
};

const actions: Array<{
  type: ActivityType;
  label: string;
  icon: typeof Milk;
  className: string;
}> = [
  { type: "feeding", label: "Feed", icon: Milk, className: "bg-peach-300 text-ink-950" },
  { type: "pumping", label: "Pump", icon: Waves, className: "bg-mint-300 text-ink-950" },
  { type: "sleep", label: "Sleep", icon: Moon, className: "bg-lilac-300 text-ink-950" },
  { type: "diaper", label: "Pee", icon: Droplets, className: "bg-sky-300 text-ink-950" },
  { type: "diaper", label: "Poop", icon: Baby, className: "bg-amber-300 text-ink-950" },
];

export function QuickActions({ hasActiveSleep = false, onSelect }: QuickActionsProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {actions.map((action, index) => (
        <button
          className={`flex min-h-[72px] items-center justify-center gap-3 rounded-[8px] px-4 text-lg font-black shadow-soft transition hover:brightness-105 active:scale-[0.98] ${action.className} ${
            index === 0 ? "col-span-2" : ""
          }`}
          key={`${action.label}-${index}`}
          onClick={() => onSelect(action.type)}
          type="button"
        >
          <action.icon className="h-6 w-6" />
          {action.type === "sleep" && hasActiveSleep ? "End Sleep" : action.label}
        </button>
      ))}
    </div>
  );
}
