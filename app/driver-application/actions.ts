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
  const phoneNumber = formData.get("phoneNumber") as string; // New phone number field
  const vehicleColor = formData.get("vehicleColor") as string;
  const vehicleYear = formData.get("vehicleYear") as string;

  // Step 1: Sign up the driver in Supabase Auth
  const { data: signUpData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber, // Optional to store phone in the profile
      },
    },
  });

  if (authError) {
    console.error("Signup error:", authError.message);
    redirect("/error");
    return;
  }

  const userId = signUpData?.user?.id;

  // Check if userId is defined
  if (!userId) {
    console.error("User ID is undefined after signup");
    redirect("/error");
    return;
  }

  // Step 2: Insert the driver’s details into the drivers table
  const { error: insertError } = await supabase.from("drivers").insert([
    {
      id: userId,
      first_name: firstName,
      last_name: lastName,
      email: email,
      phone_number: phoneNumber, // New phone number field
      license_plate: licensePlate,
      vehicle_brand: vehicleBrand,
      vechile_color: vehicleColor,
      vehicle_year: vehicleYear,
    },
  ]);

  // If there's an error inserting into the drivers table, delete the user from auth
  if (insertError) {
    console.error("Error creating driver:", insertError.message);

    // Step 3: Delete the user from Supabase Auth since the insert failed
    const { error: deleteError } = await supabase.auth.admin.deleteUser(userId);

    if (deleteError) {
      console.error("Error deleting user from auth:", deleteError.message);
    }

    redirect("/error");
    return;
  }

  // Revalidate cache and redirect to the drivers list page
  revalidatePath("/signup-success");
  redirect("/signup-success");
}
