// app/reset-password/actions.ts

"use server";

import { createClientWithToken } from "@/utils/supabase/clientWithToken";

interface ResetPasswordRequest {
  accessToken: string | null;
  newPassword: string;
}

export async function resetPassword({
  accessToken,
  newPassword,
}: ResetPasswordRequest) {
  if (!accessToken) {
    return { error: "Invalid or missing access token." };
  }

  // Initialize Supabase client with the access token
  const supabase = createClientWithToken(accessToken);

  // Update the user's password
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
