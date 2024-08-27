"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function createDriver(formData: FormData) {
  const supabase = createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const licensePlate = formData.get("licensePlate") as string;
  const vehicleBrand = formData.get("vehicleBrand") as string;

  // Step 1: Sign up the driver in Supabase Auth
  const { data: signUpData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
      },
    },
  });

  if (authError) {
    console.error("Signup error:", authError.message);
    redirect("/error");
    return;
  }

  // Step 2: Insert the driver’s details into the drivers table
  const { error: insertError } = await supabase.from("drivers").insert([
    {
      id: signUpData?.user?.id,
      first_name: firstName,
      last_name: lastName,
      email: email,
      license_plate: licensePlate,
      vehicle_brand: vehicleBrand,
      is_active: false, // Assuming the driver is inactive until verified
      current_location: null, // Assuming no location is provided at the time of sign-up
    },
  ]);

  if (insertError) {
    console.error("Error creating driver:", insertError.message);
    redirect("/error");
    return;
  }

  // Revalidate cache and redirect to the drivers list page
  revalidatePath("/signup-success");
  redirect("/signup-success");
}
