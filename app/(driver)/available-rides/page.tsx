import React from "react";
import AvailableRidesFeed from "./AvailableRidesFeed";
import { getRidesByStatus } from "@/utils/supabase/supabaseQueries";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Car, Info } from "@phosphor-icons/react/dist/ssr";

interface Rider {
  id: string;
  name: string;
  age: number;
}

interface Ride {
  id: string;
  pickupDate: string;
  pickupTime: string;
  pickupAddress: string;
  dropoffAddress: string;
  riders: Rider[];
  distance: number;
}

export default async function DriverDashboard() {
  const supabase = createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <Info size={48} className="text-red-500 mx-auto mb-4" />
          <p className="text-xl text-gray-800 mb-4">
            Error: Unable to fetch user.
          </p>
          <Link
            href="/login"
            className="text-teal-600 hover:text-teal-800 transition-colors font-medium"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const rides = await getRidesByStatus("pending");
  revalidatePath("/available-rides");

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Available Rides
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Browse and accept rides that fit your schedule. Once accepted, rides
            will appear in your{" "}
            <span className="font-semibold text-teal-600">My Rides</span>{" "}
            section.
          </p>
        </div>

        <section className="bg-white shadow-lg rounded-xl p-6 md:p-8">
          <AvailableRidesFeed rides={rides} user_id={user.id} />
        </section>

        <div className="mt-12 text-center">
          <Link
            href="/accepted-rides"
            className="inline-flex items-center px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          >
            <Car size={24} className="mr-2" />
            View My Accepted Rides
          </Link>
        </div>
      </div>
    </div>
  );
}
