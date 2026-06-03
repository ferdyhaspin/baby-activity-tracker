import { TimelinePage } from "@/components/TimelinePage";
import { getAppData } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function Page() {
  const data = await getAppData();

  return <TimelinePage activities={data.activities} />;
}
