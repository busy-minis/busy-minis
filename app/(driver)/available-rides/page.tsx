import React from "react";
import AvailableRidesFeed from "./AvailableRidesFeed";
import { getRidesByStatus } from "@/utils/supabase/supabaseQueries";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Car, AlertCircle, MapPin, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-blue-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center justify-center text-red-500">
              <AlertCircle className="w-8 h-8 mr-2" />
              Error: Unable to fetch user
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">Please try logging in again.</p>
            <Link href="/login">
              <Button variant="outline">Go to Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const rides = await getRidesByStatus("pending");
  revalidatePath("/available-rides");

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        <header className="text-center space-y-3 sm:space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Driver Dashboard
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Browse and accept rides that fit your schedule. Accepted rides will
            appear in your{" "}
            <span className="font-semibold text-teal-600">My Rides</span>{" "}
            section.
          </p>
        </header>

        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-teal-500 to-blue-500 text-white p-6">
            <CardTitle className="text-2xl font-semibold">
              Available Rides
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <AvailableRidesFeed rides={rides} user_id={user.id} />
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Link href="/accepted-rides">
            <Button
              size="lg"
              className="bg-teal-600 hover:bg-teal-700 text-white w-full sm:w-auto"
            >
              <Car className="mr-2 h-5 w-5" />
              View My Accepted Rides
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <StatCard
            icon={<MapPin className="h-8 w-8 text-teal-500" />}
            title="Total Distance"
            value="150 miles"
          />
          <StatCard
            icon={<Calendar className="h-8 w-8 text-blue-500" />}
            title="Rides This Week"
            value="12"
          />
          <StatCard
            icon={<Clock className="h-8 w-8 text-indigo-500" />}
            title="Average Ride Time"
            value="25 mins"
          />
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value }) => (
  <Card>
    <CardContent className="flex items-center space-x-4 p-4 sm:p-6">
      <div className="p-3 bg-gray-100 rounded-full">{icon}</div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-xl sm:text-2xl font-semibold text-gray-900">
          {value}
        </p>
      </div>
    </CardContent>
  </Card>
);
