"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { acceptRide } from "@/utils/supabase/supabaseQueries";
import { MapPin, Users, Clock } from "@phosphor-icons/react";
import Link from "next/link";

export default function AvailableRidesFeed({ rides, user_id }: any) {
  const [selectedRide, setSelectedRide] = useState<any | null>(null);
  const router = useRouter();

  const handleAcceptRide = async (rideId: string) => {
    try {
      await acceptRide(rideId, user_id);
      router.push("/accepted-rides");
    } catch (error) {
      console.error("Failed to accept ride:", error);
    }
  };

  if (!rides || rides.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <p className="text-lg text-gray-700">
          No rides available at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 md:p-6">
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {rides.map((ride: any) => (
          <RideCard
            key={ride.id}
            ride={ride}
            handleAcceptRide={handleAcceptRide}
          />
        ))}
      </div>
    </div>
  );
}

// Ride card component with a professional, flat design
const RideCard = ({
  ride,
  handleAcceptRide,
}: {
  ride: any;
  handleAcceptRide: (rideId: string) => void;
}) => (
  <div className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
    <div className="flex justify-between items-center text-gray-600">
      <span className="text-sm">
        {new Date(ride.pickupDate + "T" + ride.pickupTime).toLocaleDateString(
          [],
          { weekday: "short", month: "short", day: "numeric" }
        )}
      </span>
      <span className="text-sm">
        {ride.riders.length}{" "}
        {ride.riders.length > 1 ? "Passengers" : "Passenger"}
      </span>
    </div>

    <h3 className="mt-4 text-lg font-semibold text-gray-900">
      Ride to {ride.dropoffAddress}
    </h3>

    <div className="mt-4 space-y-2">
      <div className="flex items-center text-gray-600">
        <MapPin size={20} className="text-teal-600 mr-2" />
        <span className="font-light">Pickup: {ride.pickupAddress}</span>
      </div>

      <div className="flex items-center text-gray-600">
        <MapPin size={20} className="text-red-600 mr-2" />
        <span className="font-light">Dropoff: {ride.dropoffAddress}</span>
      </div>

      <div className="flex items-center text-gray-600">
        <Clock size={20} className="text-blue-500 mr-2" />
        <span className="font-light">
          {new Date(ride.pickupDate + "T" + ride.pickupTime).toLocaleTimeString(
            [],
            { hour: "2-digit", minute: "2-digit" }
          )}
        </span>
      </div>
    </div>

    {/* Accept Ride Button */}
    <button
      onClick={() => handleAcceptRide(ride.id)}
      className="w-full mt-5 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
    >
      Accept Ride
    </button>
  </div>
);
