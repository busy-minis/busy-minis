import React from "react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

import { getUnverifiedUsers } from "@/utils/supabase/supabaseQueries";
import VerifyUsersPage from "./UserDisplay";
export default async function page() {
  const drivers = await getUnverifiedUsers();
  console.log(drivers);

  return (
    <div>
      {" "}
      <VerifyUsersPage />{" "}
    </div>
  );
}
