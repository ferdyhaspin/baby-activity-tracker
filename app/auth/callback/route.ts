import { NextResponse } from "next/server";
import { ensureBabyId } from "@/lib/babies";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/";

  if (code) {
    const supabase = createClient();
    const { error } = (await supabase?.auth.exchangeCodeForSession(code)) ?? {};

    if (!error) {
      const {
        data: { user },
      } = (await supabase?.auth.getUser()) ?? { data: { user: null } };

      if (user) {
        await ensureBabyId(user.id);
      }
    }
  }

  return NextResponse.redirect(new URL(next, request.url));
}
