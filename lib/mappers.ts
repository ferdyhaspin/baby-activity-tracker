import type { Database } from "@/lib/database.types";
import type { Activity, Baby } from "@/lib/types";

type BabyRow = Database["public"]["Tables"]["babies"]["Row"];
type ActivityRow = Database["public"]["Tables"]["activities"]["Row"];

export function mapBaby(row: BabyRow): Baby {
  return {
    id: row.id,
    name: row.name,
    birthDate: row.birth_date,
    gender: row.gender ?? undefined,
  };
}

export function mapActivity(row: ActivityRow): Activity {
  return {
    id: row.id,
    babyId: row.baby_id,
    type: row.type,
    timestamp: row.timestamp,
    metadata: row.metadata,
  };
}
