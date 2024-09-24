// components/RideInfo.tsx
"use client";

import { User } from "@phosphor-icons/react";
import React from "react";

// Define TypeScript interfaces for better type safety
interface Rider {
  name: string;
  age: number;
}

interface Ride {
  pickupAddress: string;
  dropoffAddress: string;
  pickupDate: string;
  pickupTime: string;
  riders: Rider[];
  distance: number; // Distance in miles
}

interface RideInfoProps {
  rideData: Ride;
}

// Utility function to format date and time
const formatDateTime = (date: string, time: string): string => {
  const dateTime = new Date(`${date}T${time}`);
  return dateTime.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const RideInfo: React.FC<RideInfoProps> = ({ rideData }) => {
  return (
    <div className="space-y-6">
      {/* Pickup and Dropoff Locations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Pickup Location */}
        <div className="bg-teal-50 p-5 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800">
            Pickup Location
          </h3>
          <p className="text-gray-700 mt-2">{rideData.pickupAddress}</p>
        </div>
        {/* Dropoff Location */}
        <div className="bg-teal-50 p-5 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800">
            Dropoff Location
          </h3>
          <p className="text-gray-700 mt-2">{rideData.dropoffAddress}</p>
        </div>
      </div>

      {/* Ride Time and Distance */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Ride Time */}
        <div className="bg-gray-50 p-5 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800">Ride Time</h3>
          <p className="text-gray-700 mt-2">
            {formatDateTime(rideData.pickupDate, rideData.pickupTime)}
          </p>
        </div>
        {/* Distance */}
        <div className="bg-gray-50 p-5 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800">Distance</h3>
          <p className="text-gray-700 mt-2">{rideData.distance} miles</p>
        </div>
      </div>

      {/* Passenger Information */}
      <div className="bg-gray-50 p-5 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Passengers</h3>
        <ul className="space-y-3">
          {rideData.riders.map((rider, index) => (
            <li key={index} className="flex items-center space-x-4">
              <User className="w-6 h-6 text-teal-600" aria-hidden="true" />
              <span className="text-gray-700">
                {rider.name}, Age: {rider.age}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RideInfo;
