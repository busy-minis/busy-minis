// MyRides.tsx
import React from "react";
import SingleRides from "./singleRides";
import WeeklyRides from "./weeklyRides";
import { createClient } from "@/utils/supabase/server";
import {
  getRidesForUser,
  getWeeklyRidesForUser,
} from "@/utils/supabase/supabaseQueries";
import { redirect } from "next/navigation";

export default async function MyRides() {
  const supabase = createClient();

  // Get the currently logged-in user
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  // Fetch rides for the logged-in user
  const rides = await getRidesForUser(user.id);
  const weeklyRides = await getWeeklyRidesForUser(user.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className=" shadow">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">My Rides</h1>
        </div>
      </header>
      <main className="py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <p className="text-gray-800 text-lg">
              Manage your booked rides below.
            </p>
          </div>

          <div className="space-y-10">
            <SingleRides initialRides={rides} user_id={user.id} />
            <WeeklyRides weekly_rides={weeklyRides} user_id={user.id} />
          </div>
        </div>
      </main>
    </div>
  );
}
