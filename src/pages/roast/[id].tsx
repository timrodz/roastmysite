import { Database } from "@lib/database.types";
import { supabase } from "@lib/supabase";
// type Profiles = Database["public"]["Tables"]["webpage"]["Row"];

function Page({ webpages }) {
  return (
    <ul>
      {webpages.map((country) => (
        <li key={country.id}>{country.name}</li>
      ))}
    </ul>
  );
}

export async function getServerSideProps() {
  let { data } = await supabase.from("webpage").select();

  return {
    props: {
      webpages: data,
    },
  };
}

export default Page;
