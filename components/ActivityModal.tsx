"use client";

import { useMemo, useState } from "react";
import { Baby, Check, Droplets, Minus, Moon, Plus, Waves, X } from "lucide-react";
import type { ActivityDraft, ActivityType } from "@/lib/types";
import { cn } from "@/lib/utils";

type ActivityModalProps = {
  activityType: ActivityType | null;
  isSaving?: boolean;
  onClose: () => void;
  onSave: (draft: ActivityDraft) => void | Promise<void>;
};

export function ActivityModal({
  activityType,
  isSaving = false,
  onClose,
  onSave,
}: ActivityModalProps) {
  const [feedType, setFeedType] = useState<"breastfeeding" | "bottle">("breastfeeding");
  const [side, setSide] = useState<"left" | "right" | "both">("left");
  const [duration, setDuration] = useState(12);
  const [volume, setVolume] = useState(90);
  const [milkType, setMilkType] = useState<"breast_milk" | "formula">("breast_milk");
  const [diaperType, setDiaperType] = useState<"pee" | "poop" | "both">("pee");
  const [colorNote, setColorNote] = useState("");
  const [textureNote, setTextureNote] = useState("");
  const [leftMl, setLeftMl] = useState(70);
  const [rightMl, setRightMl] = useState(70);
  const [painNote, setPainNote] = useState("");
  const [engorgedNote, setEngorgedNote] = useState("");
  const [activeSleepStart, setActiveSleepStart] = useState<string | null>(null);

  const title = useMemo(() => {
    if (activityType === "feeding") return "Log feeding";
    if (activityType === "diaper") return "Log diaper";
    if (activityType === "sleep") return activeSleepStart ? "End sleep" : "Start sleep";
    if (activityType === "pumping") return "Log pumping";
    return "";
  }, [activityType, activeSleepStart]);

  if (!activityType) return null;

  async function save() {
    if (activityType === "feeding") {
      await onSave({
        type: "feeding",
        metadata:
          feedType === "breastfeeding"
            ? { feedType, side, duration }
            : { feedType, volume, milkType },
      });
    }

    if (activityType === "diaper") {
      await onSave({
        type: "diaper",
        metadata: {
          diaperType,
          colorNote: colorNote || undefined,
          textureNote: textureNote || undefined,
        },
      });
    }

    if (activityType === "sleep") {
      const now = new Date();
      if (!activeSleepStart) {
        const startTime = now.toISOString();
        setActiveSleepStart(startTime);
        await onSave({ type: "sleep", metadata: { startTime } });
      } else {
        const durationMinutes = Math.max(
          1,
          Math.round((now.getTime() - new Date(activeSleepStart).getTime()) / 60000),
        );
        await onSave({
          type: "sleep",
          metadata: {
            startTime: activeSleepStart,
            endTime: now.toISOString(),
            duration: durationMinutes,
          },
        });
        setActiveSleepStart(null);
      }
    }

    if (activityType === "pumping") {
      await onSave({
        type: "pumping",
        metadata: {
          leftMl,
          rightMl,
          totalMl: leftMl + rightMl,
          painNote: painNote || undefined,
          engorgedNote: engorgedNote || undefined,
        },
      });
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink-950/70 px-3 pb-3 backdrop-blur-sm">
      <section className="w-full max-w-[430px] animate-sheet-up rounded-t-[8px] border border-white/10 bg-ink-900 p-4 shadow-soft">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-peach-200">
              Quick input
            </p>
            <h2 className="font-display text-2xl font-semibold text-cream-50">{title}</h2>
          </div>
          <button
            aria-label="Close modal"
            className="grid h-12 w-12 place-items-center rounded-full bg-white/8 text-cream-100 transition active:scale-95"
            onClick={onClose}
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {activityType === "feeding" ? (
          <div className="space-y-4">
            <Segmented
              options={[
                ["breastfeeding", "Breastfeeding"],
                ["bottle", "Bottle"],
              ]}
              value={feedType}
              onChange={(value) => setFeedType(value as "breastfeeding" | "bottle")}
            />
            {feedType === "breastfeeding" ? (
              <>
                <Segmented
                  options={[
                    ["left", "Left"],
                    ["right", "Right"],
                    ["both", "Both"],
                  ]}
                  value={side}
                  onChange={(value) => setSide(value as "left" | "right" | "both")}
                />
                <Stepper label="Duration" suffix="min" value={duration} onChange={setDuration} />
              </>
            ) : (
              <>
                <Stepper label="Volume" suffix="ml" step={10} value={volume} onChange={setVolume} />
                <Segmented
                  options={[
                    ["breast_milk", "Breast milk"],
                    ["formula", "Formula"],
                  ]}
                  value={milkType}
                  onChange={(value) => setMilkType(value as "breast_milk" | "formula")}
                />
              </>
            )}
          </div>
        ) : null}

        {activityType === "diaper" ? (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "pee", label: "Pee", icon: Droplets },
                { value: "poop", label: "Poop", icon: Baby },
                { value: "both", label: "Both", icon: Check },
              ].map((item) => (
                <button
                  className={cn(
                    "flex min-h-16 flex-col items-center justify-center gap-1 rounded-[8px] border text-sm font-black transition active:scale-95",
                    diaperType === item.value
                      ? "border-peach-200 bg-peach-300 text-ink-950"
                      : "border-white/10 bg-white/7 text-cream-100",
                  )}
                  key={item.value}
                  onClick={() => setDiaperType(item.value as "pee" | "poop" | "both")}
                  type="button"
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </button>
              ))}
            </div>
            <Input label="Color note" placeholder="Optional color note" value={colorNote} onChange={setColorNote} />
            <Input label="Texture note" placeholder="Optional texture note" value={textureNote} onChange={setTextureNote} />
          </div>
        ) : null}

        {activityType === "sleep" ? (
          <div className="rounded-[8px] bg-white/7 p-4 text-center">
            <Moon className="mx-auto h-9 w-9 text-lilac-200" />
            <p className="mt-3 text-lg font-black text-cream-50">
              {activeSleepStart ? "Sleep timer is running" : "Ready to start sleep"}
            </p>
            <p className="mt-1 text-sm text-cream-300">
              {activeSleepStart
                ? "Tap the button below when baby wakes up."
                : "Timestamp is saved automatically."}
            </p>
          </div>
        ) : null}

        {activityType === "pumping" ? (
          <div className="space-y-4">
            <div className="rounded-[8px] bg-mint-300/12 p-4 text-center">
              <Waves className="mx-auto h-8 w-8 text-mint-200" />
              <p className="mt-2 text-3xl font-black text-cream-50">{leftMl + rightMl} ml</p>
              <p className="text-sm font-semibold text-cream-300">Total pumped</p>
            </div>
            <Stepper label="Left breast" suffix="ml" step={10} value={leftMl} onChange={setLeftMl} />
            <Stepper label="Right breast" suffix="ml" step={10} value={rightMl} onChange={setRightMl} />
            <Input label="Pain note" placeholder="Optional pain note" value={painNote} onChange={setPainNote} />
            <Input
              label="Engorgement note"
              placeholder="Optional engorgement note"
              value={engorgedNote}
              onChange={setEngorgedNote}
            />
          </div>
        ) : null}

        <button
          className="mt-5 flex min-h-14 w-full items-center justify-center gap-2 rounded-[8px] bg-cream-50 text-lg font-black text-ink-950 shadow-soft transition hover:bg-peach-100 active:scale-[0.98]"
          disabled={isSaving}
          onClick={save}
          type="button"
        >
          <Check className="h-5 w-5" />
          {isSaving
            ? "Saving..."
            : activityType === "sleep" && !activeSleepStart
              ? "Start Sleep"
              : "Save"}
        </button>
      </section>
    </div>
  );
}

function Segmented({
  options,
  value,
  onChange,
}: {
  options: Array<[string, string]>;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(0,1fr))] gap-2 rounded-[8px] bg-ink-950 p-1">
      {options.map(([optionValue, label]) => (
        <button
          className={cn(
            "min-h-12 rounded-[8px] px-3 text-sm font-black transition active:scale-95",
            value === optionValue ? "bg-cream-50 text-ink-950" : "text-cream-300",
          )}
          key={optionValue}
          onClick={() => onChange(optionValue)}
          type="button"
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function Stepper({
  label,
  value,
  suffix,
  step = 1,
  onChange,
}: {
  label: string;
  value: number;
  suffix: string;
  step?: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex min-h-16 items-center justify-between rounded-[8px] bg-white/7 px-3">
      <div>
        <p className="text-sm font-bold text-cream-300">{label}</p>
        <p className="text-2xl font-black text-cream-50">
          {value} {suffix}
        </p>
      </div>
      <div className="flex gap-2">
        <button
          aria-label={`Decrease ${label}`}
          className="grid h-12 w-12 place-items-center rounded-full bg-ink-950 text-cream-50 transition active:scale-95"
          onClick={() => onChange(Math.max(0, value - step))}
          type="button"
        >
          <Minus className="h-5 w-5" />
        </button>
        <button
          aria-label={`Increase ${label}`}
          className="grid h-12 w-12 place-items-center rounded-full bg-peach-300 text-ink-950 transition active:scale-95"
          onClick={() => onChange(value + step)}
          type="button"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

function Input({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-cream-300">{label}</span>
      <input
        className="min-h-12 w-full rounded-[8px] border border-white/10 bg-white/7 px-3 text-base font-semibold text-cream-50 outline-none transition placeholder:text-cream-500 focus:border-peach-200"
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        value={value}
      />
    </label>
  );
}
