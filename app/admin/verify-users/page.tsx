import React from "react";
import { getUnverifiedUsers } from "@/utils/supabase/supabaseQueries";
import VerifyUsersPage from "./UserDisplay";
import { revalidatePath } from "next/cache";
export default async function page() {
  const users = await getUnverifiedUsers();
  revalidatePath("/admin/verify-users");
  if (!users) {
    return <div>No users Found</div>;
  }
  return (
    <div>
      <VerifyUsersPage users={users} />
    </div>
  );
}
