// SingleRides.tsx
"use client";
import React, { useState } from "react";
import { Trash, Eye } from "@phosphor-icons/react";
import Link from "next/link";
import {
  cancelRideById,
  getRidesForUser,
} from "@/utils/supabase/supabaseQueries";
import ConfirmationModal from "./Modal";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface SingleRidesProps {
  initialRides: any[];
  user_id: string;
}

export default function SingleRides({
  initialRides,
  user_id,
}: SingleRidesProps) {
  const [rides, setRides] = useState(initialRides);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rideToCancel, setRideToCancel] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCancel = async (id: string) => {
    setIsLoading(true);
    try {
      await cancelRideById(id);
      const updatedRides = await getRidesForUser(user_id);
      setRides(updatedRides);
      setIsModalOpen(false);
      alert("Ride successfully cancelled.");
    } catch (error) {
      console.error("Failed to cancel the ride:", error);
      alert("Failed to cancel the ride. Please try again.");
    } finally {
      setIsLoading(false);
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
    const [year, month, day] = dateString.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      month: "short",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
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

  // Function to determine badge color based on status
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="w-full">
      <header className="mb-6 ">
        <h2 className="text-2xl font-semibold text-gray-800">Single Rides</h2>
      </header>
      <section className="">
        {rides.length > 0 ? (
          <ul className="space-y-6">
            {rides.map((ride: any) => (
              <li
                key={ride.id}
                className="border bg-zinc-900 border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start  hover:shadow-md transition-shadow duration-300"
              >
                <div className="border mr-4 border-zinc-700 p-2 bg-zinc-950 rounded-xl">
                  <Image
                    src={"/car.png"}
                    alt="car"
                    width={50}
                    height={50}
                    className="  "
                  />
                </div>

                <div className="mb-4 sm:mb-0 flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                    <p className="text-lg font-medium text-zinc-50">
                      {formatDate(ride.pickupDate)} at{" "}
                      {formatTime(ride.pickupTime)}
                    </p>
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                        ride.status
                      )}`}
                    >
                      {ride.status.charAt(0).toUpperCase() +
                        ride.status.slice(1)}
                    </span>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-zinc-300">
                      <span className="font-semibold">From:</span>{" "}
                      {ride.pickupAddress}
                    </p>
                    <p className="text-sm text-zinc-300">
                      <span className="font-semibold">To:</span>{" "}
                      {ride.dropoffAddress}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <Link href={`/my-rides/session/${ride.id}`}>
                    <div className="flex items-center text-sm font-medium text-teal-600 hover:text-teal-800 transition-colors duration-200">
                      <Eye size={20} className="mr-1" aria-hidden="true" />
                      <span>View</span>
                    </div>
                  </Link>
                  <button
                    onClick={() => openModal(ride.id)}
                    className="flex items-center text-sm font-medium text-red-600 hover:text-red-800 transition-colors duration-200"
                  >
                    <Trash size={20} className="mr-1" aria-hidden="true" />
                    <span>Cancel</span>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center">
            <p className="text-gray-600">No single rides booked.</p>
            <Link href={"/schedule-ride/single-ride"}>
              <Button className="mt-4 inline-block bg-teal-600 text-white px-5 py-2 rounded-md hover:bg-teal-700 transition-colors duration-200">
                Book a Single Ride
              </Button>
            </Link>
          </div>
        )}

        <ConfirmationModal
          isOpen={isModalOpen}
          onConfirm={() => rideToCancel && handleCancel(rideToCancel)}
          onCancel={closeModal}
          isLoading={isLoading}
        />
      </section>
    </div>
  );
}
