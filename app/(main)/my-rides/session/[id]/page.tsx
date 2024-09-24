// page.tsx
import React from "react";
import { createClient } from "@/utils/supabase/client";

import RideSessionDetails from "./RideSessionDetails";
import { notFound } from "next/navigation";

interface RideSessionPageProps {
  params: { id: string };
}

export default async function RideSessionPage({
  params,
}: RideSessionPageProps) {
  const supabase = createClient();

  const rideId = params.id;

  // Fetch the ride session data
  const { data: rideSession, error } = await supabase
    .from("rides")
    .select("*")
    .eq("id", rideId)
    .single();

  if (error || !rideSession) {
    console.error(error);
    return notFound();
  }

  // Initialize driverInfo as null
  let driverInfo = null;

  // If driver_id exists and status is 'accepted', fetch the driver details
  if (rideSession.driver_id && rideSession.status === "accepted") {
    const { data: driver, error: driverError } = await supabase
      .from("drivers")
      .select("*")
      .eq("id", rideSession.driver_id)
      .single();

    if (driverError) {
      console.error(driverError);
      // Optionally handle the error (e.g., set driverInfo to null or show a message)
    } else {
      driverInfo = driver;
    }
  }

  // Assume you have a way to get the current user's ID
  const userId = "user-id-placeholder"; // Replace this with actual user ID fetching logic

  return (
    <RideSessionDetails
      rideSession={rideSession}
      userId={userId}
      driver={driverInfo} // Pass driver info as a prop
    />
  );
}
