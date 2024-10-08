import React from "react";
import RideOptions from "./main";
import { createClient } from "@/utils/supabase/server";
import { getUserOrientationStatus } from "@/utils/supabase/supabaseQueries";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
export default async function page() {
  revalidatePath("/schedule-ride");

  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }
  const currentUser = await getUserOrientationStatus(user.id);

  if (currentUser.status !== "verified") {
    redirect("/orientation");
  }

  return (
    <div>
      <RideOptions />
    </div>
  );
}
