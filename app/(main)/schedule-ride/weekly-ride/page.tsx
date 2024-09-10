import React from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import WeeklyRideBookingPage from "./weeklyForm";

import { CalendarCheck, Car, Info } from "@phosphor-icons/react/dist/ssr";

export default async function page() {
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
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-teal-400 to-teal-100 opacity-70"></div>
        <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-t from-orange-200 to-yellow-100 opacity-70"></div>
      </div>
      <section className="relative pt-24 pb-12">
        <div className="container mx-auto px-6 text-center">
          <CalendarCheck size={64} className="text-teal-600 mx-auto mb-4" />
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
            Schedule Your Weekly Ride
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Simplify your commute by booking a weekly ride. Select passengers,
            pick-up and drop-off points, and your preferred days.
          </p>
          <p className="text-md text-gray-500">
            <Info size={20} className="inline text-teal-600" /> Weekly rides
            will not be booked on the same day and will start on the next
            calendar day.
          </p>
          <Car size={48} className="text-teal-600 mx-auto mb-4 mt-6" />
        </div>
      </section>
      <WeeklyRideBookingPage userId={user.id} />
    </div>
  );
}
