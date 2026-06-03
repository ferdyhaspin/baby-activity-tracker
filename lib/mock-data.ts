import { subHours, subMinutes } from "date-fns";
import type { Activity, Baby } from "@/lib/types";

export const demoBaby: Baby = {
  id: "baby-demo",
  name: "Arunika H Y",
  birthDate: "2026-05-09",
  gender: "female",
};

export const seedActivities: Activity[] = [
  {
    id: "sleep-1",
    babyId: demoBaby.id,
    type: "sleep",
    timestamp: subHours(new Date(), 4).toISOString(),
    metadata: {
      startTime: subHours(new Date(), 4).toISOString(),
      endTime: subHours(new Date(), 2).toISOString(),
      duration: 120,
    },
  },
  {
    id: "feed-1",
    babyId: demoBaby.id,
    type: "feeding",
    timestamp: subMinutes(new Date(), 95).toISOString(),
    metadata: {
      feedType: "breastfeeding",
      side: "left",
      duration: 14,
    },
  },
  {
    id: "diaper-1",
    babyId: demoBaby.id,
    type: "diaper",
    timestamp: subMinutes(new Date(), 72).toISOString(),
    metadata: {
      diaperType: "poop",
      colorNote: "Mustard",
    },
  },
  {
    id: "pump-1",
    babyId: demoBaby.id,
    type: "pumping",
    timestamp: subMinutes(new Date(), 45).toISOString(),
    metadata: {
      leftMl: 80,
      rightMl: 70,
      totalMl: 150,
    },
  },
  {
    id: "feed-2",
    babyId: demoBaby.id,
    type: "feeding",
    timestamp: subMinutes(new Date(), 18).toISOString(),
    metadata: {
      feedType: "bottle",
      volume: 90,
      milkType: "breast_milk",
    },
  },
];
