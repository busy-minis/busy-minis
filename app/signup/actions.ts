"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

// Signup function
export async function signup(formData: FormData) {
  const supabase = createClient();

  // Type-casting here for convenience
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    firstName: formData.get("firstName") as string,
    lastName: formData.get("lastName") as string,
  };

  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        first_name: data.firstName,
        last_name: data.lastName,
      },
    },
  });

  if (signUpError) {
    // Handle error (log it, display a message, etc.)
    console.error("Signup error:", signUpError.message);
    redirect("/error");
    return;
  }

  // Insert the user into your custom `users` table
  const { error: insertError } = await supabase.from("users").insert([
    {
      id: signUpData?.user?.id, // Use the user ID from the sign-up process
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      orientation_status: "unverified", // default to false until verified
      orientation_date: null, // default to null, adjust as needed
    },
  ]);

  if (insertError) {
    // Handle error (log it, display a message, etc.)
    console.error(
      "Error inserting user into custom users table:",
      insertError.message
    );
    redirect("/error");
    return;
  }

  // Redirect to the signup success page
  revalidatePath("/signup-success");
  redirect("/signup-success");
}
