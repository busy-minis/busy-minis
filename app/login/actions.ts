// actions.ts
"use server";

import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  // Attempt to sign in with email and password
  const { error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (error) {
    // Map Supabase error codes to user-friendly messages
    let userFriendlyMessage = "An unexpected error occurred. Please try again.";

    switch (error.code) {
      case "AUTH_INVALID_PASSWORD":
      case "INVALID_PASSWORD":
      case "AUTH_USER_NOT_FOUND":
        userFriendlyMessage = "Invalid email or password.";
        break;
      case "AUTH_NETWORK_ERROR":
        userFriendlyMessage = "Network error. Please check your connection.";
        break;
      case "AUTH_EMAIL_NOT_VERIFIED":
        userFriendlyMessage = "Please verify your email before logging in.";
        break;
      // Add more cases as needed based on Supabase error codes
      default:
        userFriendlyMessage = error.message; // Fallback to Supabase's message
    }

    // Return the user-friendly error message to the client
    return { error: userFriendlyMessage };
  }

  // On successful login, return success
  return { success: true };
}
