import React from "react";
import RideOptions from "./main";
import OrientationPage from "./orientation";
import { createClient } from "@/utils/supabase/server";
export default async function page() {
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return <p>Error: Unable to fetch user.</p>;
  }
  console.log(user.id);
  return (
    <div>
      <OrientationPage user_id={user.id} />
      {/* <RideOptions /> */}
    </div>
  );
}
