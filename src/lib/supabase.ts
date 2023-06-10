import { SupabaseClient, createClient } from "@supabase/supabase-js";
import { Database } from "./database.types";

export type Roast = Database["public"]["Tables"]["roasts"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type MembershipStatus = Database["public"]["Enums"]["membership_status"];
export type Site = { id: number | null; url: string };
export type SessionUser = { id: string; isPremium: boolean } | null;

export interface AugmentedRoast {
  id: number;
  content: string;
  createdAt: string;
  authorId: string;
  authorUsername: string;
  authorTwitter: string;
  authorMembershipStatus: string;
}

export const supabaseClient = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: false,
      detectSessionInUrl: false,
    },
  }
);

export async function isUserPremium(
  supabase: SupabaseClient,
  userId: string
): Promise<boolean> {
  const { data } = await supabase
    .from("profiles")
    .select("id, membership_status")
    .eq("id", userId)
    .maybeSingle();

  const profile = data as Profile;

  return !!profile?.membership_status;
}

// export async function getAugmentedRoasts(
//   supabase: SupabaseClient
// ): Promise<any> {
//   const { data } = await supabase.from("");
// }
