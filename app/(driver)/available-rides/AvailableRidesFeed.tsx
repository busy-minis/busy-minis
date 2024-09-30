"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { acceptRide } from "@/utils/supabase/supabaseQueries";
import { MapPin, SpinnerGap, Calendar, Recycle } from "@phosphor-icons/react";
import RideCard from "./RideCard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dayjs from "dayjs";

interface Rider {
  id: string;
  name: string;
  age: number;
}

interface Ride {
  id: string;
  pickupDate: string;
  pickupTime: string;
  pickupAddress: string;
  dropoffAddress: string;
  riders: Rider[];
  distance: number;
}

interface AvailableRidesFeedProps {
  rides: Ride[];
  user_id: string;
}

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
    processRides();
  }, [rides]);

  const processRides = () => {
    const upcomingRides = filterUpcomingRides(rides);
    const sortedRides = [...upcomingRides].sort((a, b) => {
      const dateA = dayjs(`${a.pickupDate}T${a.pickupTime}`).toDate();
      const dateB = dayjs(`${b.pickupDate}T${b.pickupTime}`).toDate();
      return dateA.getTime() - dateB.getTime();
    });
    const grouped = groupRidesByDate(sortedRides);
    setGroupedRides(grouped);
    setIsLoading(false);
  };

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

  const hasRides = rides && filterUpcomingRides(rides).length > 0;

  return (
    <div className="space-y-8">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center bg-white rounded-lg shadow-md p-8">
          <SpinnerGap
            size={48}
            className="animate-spin text-teal-600 mb-4"
            aria-hidden="true"
          />
          <p className="text-lg text-gray-700">Loading available rides...</p>
        </div>
      ) : !hasRides ? (
        <div className="flex flex-col items-center justify-center bg-white rounded-lg shadow-md p-8">
          <MapPin size={48} className="text-gray-400 mb-4" />
          <p className="text-lg text-gray-700 mb-4">
            No upcoming rides available at the moment.
          </p>
          <button
            onClick={() => {
              setIsLoading(true);
              router.refresh();
              setTimeout(() => processRides(), 1000);
            }}
            className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 flex items-center"
          >
            <Recycle size={20} className="mr-2" />
            Refresh
          </button>
        </div>
      ) : (
        Object.keys(groupedRides).map((date) => (
          <div key={date} className="space-y-4">
            <h2 className="text-2xl font-semibold text-teal-600 border-b pb-2 flex items-center">
              <Calendar size={24} className="mr-2" />
              {date}
            </h2>
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
