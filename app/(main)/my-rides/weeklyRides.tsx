// WeeklyRides.tsx
"use client";
import { PencilSimple } from "@phosphor-icons/react";
import Link from "next/link";
import React from "react";
import { isAfter } from "date-fns";
import { Button } from "@/components/ui/button";

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
  renewal_date: string;
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
    const colors = [
      "bg-blue-100 text-blue-800",
      "bg-green-100 text-green-800",
      "bg-purple-100 text-purple-800",
      "bg-indigo-100 text-indigo-800",
      "bg-pink-100 text-pink-800",
      "bg-yellow-100 text-yellow-800",
      "bg-red-100 text-red-800",
    ];
    const dayIndex = new Date(day).getDay(); // 0 (Sun) to 6 (Sat)
    return colors[dayIndex % colors.length];
  };

  const formatTime = (time24: string) => {
    const [hours, minutes] = time24.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  return (
    <div className="w-full ">
      <header className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Weekly Rides</h2>
      </header>
      <section className="">
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
                  className="border bg-zinc-900 text-zinc-400 rounded-lg p-4   transition-shadow duration-300"
                >
                  <div className="">
                    <main className="flex justify-between">
                      <div className="text-base font-medium text-teal-200">
                        Renewal Date : {weeklyRide.renewal_date}
                      </div>
                      <p
                        className={`inline-block pointer-events-none px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                          weeklyRide.status
                        )}`}
                      >
                        {weeklyRide.status.charAt(0).toUpperCase() +
                          weeklyRide.status.slice(1)}
                      </p>
                    </main>

                    <section className="flex flex-col sm:flex-row sm:justify-between items-center mt-4  w-full ">
                      <div className="flex gap-1 w-fit">
                        {weeklyRide.selectedDays.map(
                          (day: string, index: number) => (
                            <span
                              key={index}
                              className={`text-zinc-100 px-3 py-1 w-full border border-zinc-700 p-1 rounded-xl text-xs  ${getDaysBadge(
                                day
                              )}`}
                            >
                              {day}
                            </span>
                          )
                        )}
                      </div>
                    </section>

                    <div className="mt-4">
                      <div className="flex flex-col sm:flex-row sm:space-x-8 text-xs">
                        <div className="mb-4 sm:mb-0">
                          <p className="text-sm border-b border-b-zinc-600 pb-1 font-semibold text-zinc-100">
                            Pickup Location
                          </p>
                          <p className=" mt-2">{weeklyRide.pickupAddress}</p>
                        </div>
                        <div>
                          <p className="text-sm  border-b border-b-zinc-600 pb-1 font-semibold text-zinc-100">
                            Drop-off Location
                          </p>
                          <p className="mt-2 ">{weeklyRide.dropoffAddress}</p>
                        </div>
                      </div>
                      <section className="flex mt-16 justify-between items-center">
                        <p className="text-sm  ">
                          <span className="font-semibold text-zinc-100 ">
                            Pickup Time:
                          </span>{" "}
                          {formatTime(weeklyRide.pickupTime)}
                        </p>
                        <Link
                          href={`/my-rides/weekly-ride/manage?id=${weeklyRide.id}`}
                        >
                          <Button className="flex items-center text-sm font-medium bg-teal-100 text-teal-600 hover:bg-teal-200 px-4 py-2 rounded-md transition-colors duration-200">
                            <PencilSimple
                              size={20}
                              className="mr-1"
                              aria-hidden="true"
                            />
                            <span>Manage</span>
                          </Button>
                        </Link>
                      </section>

                      {isRideDiscontinued && (
                        <p className="text-sm text-yellow-600 mt-2">
                          Ride discontinued. Payment required to continue.
                        </p>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="text-center">
            <p className="text-gray-600">No weekly rides booked.</p>
            <Link href={"/schedule-ride/weekly-ride"}>
              <div className="mt-4 inline-block bg-teal-600 text-white px-5 py-2 rounded-md hover:bg-teal-700 transition-colors duration-200">
                Book a Weekly Ride
              </div>
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
