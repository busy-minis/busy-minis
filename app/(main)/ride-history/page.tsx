"use client";
import React from "react";
import Footer from "@/app/components/ui/Footer";
import { CheckCircle, Clock, XCircle } from "@phosphor-icons/react";

export default function RideHistory() {
  const rideHistory = [
    {
      date: "August 20, 2024",
      rideType: "Single Ride",
      pickup: "123 Main St, Springfield",
      dropOff: "456 Elm St, Springfield",
      status: "Completed",
    },
    {
      date: "August 18, 2024",
      rideType: "Weekly Ride",
      pickup: "789 Maple St, Springfield",
      dropOff: "101 Oak St, Springfield",
      status: "Completed",
    },
    {
      date: "August 16, 2024",
      rideType: "Single Ride",
      pickup: "321 Birch St, Springfield",
      dropOff: "654 Pine St, Springfield",
      status: "Canceled",
    },
    {
      date: "August 14, 2024",
      rideType: "Weekly Ride",
      pickup: "111 Cedar St, Springfield",
      dropOff: "222 Walnut St, Springfield",
      status: "Pending",
    },
  ];

  return (
    <div className="relative ">
      {/* Background Decorations */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-teal-200 to-white opacity-80"></div>
        <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-t from-orange-100 to-white opacity-80"></div>
      </div>

      <section className="relative pt-24  pb-16 lg:pb-32">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="font-semibold text-xl text-teal-600 mb-2 block">
              Ride History
            </span>
            <h2 className="font-bold text-4xl sm:text-5xl text-gray-900 mb-6">
              Your Previous Rides
            </h2>
            <p className="text-lg max-w-2xl mx-auto text-gray-600">
              Review your past rides with Busy Minis. Keep track of completed,
              pending, and canceled rides with detailed information for each
              trip.
            </p>
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block bg-white shadow-lg rounded-lg overflow-hidden">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 bg-teal-600 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-5 py-3 bg-teal-600 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Ride Type
                  </th>
                  <th className="px-5 py-3 bg-teal-600 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Pickup Location
                  </th>
                  <th className="px-5 py-3 bg-teal-600 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Drop-Off Location
                  </th>
                  <th className="px-5 py-3 bg-teal-600 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {rideHistory.map((ride, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-5 py-5 text-sm">{ride.date}</td>
                    <td className="px-5 py-5 text-sm">{ride.rideType}</td>
                    <td className="px-5 py-5 text-sm">{ride.pickup}</td>
                    <td className="px-5 py-5 text-sm">{ride.dropOff}</td>
                    <td className="px-5 py-5 text-sm">
                      <div className="flex items-center">
                        {ride.status === "Completed" && (
                          <>
                            <CheckCircle
                              size={24}
                              className="text-green-500 mr-2"
                            />
                            <span className="text-green-500">Completed</span>
                          </>
                        )}
                        {ride.status === "Pending" && (
                          <>
                            <Clock size={24} className="text-yellow-500 mr-2" />
                            <span className="text-yellow-500">Pending</span>
                          </>
                        )}
                        {ride.status === "Canceled" && (
                          <>
                            <XCircle size={24} className="text-red-500 mr-2" />
                            <span className="text-red-500">Canceled</span>
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
            {rideHistory.map((ride, index) => (
              <div
                key={index}
                className="bg-white shadow-lg rounded-lg p-6 space-y-4"
              >
                <div className="text-lg font-semibold">{ride.date}</div>
                <div className="text-sm">
                  <span className="font-semibold">Ride Type:</span>{" "}
                  {ride.rideType}
                </div>
                <div className="text-sm">
                  <span className="font-semibold">Pickup Location:</span>{" "}
                  {ride.pickup}
                </div>
                <div className="text-sm">
                  <span className="font-semibold">Drop-Off Location:</span>{" "}
                  {ride.dropOff}
                </div>
                <div className="flex items-center text-sm">
                  {ride.status === "Completed" && (
                    <>
                      <CheckCircle size={24} className="text-green-500 mr-2" />
                      <span className="text-green-500">Completed</span>
                    </>
                  )}
                  {ride.status === "Pending" && (
                    <>
                      <Clock size={24} className="text-yellow-500 mr-2" />
                      <span className="text-yellow-500">Pending</span>
                    </>
                  )}
                  {ride.status === "Canceled" && (
                    <>
                      <XCircle size={24} className="text-red-500 mr-2" />
                      <span className="text-red-500">Canceled</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
