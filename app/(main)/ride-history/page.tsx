import React from "react";
import { CheckCircle, Clock, XCircle } from "@phosphor-icons/react/dist/ssr";
import { createClient } from "@/utils/supabase/server";
import { getCompletedOrCanceledRides } from "@/utils/supabase/supabaseQueries";
import { redirect } from "next/navigation";

export default async function RideHistory() {
  const supabase = createClient();

  // Get the currently logged-in user
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  // Fetch completed or canceled rides for the logged-in user
  const rides = await getCompletedOrCanceledRides(user.id);

  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* Background Decorations */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-teal-200 to-white opacity-80"></div>
        <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-t from-orange-100 to-white opacity-80"></div>
      </div>

      <section className="relative pt-24 pb-16 lg:pb-32">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="font-semibold text-xl text-teal-600 mb-2 block">
              Ride History
            </span>
            <h2 className="font-bold text-4xl sm:text-5xl text-gray-900 mb-6">
              Your Previous Rides
            </h2>
            <p className="text-lg max-w-2xl mx-auto text-gray-600">
              Review your past rides with Busy Minis and check your ride status.
            </p>
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block bg-white shadow-lg rounded-lg overflow-hidden">
            <table className="min-w-full leading-normal text-left">
              <thead>
                <tr className="bg-teal-600 text-white">
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider">
                    Ride Type
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider">
                    Pickup Location
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider">
                    Drop-Off Location
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {rides.map((ride, index) => (
                  <tr
                    key={index}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {ride.pickupDate}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      Single Ride
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {ride.pickupAddress}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {ride.dropoffAddress}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center">
                        {ride.status === "completed" && (
                          <>
                            <CheckCircle
                              size={24}
                              className="text-green-500 mr-2"
                            />
                            <span className="text-green-600 font-medium">
                              Completed
                            </span>
                          </>
                        )}
                        {ride.status === "pending" && (
                          <>
                            <Clock size={24} className="text-yellow-500 mr-2" />
                            <span className="text-yellow-600 font-medium">
                              Pending
                            </span>
                          </>
                        )}
                        {ride.status === "canceled" && (
                          <>
                            <XCircle size={24} className="text-red-500 mr-2" />
                            <span className="text-red-600 font-medium">
                              Canceled
                            </span>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-6">
            {rides.map((ride, index) => (
              <div
                key={index}
                className="bg-white shadow-lg rounded-lg p-6 space-y-4 hover:bg-gray-50 transition"
              >
                <div className="flex justify-between items-center">
                  <div className="text-lg font-semibold text-gray-900">
                    {ride.pickupDate}
                  </div>
                  <div className="flex items-center">
                    {ride.status === "completed" && (
                      <>
                        <CheckCircle
                          size={24}
                          className="text-green-500 mr-2"
                        />
                        <span className="text-green-600 font-medium">
                          Completed
                        </span>
                      </>
                    )}
                    {ride.status === "pending" && (
                      <>
                        <Clock size={24} className="text-yellow-500 mr-2" />
                        <span className="text-yellow-600 font-medium">
                          Pending
                        </span>
                      </>
                    )}
                    {ride.status === "canceled" && (
                      <>
                        <XCircle size={24} className="text-red-500 mr-2" />
                        <span className="text-red-600 font-medium">
                          Canceled
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div className="text-sm">
                  <span className="font-semibold">Ride Type:</span> Single Ride
                </div>
                <div className="text-sm">
                  <span className="font-semibold">Pickup Location:</span>{" "}
                  {ride.pickupAddress}
                </div>
                <div className="text-sm">
                  <span className="font-semibold">Drop-Off Location:</span>{" "}
                  {ride.dropoffAddress}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
