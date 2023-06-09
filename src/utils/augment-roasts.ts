import { Profile, Roast } from "@/lib/supabase";
import { SupabaseClient } from "@supabase/supabase-js";

interface AugmentedRoast extends Roast {
  profile?: Profile;
}

export async function augmentRoasts(
  supabase: SupabaseClient,
  baseRoasts: Roast[]
): Promise<AugmentedRoast[]> {
  const typedRoasts = baseRoasts.filter(Boolean) as Roast[];
  const roastUserIds = typedRoasts.map((r) => r.user_id || "");

  // Basic roasts with no user Ids... would only happen if the user deleted the account
  if (!roastUserIds) {
    return baseRoasts;
  }

  // Get user profiles
  const { data: profiles } = await supabase
    .from("profiles")
    .select(`id, username, twitter_profile, membership_status`)
    .in("id", roastUserIds);

  // Again shouldn't really happen, but just in case
  if (!profiles) {
    return baseRoasts;
  }

  const typedProfile = profiles as Profile[];

  const profilesByUserId: Map<string, Profile> = new Map(
    typedProfile?.filter(Boolean).map((p) => [p.id, p])
  );

  const augmentedRoasts: AugmentedRoast[] = typedRoasts
    ?.filter(Boolean)
    .map((roast) => {
      const profile = profilesByUserId.get(roast.user_id || "");
      return {
        ...roast,
        profile,
      };
    });

  return augmentedRoasts;
}
