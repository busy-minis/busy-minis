import { Car } from "@phosphor-icons/react";
import React from "react";

export default function Driver({ rideData }: any) {
  return (
    <div className="flex items-center space-x-4">
      <Car size={24} className="text-teal-600" />
      <div>
        <p className="text-gray-700">Driver:</p>
        {rideData.driverName ? (
          <>
            <p className="text-lg font-semibold text-gray-900">
              {rideData.driverName}
            </p>
            <p className="text-gray-600">
              Vehicle: {rideData.driverVehicle || "Not Available"}
            </p>
          </>
        ) : (
          <p className="text-gray-900">
            Driver not yet available. Please wait until a driver has accepted
            the ride.
          </p>
        )}
      </div>
    </div>
  );
}
