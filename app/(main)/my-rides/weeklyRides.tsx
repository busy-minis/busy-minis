"use client";
import { PencilIcon, MapPin, Clock, CalendarDays } from "lucide-react";
import Link from "next/link";
import React from "react";
import { isAfter, format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

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

  const getDaysBadge = (day: string) => {
    return "bg-gray-100 text-gray-800";
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

  const formatRenewalDate = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, "MMMM d, yyyy");
  };

  return (
    <div className="w-full">
      <section className="space-y-4">
        {weekly_rides.length > 0 ? (
          <ul className="space-y-4">
            {weekly_rides.map((weeklyRide, index) => {
              const rideEndDate = weeklyRide.end_date || null;
              const isRideDiscontinued = rideEndDate
                ? isAfter(currentDate, new Date(rideEndDate))
                : false;

              return (
                <motion.li
                  key={weeklyRide.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow duration-300"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
                    <div>
                      <p className="text-base sm:text-lg font-semibold text-gray-800 flex items-center">
                        <CalendarDays className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                        <span className="text-sm sm:text-base">
                          Renewal: {formatRenewalDate(weeklyRide.renewal_date)}
                        </span>
                      </p>
                      <p
                        className={`mt-2 inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                          weeklyRide.status
                        )}`}
                      >
                        {weeklyRide.status.charAt(0).toUpperCase() +
                          weeklyRide.status.slice(1)}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2 sm:mt-0">
                      {weeklyRide.selectedDays.map(
                        (day: string, index: number) => (
                          <span
                            key={index}
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getDaysBadge(
                              day
                            )}`}
                          >
                            {day.slice(0, 3)}
                          </span>
                        )
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-700">
                      <MapPin className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm">Pickup</p>
                        <p className="text-sm">{weeklyRide.pickupAddress}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <MapPin className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm">Drop-off</p>
                        <p className="text-sm">{weeklyRide.dropoffAddress}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <p className="text-gray-700 flex items-center text-sm mb-2 sm:mb-0">
                      <Clock className="mr-2 h-4 w-4 text-gray-500" />
                      <span className="font-medium">Pickup Time:</span>{" "}
                      {formatTime(weeklyRide.pickupTime)}
                    </p>
                    <Link
                      href={`/my-rides/weekly-ride/manage?id=${weeklyRide.id}`}
                    >
                      <Button variant="outline" size="sm">
                        <PencilIcon className="mr-2 h-4 w-4" />
                        Manage
                      </Button>
                    </Link>
                  </div>

                  {isRideDiscontinued && (
                    <p className="mt-4 text-red-600 bg-red-50 p-2 rounded-md text-sm">
                      Ride discontinued. Payment required to continue.
                    </p>
                  )}
                </motion.li>
              );
            })}
          </ul>
        ) : (
          <div className="text-center py-8 bg-white rounded-lg shadow-sm">
            <p className="text-gray-600 mb-4">No weekly rides booked.</p>
            <Link href="/schedule-ride/weekly-ride">
              <Button className="bg-black text-white hover:bg-gray-800">
                Book a Weekly Ride
              </Button>
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
