"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { User } from "@phosphor-icons/react/dist/ssr";

interface Passenger {
  name: string;
  age: number;
}

interface Ride {
  id: string;
  pickup_address: string;
  dropoff_address: string;
  pickup_time: string;
  passengers: Passenger[];
  special_instructions?: string;
  ride_duration: string;
}

const rideData: Ride = {
  id: "1",
  pickup_address: "123 Main St, Springfield",
  dropoff_address: "456 Oak Ave, Shelbyville",
  pickup_time: "2024-08-25T14:00:00Z",
  passengers: [
    { name: "John Doe", age: 30 },
    { name: "Jane Doe", age: 28 },
  ],
  special_instructions:
    "Handle with care, passengers are carrying fragile items.",
  ride_duration: "30 minutes",
};

export default function RidePage() {
  const router = useRouter();

  const endRide = () => {
    console.log("Ride ended.");
    router.push("/my-rides");
  };

  const shareLocation = () => {
    console.log("Sharing location with the user...");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg space-y-6">
        <h2 className="text-3xl font-extrabold text-gray-900">Ride Details</h2>

        {/* Ride ID */}
        <div className="bg-teal-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-teal-900">
            Ride ID: <span className="text-teal-800">{rideData.id}</span>
          </h3>
        </div>

        {/* Pickup and Dropoff Information */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-teal-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800">
              Pickup Location
            </h3>
            <p className="text-gray-700 mt-2">{rideData.pickup_address}</p>
          </div>
          <div className="bg-teal-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800">
              Dropoff Location
            </h3>
            <p className="text-gray-700 mt-2">{rideData.dropoff_address}</p>
          </div>
        </div>

        {/* Ride Time and Duration */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800">Ride Time</h3>
          <p className="text-gray-700 mt-2">
            {new Date(rideData.pickup_time).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            - Estimated Duration: {rideData.ride_duration}
          </p>
        </div>

        {/* Passenger Information */}
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Passengers</h3>
          {rideData.passengers.map((passenger, index) => (
            <div key={index} className="flex items-center space-x-4">
              <User className="w-8 h-8 text-teal-600" />
              <p className="text-gray-700">
                {passenger.name}, Age: {passenger.age}
              </p>
            </div>
          ))}
        </div>

        {/* Special Instructions */}
        {rideData.special_instructions && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800">
              Special Instructions
            </h3>
            <p className="text-gray-700 mt-2 italic">
              {rideData.special_instructions}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between items-center space-x-4">
          <button
            onClick={shareLocation}
            className="w-full bg-teal-600 text-white py-3 px-4 rounded-md hover:bg-teal-700 transition-colors duration-200"
          >
            Share Location
          </button>
          <button
            onClick={endRide}
            className="w-full bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 transition-colors duration-200"
          >
            End Ride
          </button>
        </div>
      </div>
    </div>
  );
}
