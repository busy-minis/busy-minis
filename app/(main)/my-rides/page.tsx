import React from "react";
import Footer from "@/app/components/ui/Footer";
import SingleRides from "./singleRides";
import WeeklyRides from "./weeklyRides";
import { createClient } from "@/utils/supabase/server";
import { getRidesForUser } from "@/utils/supabase/supabaseQueries";
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

  // Fetch pending rides for the logged-in user
  const rides = await getRidesForUser(user.id);
  console.log(rides);

  return (
    <div className="relative ">
      {/* Background Decorations */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-teal-200 to-white opacity-80"></div>
        <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-t from-orange-100 to-white opacity-80"></div>
      </div>

      <section className="relative pt-24  pb-16 lg:pb-32">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="font-semibold text-xl text-teal-600 mb-2 block">
              My Rides
            </span>
            <h2 className="font-bold text-4xl sm:text-5xl text-gray-900 mb-6">
              Your Booked Rides
            </h2>
            <p className="text-lg max-w-2xl mx-auto text-gray-600">
              Manage and review your booked rides, both single rides and weekly
              rides. You can cancel individual rides or manage your weekly
              rides, adjusting pickup times and dates.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Pass the rides data to your components as needed */}
            <SingleRides initialRides={rides} user_id={user.id} />
            <WeeklyRides />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
