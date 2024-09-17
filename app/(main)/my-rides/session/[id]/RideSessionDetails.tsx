// RideSessionDetails.tsx
"use client";

import React, { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { createClient } from "@/utils/supabase/client";

import { useRouter } from "next/navigation";
import {
  CheckCircle,
  Clock,
  Hourglass,
  MapPin,
  XCircle,
  UserCheck,
} from "@phosphor-icons/react";

interface Driver {
  id: string;
  first_name: string;
  last_name: string;
  photo_url: string;
  license_plate: string;
  vehicle_brand: string;
  vehicle_year: string;
  vehicle_color: string;
  email: string;
  phone_number: string;
  driver: boolean;
  // Add other driver fields if necessary
}

interface RideSessionDetailsProps {
  rideSession: any;
  userId: string;
  driver?: Driver | null; // Make driver optional
}

export default function RideSessionDetails({
  rideSession,
  userId,
  driver,
}: RideSessionDetailsProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(rideSession.status);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [currentDriver, setCurrentDriver] = useState(driver || null);

  const router = useRouter();
  const supabase = createClient();

  // Optional: Implement polling or real-time updates to refresh status
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const { data, error } = await supabase
          .from("ride_sessions")
          .select("status, driver_id")
          .eq("id", rideSession.id)
          .single();

        if (error) {
          console.error("Error fetching ride status:", error);
          return;
        }

        if (data.status !== status) {
          setStatus(data.status);
          // If status changed to 'accepted', fetch driver info
          if (data.status === "accepted" && data.driver_id) {
            const { data: updatedDriver, error: driverError } = await supabase
              .from("drivers")
              .select("*")
              .eq("id", data.driver_id)
              .single();

            if (driverError) {
              console.error("Error fetching updated driver info:", driverError);
            } else {
              setCurrentDriver(updatedDriver);
            }
          }
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [supabase, rideSession.id, status]);

  const handleCancelRide = async () => {
    setIsSubmitting(true);

    try {
      // Update the ride_session status to 'cancelled'
      const { error } = await supabase
        .from("ride_sessions")
        .update({ status: "cancelled" })
        .eq("id", rideSession.id);

      if (error) throw error;

      setStatus("cancelled");
      setShowCancelModal(false);
      alert("Your ride has been cancelled.");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("An error occurred while cancelling your ride.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Map the status to display text and icon
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "completed":
        return {
          text: "Completed",
          icon: <CheckCircle size={24} className="text-green-500 mr-2" />,
          color: "text-green-600",
          description: "Your ride has been completed successfully.",
        };
      case "ongoing":
        return {
          text: "Ongoing",
          icon: <MapPin size={24} className="text-blue-500 mr-2" />,
          color: "text-blue-600",
          description: "Your ride is currently in progress.",
        };
      case "available":
        return {
          text: "Pending",
          icon: <Hourglass size={24} className="text-orange-500 mr-2" />,
          color: "text-orange-600",
          description: "Waiting for a driver to accept your ride.",
        };
      case "accepted":
        return {
          text: "Accepted",
          icon: <UserCheck size={24} className="text-blue-500 mr-2" />,
          color: "text-blue-600",
          description: "A driver has accepted your ride.",
        };
      case "cancelled":
        return {
          text: "Cancelled",
          icon: <XCircle size={24} className="text-red-500 mr-2" />,
          color: "text-red-600",
          description: "Your ride has been cancelled.",
        };
      default:
        return {
          text: status,
          icon: <Clock size={24} className="text-gray-500 mr-2" />,
          color: "text-gray-600",
          description: "Unknown status.",
        };
    }
  };

  const statusInfo = getStatusInfo(status);

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8 mt-8">
      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          aria-modal="true"
          role="dialog"
        >
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm mx-auto">
            <div className="flex items-center mb-4">
              <XCircle size={32} className="text-red-600 mr-2" />
              <h3 className="text-xl font-semibold text-gray-800">
                Confirm Cancellation
              </h3>
            </div>
            <p className="text-gray-700 mb-6">
              Are you sure you want to cancel this ride?{" "}
              <span className="font-semibold text-red-600">
                You may not be refunded.
              </span>
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowCancelModal(false)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition duration-200"
              >
                No, Keep Ride
              </button>
              <button
                onClick={handleCancelRide}
                disabled={isSubmitting}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-200 disabled:opacity-50"
              >
                {isSubmitting ? "Cancelling..." : "Yes, Cancel Ride"}
              </button>
            </div>
          </div>
        </div>
      )}

      <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
        Ride Details
      </h2>

      {/* Ride Information */}
      <div className="mb-8">
        <div className="bg-gray-100 p-6 rounded-lg shadow-inner">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-700 mb-2">
                <span className="font-semibold">Ride ID:</span> {rideSession.id}
              </p>
              <p className="text-gray-700 mb-2">
                <span className="font-semibold">Date:</span>{" "}
                {format(
                  new Date(rideSession.pickupDate),
                  "EEEE, MMMM dd, yyyy"
                )}
              </p>
              <p className="text-gray-700 mb-2">
                <span className="font-semibold">Pickup Time:</span>{" "}
                {format(
                  parseISO(`2021-01-01T${rideSession.pickupTime}`),
                  "hh:mm a"
                )}
              </p>
            </div>
            <div>
              <p className="text-gray-700 mb-2">
                <span className="font-semibold">Pickup Address:</span>{" "}
                {rideSession.pickupAddress}
              </p>
              <p className="text-gray-700 mb-2">
                <span className="font-semibold">Drop-off Address:</span>{" "}
                {rideSession.dropoffAddress}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-gray-700">
              <span className="font-semibold">Rider(s):</span>{" "}
              {rideSession.riders && rideSession.riders.length > 0
                ? rideSession.riders.map((rider: any, index: number) => (
                    <span key={index}>
                      {rider.name}
                      {index < rideSession.riders.length - 1 && ", "}
                    </span>
                  ))
                : "No riders added."}
            </p>
          </div>
        </div>
      </div>

      {/* Ride Status */}
      <div className="mb-6 flex items-center justify-center">
        {statusInfo.icon}
        <span className={`${statusInfo.color} font-semibold text-xl`}>
          {statusInfo.text}
        </span>
      </div>

      {/* Status Description */}
      {statusInfo.description && (
        <div className="mb-6 text-center">
          <p className="text-gray-600">{statusInfo.description}</p>
        </div>
      )}

      {/* Driver Information */}
      {currentDriver && (
        <div className="mb-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Driver Information
          </h3>
          <div className="bg-gray-100 p-6 rounded-lg shadow-inner flex flex-col sm:flex-row items-center">
            {currentDriver.photo_url && (
              <img
                src={currentDriver.photo_url}
                alt={`${currentDriver.first_name} ${currentDriver.last_name}`}
                className="w-24 h-24 rounded-full mr-6 object-cover mb-4 sm:mb-0"
              />
            )}
            <div>
              <p className="text-gray-700 mb-2">
                <span className="font-semibold">Name:</span>{" "}
                {currentDriver.first_name} {currentDriver.last_name}
              </p>
              <p className="text-gray-700 mb-2">
                <span className="font-semibold">Email:</span>{" "}
                {currentDriver.email}
              </p>
              <p className="text-gray-700 mb-2">
                <span className="font-semibold">Phone:</span>{" "}
                {currentDriver.phone_number}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Vehicle:</span>{" "}
                {currentDriver.vehicle_year} {currentDriver.vehicle_brand} (
                {currentDriver.vehicle_color}) - {currentDriver.license_plate}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Location Tracking Placeholder */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Location Tracking
        </h3>
        <div className="bg-gray-100 p-6 rounded-lg shadow-inner">
          {/* Placeholder for the map or tracking information */}
          <p className="text-gray-700">
            Tracking information will be displayed here.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      {status !== "cancelled" && status !== "completed" && (
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Only allow cancellation if status is not 'accepted' */}
          {status !== "accepted" && (
            <button
              onClick={() => setShowCancelModal(true)}
              disabled={isSubmitting}
              className="w-full bg-red-600 text-white py-3 px-6 rounded-md font-semibold text-lg hover:bg-red-700 transition duration-200 disabled:opacity-50"
            >
              Cancel Ride
            </button>
          )}
          {/* Additional actions can be added here */}
          {/* Example: View driver details if accepted */}
          {status === "accepted" && currentDriver && (
            <button
              onClick={() => {
                // Implement action, e.g., call driver or view more details
                alert("Driver details already displayed.");
              }}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-md font-semibold text-lg hover:bg-blue-700 transition duration-200"
            >
              Contact Driver
            </button>
          )}
        </div>
      )}
    </div>
  );
}
