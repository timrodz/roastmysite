import { SupabaseClient, User, createClient } from "@supabase/supabase-js";
import { Database } from "./database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
export const supabaseClient = createClient<Database>(supabaseUrl, supabaseKey);

// export async function getProfile(
//   supabase: SupabaseClient,
//   user: User
// ): Promise<{ user: User,  } | undefined> {
//   if (!user) {
//     return undefined;
//     throw new Error("No user");
//   }

//   let { data, error, status } = await supabase
//     .from("profiles")
//     .select(`username, twitter_profile, avatar_url`)
//     .eq("id", user.id)
//     .single();

//   if (error) {
//     return
//   }
// }
