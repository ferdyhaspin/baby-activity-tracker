import type { ActivityMetadata, ActivityType } from "@/lib/types";

export type Database = {
  public: {
    Tables: {
      babies: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          birth_date: string;
          gender: "male" | "female" | "other" | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          birth_date: string;
          gender?: "male" | "female" | "other" | null;
          created_at?: string;
        };
        Update: {
          name?: string;
          birth_date?: string;
          gender?: "male" | "female" | "other" | null;
        };
        Relationships: [];
      };
      activities: {
        Row: {
          id: string;
          baby_id: string;
          user_id: string;
          type: ActivityType;
          timestamp: string;
          metadata: ActivityMetadata;
          created_at: string;
        };
        Insert: {
          id?: string;
          baby_id: string;
          user_id: string;
          type: ActivityType;
          timestamp?: string;
          metadata: ActivityMetadata;
          created_at?: string;
        };
        Update: {
          type?: ActivityType;
          timestamp?: string;
          metadata?: ActivityMetadata;
        };
        Relationships: [
          {
            foreignKeyName: "activities_baby_id_fkey";
            columns: ["baby_id"];
            isOneToOne: false;
            referencedRelation: "babies";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
