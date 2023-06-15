import { SupabaseClient, createClient } from "@supabase/supabase-js";
import { Database } from "./database.types";
import { CONSTANTS } from "./metadata";

export type Supabase = SupabaseClient<Database>;

export type Website = Database["public"]["Tables"]["websites"]["Row"];
export type Roast = Database["public"]["Tables"]["roasts"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type MembershipStatus = Database["public"]["Enums"]["membership_status"];
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

export const supabaseClient: Supabase = createClient<Database>(
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

/** Functionality that runs on the server needs to use a server side client */
function getClient(
  serverSideClient?: SupabaseClient<Database>
): SupabaseClient<Database> {
  if (serverSideClient) {
    return serverSideClient;
  }
  return supabaseClient;
}

export async function getSiteData(url: string) {
  const { data } = await supabaseClient
    .from("websites")
    .select("id, owner_id")
    .eq("url", url)
    .limit(1)
    .maybeSingle();

  console.log(`site data for url "${url}"`, data);

  return data;
}

export async function isUserPremium(userId: string): Promise<boolean> {
  const client = getClient();

  const { data } = await client
    .from("profiles")
    .select("membership_status")
    .eq("id", userId)
    .limit(1)
    .maybeSingle();

  return (data as Profile)?.membership_status !== null;
}

type UserProfile = {
  id: Profile["id"];
  username: Profile["username"];
  twitter_profile: Profile["twitter_profile"];
  membership_status: Profile["membership_status"];
};

export async function getUserProfileById(
  userId: string
): Promise<UserProfile | null> {
  const { data } = await supabaseClient
    .from("profiles")
    .select("id, username, twitter_profile, membership_status")
    .eq("id", userId)
    .limit(1)
    .maybeSingle();

  return data;
}

export async function getMultipleUserProfilesById(
  userIds: string[]
): Promise<UserProfile[] | null> {
  const { data } = await supabaseClient
    .from("profiles")
    .select("id, username, twitter_profile, membership_status")
    .in("id", userIds);

  return data;
}

export async function getServerSideSessionUser(
  serverSideClient: SupabaseClient<Database>
): Promise<SessionUser> {
  const client = getClient(serverSideClient);
  const {
    data: { session },
  } = await client.auth.getSession();

  if (!session) {
    return null;
  }

  return {
    id: session.user.id,
    isPremium: await isUserPremium(session.user.id),
  };
}

export async function getRoastsForSite(
  sessionUser: SessionUser,
  url: string
): Promise<{
  siteId: number | null;
  siteOwnerUserId: string | null;
  roasts: AugmentedRoast[] | null;
}> {
  console.log({ sessionUser });
  const { data: roastsForWebsite } = sessionUser?.isPremium
    ? await supabaseClient.rpc("get_roasts_for_website", { url })
    : await supabaseClient
        .rpc("get_roasts_for_website", { url })
        .limit(CONSTANTS.MAX_ROASTS_FREE_USER);

  // No roasts, but the website can have an entry, i.e. if it had roasts in the past but they were all deleted
  if (!roastsForWebsite?.length) {
    const data = await getSiteData(url);

    console.log("no roasts but heres", { data, url });

    return {
      siteId: data?.id ?? null,
      siteOwnerUserId: null,
      roasts: null,
    };
  }

  const { site_id, site_owner_id } = roastsForWebsite[0];

  const roasts: AugmentedRoast[] = roastsForWebsite?.map((d) => ({
    id: d.roast_id,
    createdAt: d.roast_created_at,
    content: d.roast_content,
    authorId: d.roast_author_id,
    authorUsername: d.author_username,
    authorTwitter: d.author_twitter_profile,
    authorMembershipStatus: d.author_membership_status,
  }));

  return {
    siteId: site_id,
    siteOwnerUserId: site_owner_id,
    roasts,
  };
}

export async function getSiteForOwner(
  url: string,
  userId: string
): Promise<number | null> {
  const { data } = await supabaseClient
    .from("websites")
    .select("id")
    .match({ url, owned_by_user_id: userId })
    .limit(1)
    .maybeSingle();

  return data?.id ?? null;
}
