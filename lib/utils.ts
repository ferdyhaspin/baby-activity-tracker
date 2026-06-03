import { clsx, type ClassValue } from "clsx";
import { differenceInDays, differenceInMonths, format, parseISO } from "date-fns";
import { twMerge } from "tailwind-merge";
import type {
  Activity,
  DiaperMeta,
  FeedingMeta,
  PumpingMeta,
  SleepMeta,
} from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBabyAge(birthDate: string) {
  const born = parseISO(birthDate);
  const today = new Date();
  const days = Math.max(0, differenceInDays(today, born));

  if (days < 56) {
    return `${Math.max(1, Math.floor(days / 7))} weeks old`;
  }

  return `${Math.max(1, differenceInMonths(today, born))} months old`;
}

export function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (!hours) return `${mins}m`;
  if (!mins) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

export function activityLabel(activity: Activity) {
  if (activity.type === "feeding") {
    const meta = activity.metadata as FeedingMeta;
    if (meta.feedType === "bottle") {
      const milk = meta.milkType === "formula" ? "Formula" : "Breast milk";
      return `${milk} bottle · ${meta.volume ?? 0} ml`;
    }

    const side = meta.side ? meta.side[0].toUpperCase() + meta.side.slice(1) : "Both";
    return `Breastfeeding ${side} · ${meta.duration ?? 0} min`;
  }

  if (activity.type === "diaper") {
    const meta = activity.metadata as DiaperMeta;
    if (meta.diaperType === "both") return "Pee and poop";
    return meta.diaperType === "pee" ? "Pee" : "Poop";
  }

  if (activity.type === "sleep") {
    const meta = activity.metadata as SleepMeta;
    const duration = meta.duration ? ` · ${formatDuration(meta.duration)}` : " · in progress";
    const start = format(parseISO(meta.startTime), "HH:mm");
    const end = meta.endTime ? format(parseISO(meta.endTime), "HH:mm") : "now";
    return `${start}-${end}${duration}`;
  }

  const meta = activity.metadata as PumpingMeta;
  return `Pumped ${meta.totalMl} ml · L ${meta.leftMl} / R ${meta.rightMl}`;
}

export function isTodayActivity(activity: Activity) {
  return format(parseISO(activity.timestamp), "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
}
