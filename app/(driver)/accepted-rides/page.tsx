import { getAcceptedRidesByDriver } from "@/utils/supabase/supabaseQueries";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { CalendarIcon, MapPinIcon, UsersIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function MyRides() {
  const supabase = createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-100 to-teal-100">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-lg text-gray-600">
              Error: Unable to fetch user.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const acceptedRides = await getAcceptedRidesByDriver(user.id);

  if (acceptedRides.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-100 to-teal-100 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-lg text-gray-700">
              You have no accepted rides at the moment.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatDateTime = (dateString: string, timeString: string) => {
    const date = new Date(`${dateString}T${timeString}`);
    return `${date.toLocaleDateString([], {
      weekday: "short",
      month: "short",
      day: "numeric",
    })} at ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-teal-100 p-6">
      {/* Header Section */}
      <div className="mb-12 text-center">
        <h2 className="mb-4 text-4xl font-bold text-gray-900">
          Your Accepted Rides
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-gray-600">
          Here are the rides you&#39;ve accepted. Check details, manage your
          rides, and complete your trips.
        </p>
      </div>

      {/* Rides Grid */}
      <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {acceptedRides.map((ride) => (
          <Card
            key={ride.id}
            className="overflow-hidden transition-all duration-300 hover:shadow-lg"
          >
            <CardHeader className="bg-gradient-to-r from-teal-500 to-blue-500 pb-8 pt-6">
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="bg-white/20 text-white">
                  <CalendarIcon className="mr-1 h-3 w-3" />
                  {formatDateTime(ride.pickupDate, ride.pickupTime)}
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white">
                  <UsersIcon className="mr-1 h-3 w-3" />
                  {ride.riders.length}{" "}
                  {ride.riders.length > 1 ? "Passengers" : "Passenger"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="-mt-6 space-y-6 rounded-t-3xl bg-white px-6 pt-8">
              <CardTitle className="text-2xl font-bold text-gray-800">
                Ride to {ride.dropoffAddress}
              </CardTitle>
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPinIcon className="mr-3 h-6 w-6 text-teal-500" />
                  <div>
                    <p className="font-medium text-gray-700">Pickup</p>
                    <p className="text-gray-600">{ride.pickupAddress}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPinIcon className="mr-3 h-6 w-6 text-amber-500" />
                  <div>
                    <p className="font-medium text-gray-700">Dropoff</p>
                    <p className="text-gray-600">{ride.dropoffAddress}</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-white px-6 pb-6">
              <Button
                asChild
                className="w-full bg-gradient-to-r from-teal-500 to-blue-500 text-white transition-all hover:from-teal-600 hover:to-blue-600"
              >
                <Link href={`/accepted-rides/ride?ride_id=${ride.id}`}>
                  View Ride Details
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
