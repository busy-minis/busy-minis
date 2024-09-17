// components/AvailableRidesFeed.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { acceptRide } from "@/utils/supabase/supabaseQueries";
import { MapPin } from "@phosphor-icons/react";
import RideCard from "./RideCard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dayjs from "dayjs";

interface Ride {
  id: string;
  pickupDate: string;
  pickupTime: string;
  pickupAddress: string;
  dropoffAddress: string;
  riders: Array<any>;
  distance: string; // Assuming distance is a string like "5 miles"
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

export default function AvailableRidesFeed({
  rides,
  user_id,
}: AvailableRidesFeedProps) {
  const [groupedRides, setGroupedRides] = useState<{ [key: string]: Ride[] }>(
    {}
  );
  const router = useRouter();

  useEffect(() => {
    // Sort rides by pickup date and time
    const sortedRides = [...rides].sort((a, b) => {
      const dateA = dayjs(`${a.pickupDate}T${a.pickupTime}`).toDate();
      const dateB = dayjs(`${b.pickupDate}T${b.pickupTime}`).toDate();
      return dateA.getTime() - dateB.getTime();
    });

    // Group rides by formatted date
    const grouped = groupRidesByDate(sortedRides);
    setGroupedRides(grouped);
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

  // Check if there are any rides
  const hasRides = rides && rides.length > 0;

  return (
    <div className="p-4 space-y-6 md:p-6">
      {!hasRides ? (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
          <MapPin size={48} className="text-gray-400 mb-4" />
          <p className="text-lg text-gray-700">
            No rides available at the moment.
          </p>
        </div>
      ) : (
        Object.keys(groupedRides).map((date) => (
          <div key={date} className="space-y-4">
            {/* Date Header */}
            <h2 className="text-2xl font-semibold text-teal-600 border-b pb-2">
              {date}
            </h2>

            {/* Rides for the Date */}
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
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
