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
      <p className="text-center text-gray-600">You have no accepted rides.</p>
    );
  }

  const formatDateTime = (dateString: string, timeString: string) => {
    const date = new Date(`${dateString}T${timeString}`);
    const formattedDate = new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
    const formattedTime = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${formattedDate} at ${formattedTime}`;
  };

  return (
    <div className="bg-gray-900 min-h-screen p-8">
      <h2 className="text-4xl font-extrabold text-center text-white mb-12">
        My Rides
      </h2>
      <div className="grid gap-12 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
        {acceptedRides.map((ride) => (
          <div
            key={ride.id}
            className="bg-gradient-to-b from-gray-700 to-gray-800 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105"
          >
            <div className="text-center">
              <span className="block text-xs uppercase tracking-widest text-gray-400">
                {formatDateTime(ride.pickupDate, ride.pickupTime)}
              </span>
              <h3 className="text-2xl text-white mt-2">Standard Ride</h3>
              <p className="text-sm text-gray-400 mt-1">
                {ride.riders.length}{" "}
                {ride.riders.length > 1 ? "Passengers" : "Passenger"}
              </p>
            </div>

            <div className="mt-6 text-center space-y-4">
              <div className="bg-gray-600 p-4 rounded-md">
                <h4 className="text-lg text-white">Pickup</h4>
                <p className="text-gray-300">{ride.pickupAddress}</p>
              </div>

              <div className="bg-gray-600 p-4 rounded-md">
                <h4 className="text-lg text-white">Dropoff</h4>
                <p className="text-gray-300">{ride.dropoffAddress}</p>
              </div>

              <div className="bg-gray-600 p-4 rounded-md">
                <h4 className="text-lg text-white">Estimated Time</h4>
                <p className="text-gray-300">Null</p>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button className="mt-4 ml-4 bg-teal-600 hover:bg-teal-500 text-white py-2 px-4 rounded-md transition-colors duration-200">
                <Link
                  href={`/driverdashboard/my-rides/ride?ride_id=${ride.id}`}
                >
                  View Details
                </Link>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
