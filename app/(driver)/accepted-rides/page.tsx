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
    return <p>Error: Unable to fetch user.</p>;
  }

  const acceptedRides = await getAcceptedRidesByDriver(user.id);

  if (acceptedRides.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-500 p-4">
        <p className="text-lg text-white text-center">
          You have no accepted rides at the moment.
        </p>
      </div>
    );
  }

  const formatDateTime = (dateString: string, timeString: string) => {
    const date = new Date(`${dateString}T${timeString}`);
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-white p-6 md:p-10">
      {/* Instructional Header with Text */}
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
          Your Accepted Rides
        </h2>
        <p className="text-lg text-gray-700">
          Below are the rides you have accepted. You can view details, pickup
          and dropoff locations, and manage each ride. When youre ready, head
          out and complete your trips!
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {acceptedRides.map((ride) => (
          <div
            key={ride.id}
            className="bg-white p-6 rounded-lg shadow-lg transition-transform transform "
          >
            <div className="flex justify-between items-center">
              <span className="text-sm md:text-base text-purple-500 font-semibold">
                {formatDateTime(ride.pickupDate, ride.pickupTime)}
              </span>
              <p className="text-sm md:text-base text-gray-500">
                {ride.riders.length}{" "}
                {ride.riders.length > 1 ? "Passengers" : "Passenger"}
              </p>
            </div>
            <h3 className="mt-4 text-xl md:text-2xl font-semibold text-gray-800">
              Ride to {ride.dropoffAddress}
            </h3>

            <div className="mt-6 space-y-3">
              {/* Pickup Information */}
              <div className="flex items-center bg-gray-100 rounded-md p-3">
                <span className="w-5 h-5 bg-teal-500 rounded-full mr-3"></span>
                <p className="text-gray-700 text-base">
                  Pickup: {ride.pickupAddress}
                </p>
              </div>

              {/* Dropoff Information */}
              <div className="flex items-center bg-gray-100 rounded-md p-3">
                <span className="w-5 h-5 bg-amber-500 rounded-full mr-3"></span>
                <p className="text-gray-700 text-base">
                  Dropoff: {ride.dropoffAddress}
                </p>
              </div>
            </div>

            {/* View Details Button */}
            <div className="mt-6">
              <Link href={`/accepted-rides/ride?ride_id=${ride.id}`}>
                <div className="block text-center text-white bg-gradient-to-r from-pink-500 to-purple-500 py-2 px-4 rounded-lg hover:from-pink-600 hover:to-purple-600 transition-colors duration-300 text-base">
                  View Details
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
