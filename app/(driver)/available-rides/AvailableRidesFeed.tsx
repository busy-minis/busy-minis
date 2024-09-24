// components/AvailableRidesFeed.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { acceptRide } from "@/utils/supabase/supabaseQueries";
import { MapPin, SpinnerGap } from "@phosphor-icons/react";
import RideCard from "./RideCard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dayjs from "dayjs";

// Define TypeScript interfaces for better type safety
interface Rider {
  id: string;
  name: string;
  age: number;
}

interface Ride {
  id: string;
  pickupDate: string; // Format: YYYY-MM-DD
  pickupTime: string; // Format: HH:mm
  pickupAddress: string;
  dropoffAddress: string;
  riders: Rider[];
  distance: number; // Distance in miles
}

interface AvailableRidesFeedProps {
  rides: Ride[];
  user_id: string;
}

// Utility function to group rides by formatted date
const groupRidesByDate = (rides: Ride[]) => {
  return rides.reduce((groups: { [key: string]: Ride[] }, ride) => {
    const formattedDate = dayjs(`${ride.pickupDate}T${ride.pickupTime}`).format(
      "dddd, MMMM D, YYYY"
    );
    if (!groups[formattedDate]) {
      groups[formattedDate] = [];
    }
    groups[formattedDate].push(ride);
    return groups;
  }, {});
};

// Utility function to filter out past rides
const filterUpcomingRides = (rides: Ride[]) => {
  const now = dayjs();
  return rides.filter((ride) => {
    const rideDateTime = dayjs(`${ride.pickupDate}T${ride.pickupTime}`);
    return rideDateTime.isAfter(now);
  });
};

export default function AvailableRidesFeed({
  rides,
  user_id,
}: AvailableRidesFeedProps) {
  const [groupedRides, setGroupedRides] = useState<{ [key: string]: Ride[] }>(
    {}
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const processRides = () => {
      // Filter out past rides
      const upcomingRides = filterUpcomingRides(rides);

      // Sort rides by pickup date and time
      const sortedRides = [...upcomingRides].sort((a, b) => {
        const dateA = dayjs(`${a.pickupDate}T${a.pickupTime}`).toDate();
        const dateB = dayjs(`${b.pickupDate}T${b.pickupTime}`).toDate();
        return dateA.getTime() - dateB.getTime();
      });

      // Group rides by formatted date
      const grouped = groupRidesByDate(sortedRides);
      setGroupedRides(grouped);
      setIsLoading(false);
    };

    processRides();
  }, [rides]);

  const handleAcceptRide = async (rideId: string) => {
    try {
      await acceptRide(rideId, user_id);
      toast.success("Ride accepted successfully!");
      router.push("/accepted-rides");
    } catch (error) {
      console.error("Failed to accept ride:", error);
      toast.error("Failed to accept ride. Please try again.");
    }
  };

  // Check if there are any upcoming rides
  const hasRides = rides && filterUpcomingRides(rides).length > 0;

  return (
    <div className="px-2 sm:px-4 space-y-6">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center bg-gray-100 p-4">
          <SpinnerGap
            size={48}
            className="animate-spin text-teal-600 mb-4"
            aria-hidden="true"
          />
          <p className="text-lg text-gray-700">Loading available rides...</p>
        </div>
      ) : !hasRides ? (
        <div className="flex flex-col items-center justify-center bg-gray-100 p-4">
          <MapPin size={48} className="text-gray-400 mb-4" />
          <p className="text-lg text-gray-700">
            No upcoming rides available at the moment.
          </p>
          {/* Optional: Link to request a ride or refresh */}
          <button
            onClick={() => router.refresh()}
            className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            Refresh
          </button>
        </div>
      ) : (
        Object.keys(groupedRides).map((date) => (
          <div key={date} className="space-y-4">
            {/* Date Header */}
            <h2 className="text-2xl font-semibold text-teal-600 border-b pb-2">
              {date}
            </h2>

            {/* Rides for the Date */}
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {groupedRides[date].map((ride) => (
                <RideCard
                  key={ride.id}
                  ride={ride}
                  handleAcceptRide={handleAcceptRide}
                />
              ))}
            </div>
          </div>
        ))
      )}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
}
