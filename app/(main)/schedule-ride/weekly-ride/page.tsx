import React from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import WeeklyRideBookingPage from "./weeklyForm";
import { CalendarCheck, Car, Info } from "@phosphor-icons/react/dist/ssr";

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
    <div className="relative min-h-screen bg-gradient-to-br from-teal-50 to-teal-100">
      {/* Background gradients */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-teal-400 to-teal-100 opacity-60"></div>
        <div className="absolute bottom-0 right-0 w-full h-1/3 bg-gradient-to-t from-orange-200 to-yellow-100 opacity-60"></div>
      </div>

      {/* Section content */}
      <section className="relative pt-12 pb-8 sm:pt-16 sm:pb-10">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          {/* Calendar icon */}
          <CalendarCheck size={40} className="text-teal-600 mx-auto mb-2" />
          {/* Main title */}
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3">
            Schedule Your Weekly Ride
          </h1>
          {/* Description */}
          <p className="text-xs sm:text-base text-gray-600 mb-3">
            Simplify your commute by booking a weekly ride. Select passengers,
            pick-up and drop-off points, and your preferred days.
          </p>
          {/* Info section */}
          <p className="text-xs sm:text-sm text-gray-500 mb-3 flex items-center justify-center">
            <Info size={16} className="text-teal-600 mr-1" />
            Weekly rides will not be booked on the same day and will start on
            the next calendar day.
          </p>
          {/* Car icon */}
          <Car size={36} className="text-teal-600 mx-auto mt-3 mb-3" />
        </div>
      </section>

      {/* Booking form */}
      <WeeklyRideBookingPage userId={user.id} />
    </div>
  );
}
