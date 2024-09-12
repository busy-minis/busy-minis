import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import DriverBarClient from "./DriverBar";

export const DriverBarServer = async () => {
  const supabase = createClient();

  // Fetch the authenticated user
  const { data: authData, error: authError } = await supabase.auth.getUser();
  const user = authData?.user;

  // If no user is authenticated, redirect to login
  if (!user || !user.email || authError) {
    redirect("/login");
    return null;
  }

  // Check if the user is a driver by querying the drivers table
  const { data: driverData, error: driverError } = await supabase
    .from("drivers")
    .select("driver")
    .eq("email", user.email)
    .single();

  // Redirect to /403 if the user is not a driver
  if (!driverData?.driver || driverError) {
    redirect("/403");
    return null;
  }

  return (
    <div>
      {/* Render the Client-Side Navigation */}
      <DriverBarClient />
    </div>
  );
};

export default DriverBarServer;
