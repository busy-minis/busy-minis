import React from "react";
import AddDriverForm from "../drivers/driver-form/DriverForm";
import DriversPage from "./drivers/page";
import { createClient } from "@/utils/supabase/server";

export default async function page() {
  const supabase = createClient();

  // Get the currently logged-in user
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return <p>Error: Unable to fetch user.</p>;
  }

  return (
    <div className="p-8">
      <p>Logged in as {user.email}</p>
    </div>
  );
}
