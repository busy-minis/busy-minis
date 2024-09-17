import React from "react";
import ManageWeeklyRide from "./ManageWeeklyRide";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function ManageWeeklyRidePage({ searchParams }: any) {
  const supabase = createClient();

  // Get the currently logged-in user
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  const id = searchParams.id;

  if (!id) {
    redirect("/my-rides");
  }

  // Fetch the weekly ride data
  const { data: weeklyRide, error: weeklyRideError } = await supabase
    .from("weekly_rides")
    .select("*")
    .eq("id", id)
    .single();

  if (weeklyRideError || !weeklyRide) {
    redirect("/my-rides");
  }

  return (
    <div>
      <ManageWeeklyRide weeklyRide={weeklyRide} userId={user.id} />
    </div>
  );
}
