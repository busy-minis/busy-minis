import { getAcceptedRidesByDriver } from "@/utils/supabase/supabaseQueries";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import {
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
  AlertCircle,
  Car,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

export default async function MyRides() {
  const supabase = createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center justify-center text-red-600">
              <AlertCircle className="mr-2 h-6 w-6" />
              Error: Unable to fetch user
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">Please try logging in again.</p>
            <Button asChild variant="outline">
              <Link href="/login">Go to Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const acceptedRides = await getAcceptedRidesByDriver(user.id);

  if (acceptedRides.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-semibold">
              No Accepted Rides
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-6">
              You have no accepted rides at the moment.
            </p>
            <Button asChild>
              <Link href="/available-rides">Find Available Rides</Link>
            </Button>
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
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 sm:mb-12 text-center">
          <h1 className="mb-4 text-3xl sm:text-4xl font-bold text-gray-900">
            Your Accepted Rides
          </h1>
          <p className="mx-auto max-w-2xl text-base sm:text-lg text-gray-600">
            Manage your accepted rides, check details, and complete your trips
            efficiently.
          </p>
        </header>

        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {acceptedRides.map((ride) => (
              <Card
                key={ride.id}
                className="overflow-hidden transition-all duration-300 hover:shadow-md"
              >
                <CardHeader className="bg-gray-100 p-4 sm:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Badge
                      variant="secondary"
                      className="bg-white text-gray-700"
                    >
                      <CalendarIcon className="mr-1 h-3 w-3" />
                      {formatDateTime(ride.pickupDate, ride.pickupTime)}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="bg-white text-gray-700"
                    >
                      <UsersIcon className="mr-1 h-3 w-3" />
                      {ride.riders.length}{" "}
                      {ride.riders.length > 1 ? "Passengers" : "Passenger"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 space-y-4">
                  <CardTitle className="text-xl sm:text-2xl font-bold text-gray-800">
                    Ride to {ride.dropoffAddress}
                  </CardTitle>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <MapPinIcon className="mr-3 h-5 w-5 text-green-600 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-700">Pickup</p>
                        <p className="text-sm text-gray-600">
                          {ride.pickupAddress}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <MapPinIcon className="mr-3 h-5 w-5 text-red-600 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-700">Dropoff</p>
                        <p className="text-sm text-gray-600">
                          {ride.dropoffAddress}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 sm:p-6">
                  <Button
                    asChild
                    className="w-full bg-gray-800 text-white transition-all hover:bg-gray-700"
                  >
                    <Link href={`/accepted-rides/ride?ride_id=${ride.id}`}>
                      <Car className="mr-2 h-4 w-4" />
                      View Ride Details
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
