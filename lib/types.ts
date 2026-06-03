export type ActivityType = "feeding" | "diaper" | "sleep" | "pumping";

export type Baby = {
  id: string;
  name: string;
  birthDate: string;
  gender?: "male" | "female" | "other";
};

export type FeedingMeta = {
  feedType: "breastfeeding" | "bottle";
  side?: "left" | "right" | "both";
  duration?: number;
  volume?: number;
  milkType?: "breast_milk" | "formula";
};

export type DiaperMeta = {
  diaperType: "pee" | "poop" | "both";
  colorNote?: string;
  textureNote?: string;
};

export type SleepMeta = {
  startTime: string;
  endTime?: string;
  duration?: number;
};

export type PumpingMeta = {
  leftMl: number;
  rightMl: number;
  totalMl: number;
  painNote?: string;
  engorgedNote?: string;
};

export type ActivityMetadata =
  | FeedingMeta
  | DiaperMeta
  | SleepMeta
  | PumpingMeta;

export type Activity = {
  id: string;
  babyId: string;
  type: ActivityType;
  timestamp: string;
  metadata: ActivityMetadata;
};

export type ActivityDraft =
  | { type: "feeding"; metadata: FeedingMeta }
  | { type: "diaper"; metadata: DiaperMeta }
  | { type: "sleep"; metadata: SleepMeta }
  | { type: "pumping"; metadata: PumpingMeta };
