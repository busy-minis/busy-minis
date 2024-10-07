// app/signup/actions.ts

"use server";

import { createClient } from "@/utils/supabase/server";

interface SignupResponse {
  error?: string;
  success?: boolean;
}

export async function signup(formData: FormData): Promise<SignupResponse> {
  const supabase = createClient();

  // Extract and type-cast form data
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    firstName: formData.get("firstName") as string,
    lastName: formData.get("lastName") as string,
    phoneNumber: formData.get("phone_number") as string, // Added phone number
  };

  // Attempt to sign up the user with Supabase Auth
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        first_name: data.firstName,
        last_name: data.lastName,
        phone_number: data.phoneNumber, // Added phone number to user metadata
        role: "user",
      },
    },
  });

  if (signUpError) {
    // Return the error message to the client for display
    console.error("Signup error:", signUpError.message);
    return { error: signUpError.message };
  }

  // Insert the user into your custom `users` table
  const { error: insertError } = await supabase.from("users").insert([
    {
      id: signUpData?.user?.id, // Use the user ID from the sign-up process
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone_number: data.phoneNumber, // Store phone number in custom table
      orientation_status: "unverified", // default to false until verified
      orientation_date: null, // default to null, adjust as needed
    },
  ]);

  if (insertError) {
    // Return the error message if inserting into `users` table fails
    console.error(
      "Error inserting user into custom users table:",
      insertError.message
    );
    return { error: insertError.message };
  }

  // On successful signup, return success
  return { success: true };
}
