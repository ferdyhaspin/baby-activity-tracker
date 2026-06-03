import { subDays, format, startOfDay, endOfDay } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import { AnalyticsPage } from "@/components/AnalyticsPage";

export default async function Page() {
  const supabase = createClient();

  if (!supabase) return <AnalyticsPage chartData={[]} />;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return <AnalyticsPage chartData={[]} />;

  // Fetch last 7 days activities
  const sevenDaysAgo = subDays(new Date(), 6);
  const { data: activities } = await supabase
    .from("activities")
    .select("*")
    .eq("user_id", user.id)
    .gte("timestamp", startOfDay(sevenDaysAgo).toISOString())
    .order("timestamp", { ascending: true });

  // Build chart data per day
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    const dayLabel = format(date, "EEE");
    const dayStart = startOfDay(date).toISOString();
    const dayEnd = endOfDay(date).toISOString();

    const dayActivities = (activities ?? []).filter(
      (a) => a.timestamp >= dayStart && a.timestamp <= dayEnd
    );

    const sleepMinutes = dayActivities
      .filter((a) => a.type === "sleep")
      .reduce((sum: number, a) => {
        const meta = a.metadata as { duration?: number };
        return sum + (meta.duration ?? 0);
      }, 0);

    const feedingCount = dayActivities.filter((a) => a.type === "feeding").length;
    const diaperCount = dayActivities.filter((a) => a.type === "diaper").length;

    return {
      day: dayLabel,
      sleep: sleepMinutes,
      feeding: feedingCount,
      diaper: diaperCount,
    };
  });

  return <AnalyticsPage chartData={days} />;
}