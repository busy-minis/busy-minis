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
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg text-gray-600">Error: Unable to fetch user.</p>
      </div>
    );
  }

  const rides = await getRidesByStatus("pending");
  revalidatePath("/driverdashboard/available-rides");

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header Section */}
      <div className="text-center mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          Available Rides
        </h2>
        <p className="text-sm md:text-md text-gray-600 max-w-2xl mx-auto">
          Below is a list of rides available for you to accept. Once accepted,
          these rides will move to your{" "}
          <span className="font-semibold text-teal-600">My Rides</span> page.
        </p>
      </div>

      {/* Available Rides Feed */}
      <section className="bg-white shadow-md rounded-lg p-4 md:p-6">
        <AvailableRidesFeed rides={rides} user_id={user.id} />
      </section>
    </div>
  );
}
