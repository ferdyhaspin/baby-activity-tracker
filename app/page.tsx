import { BabyTrackerApp } from "@/components/BabyTrackerApp";
import { getAppData } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const data = await getAppData();

  return <BabyTrackerApp initialData={data} />;
}
