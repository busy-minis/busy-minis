import React from "react";
import RidePage from "./RidePage";
import { Suspense } from "react";
import { revalidatePath } from "next/cache";

import { createClient } from "@/utils/supabase/server";

export default async function page() {
  revalidatePath("/accepted-rides");

  const supabase = createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg text-gray-600">Error: Unable to fetch user.</p>
      </div>
    );
  }

  return (
    <div>
      <Suspense>
        <RidePage userId={user.id} />
      </Suspense>
    </div>
  );
}
