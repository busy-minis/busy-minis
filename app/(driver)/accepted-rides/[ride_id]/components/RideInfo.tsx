import { User } from "@phosphor-icons/react";
import React from "react";

const formatDateTime = (date: string, time: string) => {
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

export default function RideInfo({ rideData }: any) {
  return (
    <div>
      {/* Pickup and Dropoff Locations */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-teal-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800">
            Pickup Location
          </h3>
          <p className="text-gray-700 mt-2">{rideData.pickupAddress}</p>
        </div>
        <div className="bg-teal-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800">
            Dropoff Location
          </h3>
          <p className="text-gray-700 mt-2">{rideData.dropoffAddress}</p>
        </div>
      </div>

      {/* Ride Time */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800">Ride Time</h3>
        <p className="text-gray-700 mt-2">
          {formatDateTime(rideData.pickupDate, rideData.pickupTime)}
        </p>
      </div>

      {/* Passenger Information */}
      <div className="bg-gray-50 p-4 rounded-lg space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Passengers</h3>
        {rideData.riders.map((rider: any, index: any) => (
          <div key={index} className="flex items-center space-x-4">
            <User className="w-8 h-8 text-teal-600" />
            <p className="text-gray-700">
              {rider.name}, Age: {rider.age}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
