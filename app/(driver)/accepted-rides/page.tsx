import { getAcceptedRidesByDriver } from "@/utils/supabase/supabaseQueries";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Flag, MapPin, Users } from "@phosphor-icons/react/dist/ssr";

export default async function MyRides() {
  const supabase = createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg text-gray-600">Error: Unable to fetch user.</p>
      </div>
    );
  }

  const acceptedRides = await getAcceptedRidesByDriver(user.id);

  if (acceptedRides.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <p className="text-lg text-gray-700 text-center">
          You have no accepted rides at the moment.
        </p>
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
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Your Accepted Rides
        </h2>
        <p className="text-md text-gray-600">
          Here are the rides youve accepted. Check details, manage your rides,
          and complete your trips.
        </p>
      </div>

      {/* Rides Grid */}
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {acceptedRides.map((ride) => (
          <div
            key={ride.id}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
          >
            {/* Ride Header */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-500 flex items-center">
                {formatDateTime(ride.pickupDate, ride.pickupTime)}
              </span>
              <span className="flex items-center text-sm text-gray-500">
                <Users size={20} className="mr-1" />
                {ride.riders.length}{" "}
                {ride.riders.length > 1 ? "Passengers" : "Passenger"}
              </span>
            </div>

            {/* Ride Title */}
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Ride to {ride.dropoffAddress}
            </h3>

            {/* Pickup and Dropoff Info */}
            <div className="mb-6">
              <div className="flex items-start text-gray-600 mb-3">
                <MapPin size={20} className="mt-1 mr-2 text-teal-500" />
                <p className="text-base">
                  <span className="font-medium">Pickup:</span>{" "}
                  {ride.pickupAddress}
                </p>
              </div>

              <div className="flex items-start text-gray-600">
                <Flag size={20} className="mt-1 mr-2 text-amber-500" />
                <p className="text-base">
                  <span className="font-medium">Dropoff:</span>{" "}
                  {ride.dropoffAddress}
                </p>
              </div>
            </div>

            {/* View Details Button */}
            <Link href={`/accepted-rides/ride?ride_id=${ride.id}`}>
              <div className="w-full block text-center text-white bg-teal-600 hover:bg-teal-700 transition-colors duration-200 py-2 rounded-md">
                View Ride Details
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
