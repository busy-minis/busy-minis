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
      {/* Booking form */}
      <WeeklyRideBookingPage userId={user.id} />
    </div>
  );
}
