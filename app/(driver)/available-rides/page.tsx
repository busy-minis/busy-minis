import React from "react";
import AvailableRidesFeed from "./AvailableRidesFeed";
import { getRidesByStatus } from "@/utils/supabase/supabaseQueries";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export default async function DriverDashboard() {
  const supabase = createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {
    return <p>Error: Unable to fetch user.</p>;
  }

  const rides = await getRidesByStatus("pending");
  revalidatePath("/driverdashboard/available-rides");
  console.log(rides);
  return <AvailableRidesFeed rides={rides} user_id={user.id} />;
}
