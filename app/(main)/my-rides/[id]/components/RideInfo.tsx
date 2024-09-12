import { MapPin } from "@phosphor-icons/react";
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
      <div className="flex items-center space-x-4">
        <MapPin size={24} className="text-teal-600" />
        <div>
          <p className="text-gray-700">Pickup:</p>
          <p className="text-lg font-semibold text-gray-900">
            {rideData.pickupAddress}
          </p>
          <p className="text-gray-600">
            Pickup Time:{" "}
            {formatDateTime(rideData.pickupDate, rideData.pickupTime)}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <MapPin size={24} className="text-teal-600" />
        <div>
          <p className="text-gray-700">Dropoff:</p>
          <p className="text-lg font-semibold text-gray-900">
            {rideData.dropoffAddress}
          </p>
          <p className="text-gray-600">
            Estimated Dropoff Time: {rideData.dropoffTime}
          </p>
        </div>
      </div>
    </div>
  );
}
