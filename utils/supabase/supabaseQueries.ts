import { createClient } from "@supabase/supabase-js";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl as string, supabaseKey as string);

export const getDrivers = async () => {
  try {
    let { data: drivers, error } = await supabase.from("drivers").select("*");

    if (error) {
      throw error;
    }
    return drivers;
    //Return all drivers
  } catch (error) {
    // Handle error
    console.error("Error Getting Drivers :", error);
    throw error;
  }
};
