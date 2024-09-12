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
  return (
    <div>
      <div className="flex flex-col items-center text-center mb-8">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
          Available Rides
        </h2>
        <p className="text-lg text-gray-700 max-w-2xl">
          Welcome, driver! Below is a list of rides that have been posted and
          are available for you to accept. Once accepted, these rides will move
          to your My Rides page.
        </p>
      </div>
      <AvailableRidesFeed rides={rides} user_id={user.id} />
    </div>
  );
}
