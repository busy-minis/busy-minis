"use client";
import React, { useState } from "react";
import { Trash, Eye } from "@phosphor-icons/react";
import Link from "next/link";
import {
  cancelRideById,
  getRidesForUser,
} from "@/utils/supabase/supabaseQueries";
import ConfirmationModal from "./Modal";

export default function SingleRides({
  initialRides,
  user_id,
}: {
  initialRides: any;
  user_id: any;
}) {
  const [rides, setRides] = useState(initialRides);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rideToCancel, setRideToCancel] = useState<string | null>(null);

  const handleCancel = async (id: string) => {
    try {
      await cancelRideById(id); // Call the cancel function
      const updatedRides = await getRidesForUser(user_id); // Re-fetch the updated rides
      setRides(updatedRides); // Update the state with the new rides data
      setIsModalOpen(false); // Close the modal after successful cancellation
    } catch (error) {
      console.error("Failed to cancel the ride:", error);
    }
  };

  const openModal = (id: string) => {
    setRideToCancel(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setRideToCancel(null);
    setIsModalOpen(false);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", options).format(date);
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  return (
    <div>
      <h3 className="font-semibold text-2xl text-teal-700 mb-6">
        Single Rides
      </h3>
      {rides.length > 0 ? (
        rides.map((ride: any) => (
          <div
            key={ride.id}
            className="p-6 mb-6 bg-white shadow-md rounded-lg flex justify-between items-center"
          >
            <div>
              <h4 className="font-bold text-lg text-gray-900">
                {formatDate(ride.pickupDate)} - {formatTime(ride.pickupTime)}
              </h4>
              <p className="text-gray-600 max-w-sm">
                Pickup: {ride.pickupAddress} <br /> <br />
                Drop-off: {ride.dropoffAddress}
              </p>
              <div
                className={`mt-2 font-semibold text-${
                  ride.status === "pending" ? "teal-600" : "gray-500"
                }`}
              >
                Status: {ride.status}
              </div>
              {ride.status === "pending" && (
                <p className="text-red-500">Waiting for driver confirmation</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Link href={`/my-rides/${ride.id}`}>
                <button className="flex items-center bg-theme-orange text-white px-4 py-2 rounded-full hover:bg-red-600 transition duration-300">
                  <Eye size={20} className="mr-2" />
                  View Ride
                </button>
              </Link>
              <button
                className="flex items-center bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition duration-300"
                onClick={() => openModal(ride.id)}
              >
                <Trash size={20} className="mr-2" />
                Cancel
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>No single rides booked.</p>
      )}

      {/* Modal for confirming cancellation */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onConfirm={() => rideToCancel && handleCancel(rideToCancel)}
        onCancel={closeModal}
      />
    </div>
  );
}
