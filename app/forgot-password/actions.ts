// app/forgot-password/actions.ts

"use server";

import { createClient } from "@/utils/supabase/server";

interface SendPasswordResetRequest {
  email: string;
}

export async function sendPasswordReset({ email }: SendPasswordResetRequest) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password`, // Ensure this matches your Reset Password page URL
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
