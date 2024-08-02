"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/app/supabase/server";

// Login function
export async function login(formData: FormData) {
  const supabase = createClient();

  // Type-casting here for convenience
  // In practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    // Handle error (log it, display a message, etc.)
    console.error("Login error:", error.message);
    redirect("/error");
    return;
  }

  // Revalidate cache and redirect to home
  revalidatePath("/");
  redirect("/");
}

// Signup function
export async function signup(formData: FormData) {
  const supabase = createClient();

  // Type-casting here for convenience
  // In practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    // Handle error (log it, display a message, etc.)
    console.error("Signup error:", error.message);
    redirect("/error");
    return;
  }

  // Revalidate cache and redirect to home
  revalidatePath("/");
  redirect("/");
}

// Logout function
export async function logout() {
  const supabase = createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    // Handle error (log it, display a message, etc.)
    console.error("Logout error:", error.message);
    redirect("/error");
    return;
  }

  // Revalidate cache and redirect to home
  revalidatePath("/");
  redirect("/");
}
