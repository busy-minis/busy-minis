import React from "react";
import OrientationPage from "./orientation";
import { createClient } from "@/utils/supabase/server";
import { getUserOrientationStatus } from "@/utils/supabase/supabaseQueries";

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

  if (currentUser.status == "verified") {
    redirect("/");
  }

  return (
    <div>
      <OrientationPage user_id={user.id} />
    </div>
  );
}
