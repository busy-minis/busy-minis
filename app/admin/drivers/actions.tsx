import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_KEY!
);

export async function fetchDrivers() {
  const { data, error } = await supabase
    .from("drivers")
    .select("id, full_name, license_plate, photo_url");

  if (error) {
    throw new Error(`Failed to fetch drivers: ${error.message}`);
  }

  return data;
}
