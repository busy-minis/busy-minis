import React from "react";
import SingleRideBooking from "./SingleRideForm";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
export default async function page() {
  const supabase = createClient();

  // Get the currently logged-in user
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  return (
    <div>
      <SingleRideBooking userId={user.id} />
    </div>
  );
}
