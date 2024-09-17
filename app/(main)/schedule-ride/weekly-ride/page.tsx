import React from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import WeeklyRideBookingPage from "./weeklyForm";
import { CalendarCheck } from "@phosphor-icons/react/dist/ssr";

export default async function Page() {
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">
      {/* Background gradients */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-gray-200 to-gray-50 opacity-60"></div>
        <div className="absolute bottom-0 right-0 w-full h-1/3 bg-gradient-to-t from-gray-200 to-gray-50 opacity-60"></div>
      </div>

      {/* Section content */}
      <section className="relative pt-12 pb-8 sm:pt-16 sm:pb-10">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          {/* Calendar icon */}
          <CalendarCheck size={40} className="text-gray-700 mx-auto mb-2" />
          {/* Main title */}
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3">
            Schedule Your Weekly Ride
          </h1>
          {/* Description */}
          <p className="text-xs sm:text-base text-gray-600 mb-3">
            Simplify your commute by booking a weekly ride. Select passengers,
            pick-up and drop-off points, optional stops, and your preferred
            days.
          </p>
        </div>
      </section>

      {/* Booking form */}
      <WeeklyRideBookingPage userId={user.id} />
    </div>
  );
}
