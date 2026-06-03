import { SettingsPage } from "@/components/SettingsPage";
import { getAppData } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function Page() {
  const data = await getAppData();

  return <SettingsPage data={data} />;
}
