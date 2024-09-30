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
  Calendar,
  PencilSimple,
} from "@phosphor-icons/react/dist/ssr";
import { Metadata } from "next";
import PhotoForm from "./PhotoForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Card>
          <CardContent className="pt-6">
            <p className="text-lg text-gray-600">
              Error: Unable to fetch user.
            </p>
            <Button asChild className="mt-4">
              <Link href="/login">Go to Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { data: driverData, error: driverError } = await supabase
    .from("drivers")
    .select("*")
    .eq("id", user.id)
    .single();

  if (driverError || !driverData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Card>
          <CardContent className="pt-6">
            <p className="text-lg text-gray-600">
              Error: Unable to fetch driver profile.
            </p>
            <Button asChild className="mt-4">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const successMessage = Array.isArray(searchParams.success)
    ? searchParams.success[0]
    : searchParams.success;
  const errorMessage = Array.isArray(searchParams.error)
    ? searchParams.error[0]
    : searchParams.error;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-teal-500 to-teal-600 text-white p-6">
            <div className="flex items-center space-x-4">
              <Avatar className="w-24 h-24 border-4 border-white">
                <AvatarImage
                  src={driverData.photo_url || "/default-avatar.png"}
                  alt="Profile Photo"
                />
                <AvatarFallback>
                  {driverData.first_name[0]}
                  {driverData.last_name[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-3xl font-bold">
                  {driverData.first_name} {driverData.last_name}
                </CardTitle>
                <p className="text-teal-100 flex items-center mt-1">
                  <EnvelopeSimple size={16} className="mr-2" />
                  {driverData.email}
                </p>
                <p className="text-teal-100 flex items-center mt-1">
                  <Phone size={16} className="mr-2" />
                  {driverData.phone_number}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {successMessage && (
              <div className="mb-4 p-4 bg-green-100 text-green-700 rounded animate-fade-in">
                {successMessage}
              </div>
            )}
            {errorMessage && (
              <div className="mb-4 p-4 bg-red-100 text-red-700 rounded animate-fade-in">
                {errorMessage}
              </div>
            )}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <Car size={24} className="mr-2 text-teal-500" />
                  Vehicle Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InfoItem
                    icon={<Car size={20} className="text-teal-500" />}
                    label="License Plate"
                    value={driverData.license_plate}
                  />
                  <InfoItem
                    icon={<MapPin size={20} className="text-amber-500" />}
                    label="Vehicle Brand"
                    value={driverData.vehicle_brand}
                  />
                  <InfoItem
                    icon={<Flag size={20} className="text-blue-500" />}
                    label="Vehicle Year"
                    value={driverData.vehicle_year}
                  />
                  <InfoItem
                    icon={<Users size={20} className="text-purple-500" />}
                    label="Vehicle Color"
                    value={driverData.vehicle_color}
                  />
                </div>
              </div>
              <Separator />
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <Calendar size={24} className="mr-2 text-teal-500" />
                  Account Information
                </h3>
                <p className="text-gray-600">
                  Member since:{" "}
                  {new Date(driverData.created_at).toLocaleDateString()}
                </p>
                <Badge variant="secondary" className="mt-2">
                  {driverData.driver ? "Active Driver" : "Inactive Driver"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center space-x-4">
          <Button asChild variant="default">
            <Link href="/available-rides">
              <MapPin size={20} className="mr-2" />
              Available Rides
            </Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/accepted-rides">
              <Flag size={20} className="mr-2" />
              Accepted Rides
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/edit-profile">
              <PencilSimple size={20} className="mr-2" />
              Edit Profile
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const InfoItem: React.FC<InfoItemProps> = ({ icon, label, value }) => (
  <div className="flex items-center space-x-2 text-gray-600">
    {icon}
    <span>
      <strong>{label}:</strong> {value}
    </span>
  </div>
);
