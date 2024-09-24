// components/RideCard.tsx
"use client";

import React, { useState } from "react";
import { MapPin, Users, Clock, DotsThree } from "@phosphor-icons/react";
import dayjs from "dayjs";
import Modal from "./Modal";

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

interface RideCardProps {
  ride: Ride;
  handleAcceptRide: (rideId: string) => void;
}

const RideCard: React.FC<RideCardProps> = ({ ride, handleAcceptRide }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formattedDate = dayjs(`${ride.pickupDate}T${ride.pickupTime}`).format(
    "ddd, MMM D, YYYY"
  );
  const formattedTime = dayjs(`${ride.pickupDate}T${ride.pickupTime}`).format(
    "h:mm A"
  );

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const confirmAccept = () => {
    handleAcceptRide(ride.id);
    closeModal();
  };

  return (
    <>
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between">
        <div>
          {/* Date and Passengers */}
          <div className="flex justify-between items-center text-gray-600">
            <span className="text-sm font-medium">{formattedDate}</span>
            <span className="text-sm flex items-center">
              <Users size={16} className="mr-1" aria-hidden="true" />
              {ride.riders.length}{" "}
              {ride.riders.length > 1 ? "Passengers" : "Passenger"}
            </span>
          </div>

          {/* Ride Title */}
          <h3 className="mt-2 text-lg sm:text-xl font-semibold text-gray-900">
            Ride to {ride.dropoffAddress}
          </h3>

          {/* Ride Details */}
          <div className="mt-3 space-y-2">
            <div className="flex items-center text-gray-600">
              <MapPin
                size={20}
                className="text-teal-600 mr-2"
                aria-hidden="true"
              />
              <span className="font-light">Pickup: {ride.pickupAddress}</span>
            </div>

            <div className="flex items-center text-gray-600">
              <MapPin
                size={20}
                className="text-red-600 mr-2"
                aria-hidden="true"
              />
              <span className="font-light">Dropoff: {ride.dropoffAddress}</span>
            </div>

            <div className="flex items-center text-gray-600">
              <Clock
                size={20}
                className="text-blue-500 mr-2"
                aria-hidden="true"
              />
              <span className="font-light">{formattedTime}</span>
            </div>

            <div className="flex items-center text-gray-600">
              <DotsThree
                size={20}
                className="text-purple-500 mr-2"
                aria-hidden="true"
              />
              <span className="font-light">
                Distance: {ride.distance} miles
              </span>
            </div>
          </div>
        </div>

        {/* Accept Ride Button */}
        <button
          onClick={openModal}
          className="w-full mt-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 flex items-center justify-center"
        >
          Accept Ride
        </button>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Confirm Ride Acceptance"
        description={`Are you sure you want to accept this ride to ${ride.dropoffAddress}?`}
        onConfirm={confirmAccept}
      />
    </>
  );
};

export default RideCard;
