"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Login function
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
    // Return the error message to the client for display
    return { error: error.message };
  }

  // On successful login, return success
  return { success: true };
}

// Signup function
export async function signup(formData: FormData) {
  const supabase = createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    firstName: formData.get("firstName") as string,
    lastName: formData.get("lastName") as string,
  };

  // Attempt to sign up the user
  const { data: signUpData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        first_name: data.firstName,
        last_name: data.lastName,
      },
    },
  });

  if (error) {
    // Return the error message to the client for display
    return { error: error.message };
  }

  // Insert additional user data into a custom `users` table
  const { error: insertError } = await supabase.from("users").insert([
    {
      id: signUpData?.user?.id,
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      verified: false,
      role: "user", // default role
    },
  ]);

  if (insertError) {
    // Return the error message if inserting into `users` table fails
    return { error: insertError.message };
  }

  // On successful signup, return success
  return { success: true };
}

// Logout function
