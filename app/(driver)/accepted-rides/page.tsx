import { getAcceptedRidesByDriver } from "@/utils/supabase/supabaseQueries";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

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
        <h2 className="text-2xl font-bold text-gray-900">
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
            className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                {formatDateTime(ride.pickupDate, ride.pickupTime)}
              </span>
              <p className="text-sm text-gray-500">
                {ride.riders.length}{" "}
                {ride.riders.length > 1 ? "Passengers" : "Passenger"}
              </p>
            </div>

            {/* Ride Title */}
            <h3 className="mt-4 text-xl font-semibold text-gray-800">
              Ride to {ride.dropoffAddress}
            </h3>

            {/* Pickup and Dropoff Info */}
            <div className="mt-4">
              <div className="flex items-center text-gray-600 mb-3">
                <span className="w-4 h-4 bg-teal-500 rounded-full mr-2"></span>
                <p className="text-base">Pickup: {ride.pickupAddress}</p>
              </div>

              <div className="flex items-center text-gray-600">
                <span className="w-4 h-4 bg-amber-500 rounded-full mr-2"></span>
                <p className="text-base">Dropoff: {ride.dropoffAddress}</p>
              </div>
            </div>

            {/* View Details Button */}
            <div className="mt-5">
              <Link href={`/accepted-rides/ride?ride_id=${ride.id}`}>
                <div className="block text-center text-gray-800 border border-gray-300 py-2 rounded-md hover:bg-gray-100 transition-colors">
                  Go To Ride Page
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
