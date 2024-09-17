// WeeklyRides.tsx
"use client";
import { PencilSimple } from "@phosphor-icons/react";
import Link from "next/link";
import React from "react";
import { isAfter } from "date-fns";

interface WeeklyRide {
  id: string;
  start_date: string;
  end_date?: string;
  total_price: number;
  user_id: string;
  status: string;
  pickupAddress: string;
  dropoffAddress: string;
  pickupTime: string;
  riders: any;
  selectedDays: string[];
}

interface WeeklyRidesProps {
  user_id: string;
  weekly_rides: WeeklyRide[];
}

export default function WeeklyRides({
  user_id,
  weekly_rides,
}: WeeklyRidesProps) {
  const currentDate = new Date();

  // Function to determine badge color based on status
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Function to determine days badge color (optional)
  const getDaysBadge = (day: string) => {
    // Assign colors based on day or any logic
    // Here, we'll alternate colors for demonstration
    const colors = [
      "bg-blue-100 text-blue-800",
      "bg-green-100 text-green-800",
      "bg-purple-100 text-purple-800",
      "bg-indigo-100 text-indigo-800",
      "bg-pink-100 text-pink-800",
      "bg-yellow-100 text-yellow-800",
      "bg-red-100 text-red-800",
    ];
    const index = new Date(day).getDay(); // 0 (Sun) to 6 (Sat)
    return colors[index % colors.length];
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="font-semibold text-2xl text-gray-800 mb-6">
        Weekly Rides
      </h3>
      {weekly_rides.length > 0 ? (
        <ul className="space-y-6">
          {weekly_rides.map((weeklyRide) => {
            const rideEndDate = weeklyRide.end_date || null;
            const isRideDiscontinued = rideEndDate
              ? isAfter(currentDate, new Date(rideEndDate))
              : false;

            return (
              <li
                key={weeklyRide.id}
                className="border border-gray-200 rounded-lg p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center hover:shadow-md transition-shadow duration-300"
              >
                <div className="mb-4 sm:mb-0 w-full sm:w-2/3">
                  {/* Pickup Location */}
                  <div className="mb-2">
                    <p className="text-lg font-medium text-gray-900 bg-blue-100 text-blue-800 px-3 py-1 rounded">
                      Pickup Location
                    </p>
                    <p className="text-sm text-gray-600">
                      {weeklyRide.pickupAddress}
                    </p>
                  </div>

                  {/* Drop-off Location */}
                  <div className="mb-4">
                    <p className="text-lg font-medium text-gray-900 bg-red-100 text-red-800 px-3 py-1 rounded">
                      Drop-off Location
                    </p>
                    <p className="text-sm text-gray-600">
                      {weeklyRide.dropoffAddress}
                    </p>
                  </div>

                  {/* Ride Details */}
                  <div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                          weeklyRide.status
                        )}`}
                      >
                        {weeklyRide.status.charAt(0).toUpperCase() +
                          weeklyRide.status.slice(1)}
                      </span>
                      {weeklyRide.selectedDays.map(
                        (day: string, index: number) => (
                          <span
                            key={index}
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getDaysBadge(
                              day
                            )}`}
                          >
                            {day}
                          </span>
                        )
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Pickup Time:</span>{" "}
                      {formatTime(weeklyRide.pickupTime)}
                    </p>
                    {isRideDiscontinued && (
                      <p className="text-sm text-yellow-600 mt-2">
                        Ride discontinued. Payment required to continue.
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex space-x-4 w-full sm:w-auto">
                  <Link
                    href={`/my-rides/weekly-ride/manage?id=${weeklyRide.id}`}
                  >
                    <button className="flex items-center text-sm font-medium bg-teal-100 text-teal-600 hover:bg-teal-200 px-4 py-2 rounded-md transition-colors duration-200">
                      <PencilSimple size={20} className="mr-1" />
                      Manage
                    </button>
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="text-center">
          <p className="text-gray-600">No weekly rides booked.</p>
          <Link href={"/schedule-ride/weekly-ride"}>
            <button className="mt-4 bg-teal-600 text-white px-5 py-2 rounded-md hover:bg-teal-700 transition-colors duration-200">
              Book a Weekly Ride
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}

function formatTime(time24: string) {
  const [hours, minutes] = time24.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
}
