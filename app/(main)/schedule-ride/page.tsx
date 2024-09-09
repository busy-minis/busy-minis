import React from "react";
import RideOptions from "./main";
import OrientationPage from "./orientation";
import { createClient } from "@/utils/supabase/server";
import { getUserOrientationStatus } from "@/utils/supabase/supabaseQueries";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
export default async function page() {
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }
  const currentUser = await getUserOrientationStatus(user.id);
  revalidatePath("/driverdashboard/available-rides");

  if (currentUser.status !== "verified") {
    return <OrientationPage user_id={user.id} />;
  }

  return (
    <div>
      <RideOptions />
    </div>
  );
}
