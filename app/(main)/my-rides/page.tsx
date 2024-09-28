// MyRides.tsx
import React from "react";
import SingleRides from "./singleRides";
import WeeklyRides from "./weeklyRides";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import {
  getRidesForUser,
  getWeeklyRidesForUser,
} from "@/utils/supabase/supabaseQueries";
import { redirect } from "next/navigation";

export default async function MyRides() {
  revalidatePath("/my-rides");

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
    <div className=" px-0  min-h-screen">
      <header className="bg-zinc-900 text-white ">
        <div className="container  border-x-zinc-700   mx-auto px-4 py-6  ">
          <h1 className="text-3xl font-semibold  tracking-tight text-teal-200">
            My Rides
          </h1>
          {/* Optional: Add a user avatar or settings button here */}
          <p className="text-zinc-400 text-lg mt-2">
            Manage your booked rides below.
          </p>
        </div>
      </header>
      <main className="py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8"></div>

          <div className="flex gap-4 justify-between ">
            <SingleRides initialRides={rides} user_id={user.id} />
            <WeeklyRides weekly_rides={weeklyRides} user_id={user.id} />
          </div>
        </div>
      </main>
    </div>
  );
}
