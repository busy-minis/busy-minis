import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import DriverBarClient from "./DriverBar";

export const DriverBarServer = async () => {
  const supabase = createClient();

  // Fetch the authenticated user
  const { data: authData, error: authError } = await supabase.auth.getUser();
  const user = authData?.user;

  // If no user is authenticated or there's an error, redirect to login
  if (!user || !user.email || authError) {
    redirect("/login");
    return null;
  }

  // Retrieve the user's role from metadata
  const userRole = user.user_metadata?.role;

  // If the user is not a driver, redirect to the 403 Forbidden page
  if (userRole !== "driver") {
    redirect("/403");
    return null;
  }

  // If the user is a driver, render the DriverBarClient component
  return (
    <div>
      {/* Render the Client-Side Driver Navigation */}
      <DriverBarClient />
    </div>
  );
};

export default DriverBarServer;
