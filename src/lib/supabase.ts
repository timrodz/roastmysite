import { SupabaseClient, createClient } from "@supabase/supabase-js";
import { Database } from "./database.types";

export const supabaseClient = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function isUserPremiumSSR(
  supabase: SupabaseClient,
  userId: string
): Promise<{ id: string } | null> {
  const { data: userPremium } = await supabase
    .from("profiles")
    .select("id")
    .match({ id: userId, lifetime_deal: true })
    .maybeSingle();

  return userPremium;
}
