import React from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import WeeklyRideBookingPage from "./weeklyForm";

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
    <div>
      <WeeklyRideBookingPage />
    </div>
  );
}
