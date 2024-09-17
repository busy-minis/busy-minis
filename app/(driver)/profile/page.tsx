// app/profile/page.tsx
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Flag,
  Users,
  Camera,
  Phone,
  Car,
  EnvelopeSimple,
} from "@phosphor-icons/react/dist/ssr";
import { Metadata } from "next";
import PhotoForm from "./PhotoForm";

interface Driver {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  photo_url: string;
  license_plate: string;
  vehicle_brand: string;
  vehicle_year: string;
  vehicle_color: string;
  driver: boolean;
  created_at: string;
}

export const metadata: Metadata = {
  title: "Driver Profile",
  description: "View and update your driver profile.",
};

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const supabase = createClient();

  // Fetch the authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg text-gray-600">Error: Unable to fetch user.</p>
      </div>
    );
  }

  // Fetch driver profile from 'drivers' table
  const { data: driverData, error: driverError } = await supabase
    .from("drivers")
    .select("*")
    .eq("id", user.id)
    .single();

  if (driverError || !driverData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg text-gray-600">
          Error: Unable to fetch driver profile.
        </p>
      </div>
    );
  }

  // Handle success and error messages via query parameters
  const successMessage = Array.isArray(searchParams.success)
    ? searchParams.success[0]
    : searchParams.success;
  const errorMessage = Array.isArray(searchParams.error)
    ? searchParams.error[0]
    : searchParams.error;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
        {/* Profile Header */}
        <div className="flex flex-col items-center">
          {/* Profile Photo */}
          <div className="relative">
            <Image
              src={driverData.photo_url || "/default-avatar.png"}
              alt="Profile Photo"
              width={400}
              height={400}
              className="w-32 h-32 rounded-full object-cover"
            />
            <label
              htmlFor="profilePhoto"
              className="absolute bottom-0 right-0 bg-teal-600 rounded-full p-2 cursor-pointer hover:bg-teal-700 transition-colors"
            >
              <Camera size={20} weight="fill" className="text-white" />
              <PhotoForm />
            </label>
          </div>

          {/* Driver Name */}
          <h2 className="mt-4 text-2xl font-bold text-gray-900">
            {driverData.first_name} {driverData.last_name}
          </h2>
          <p className="text-gray-600 flex items-center mt-1">
            <EnvelopeSimple size={20} className="mr-2" />
            {driverData.email}
          </p>
          <p className="text-gray-600 flex items-center mt-1">
            <Phone size={20} className="mr-2" />
            {driverData.phone_number}
          </p>
        </div>

        {/* Success and Error Messages */}
        {successMessage && (
          <div className="mt-4 p-4 bg-green-100 text-green-700 rounded">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
            {errorMessage}
          </div>
        )}

        {/* Driver Details */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Vehicle Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center text-gray-600">
              <Car size={20} className="mr-2 text-teal-500" />
              <span>
                <strong>License Plate:</strong> {driverData.license_plate}
              </span>
            </div>
            <div className="flex items-center text-gray-600">
              <MapPin size={20} className="mr-2 text-amber-500" />
              <span>
                <strong>Vehicle Brand:</strong> {driverData.vehicle_brand}
              </span>
            </div>
            <div className="flex items-center text-gray-600">
              <Flag size={20} className="mr-2 text-blue-500" />
              <span>
                <strong>Vehicle Year:</strong> {driverData.vehicle_year}
              </span>
            </div>
            <div className="flex items-center text-gray-600">
              <Users size={20} className="mr-2 text-purple-500" />
              <span>
                <strong>Vehicle Color:</strong> {driverData.vehicle_color}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="mt-8 flex justify-center space-x-4">
          <Link href="/available-rides">
            <div className="flex items-center px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors">
              <MapPin size={20} className="mr-2" />
              Available Rides
            </div>
          </Link>
          <Link href="/accepted-rides">
            <div className="flex items-center px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 transition-colors">
              <Flag size={20} className="mr-2" />
              Accepted Rides
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
