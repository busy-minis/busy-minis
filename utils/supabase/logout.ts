"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function logout() {
  const supabase = createClient();

  // Attempt to sign out
  const { error } = await supabase.auth.signOut();

  if (error) {
    // Return the error message to the client for display
    return { error: error.message };
  }

  // On successful logout, return success
  return { success: true };
}
