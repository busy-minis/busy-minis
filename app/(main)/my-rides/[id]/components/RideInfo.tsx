import { MapPin, MapTrifold } from "@phosphor-icons/react";
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
    <div className="space-y-6">
      <div className="flex items-start space-x-4">
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

      <div className="flex items-start space-x-4">
        <MapPin size={24} className="text-teal-600" />
        <div>
          <p className="text-gray-700">Dropoff:</p>
          <p className="text-lg font-semibold text-gray-900">
            {rideData.dropoffAddress}
          </p>
        </div>
      </div>

      <div className="flex items-start space-x-4">
        <MapTrifold size={24} className="text-teal-600" />
        <div>
          <p className="text-gray-700">Distance:</p>
          <p className="text-lg font-semibold text-gray-900">
            {rideData.distance} miles
          </p>
        </div>
      </div>
    </div>
  );
}
