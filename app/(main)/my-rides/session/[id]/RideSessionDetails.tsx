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
  ArrowCounterClockwise,
  ArrowRight, // Imported ArrowRight icon
} from "@phosphor-icons/react";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";

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
  rideSession: {
    id: string;
    pickupDate: string;
    pickupTime: string;
    pickupAddress: string;
    dropoffAddress: string;
    riders: { name: string }[];
    status: string;
    ride_link: string;
    driver_id?: string | null;
    // Add other necessary fields if any
  };
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

  // Initialize Supabase real-time listener
  useEffect(() => {
    // Define the channel name uniquely per ride session
    const channelName = `ride_updates_${rideSession.id}`;
    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "rides",
          filter: `id=eq.${rideSession.id}`,
        },
        (payload) => {
          const updatedStatus = payload.new.status;
          setStatus(updatedStatus);

          if (updatedStatus === "accepted" && payload.new.driver_id) {
            fetchDriverInfo(payload.new.driver_id);
          }
        }
      )
      .subscribe();

    // Function to fetch driver info
    const fetchDriverInfo = async (driverId: string) => {
      try {
        const { data: updatedDriver, error: driverError } = await supabase
          .from("drivers")
          .select("*")
          .eq("id", driverId)
          .single();

        if (driverError) {
          console.error("Error fetching updated driver info:", driverError);
        } else {
          setCurrentDriver(updatedDriver);
        }
      } catch (err) {
        console.error("Error in fetchDriverInfo:", err);
      }
    };

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, rideSession.id]);

  const handleCancelRide = async () => {
    setIsSubmitting(true);

    try {
      // Update the ride_session status to 'cancelled'
      const { error } = await supabase
        .from("rides")
        .update({ status: "cancelled" })
        .eq("id", rideSession.id);

      if (error) throw error;

      setStatus("cancelled");
      setShowCancelModal(false);
      toast.success("Your ride has been cancelled.");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while cancelling your ride.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Map the status to display text and icon
  const getStatusInfo = (status: string) => {
    switch (status.toLowerCase()) {
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
          description:
            "Your ride is currently in progress. Track it in real-time.",
        };
      case "pending":
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
          icon: <Clock size={24} className="text-zinc-500 mr-2" />,
          color: "text-zinc-600",
          description: "Unknown status.",
        };
    }
  };

  const statusInfo = getStatusInfo(status);

  return (
    <div className="min-h-screen py-6 px-4 container">
      {/* Toast Notifications */}
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar />

      {/* Refresh Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => router.refresh()}
          className="flex items-center bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition duration-200"
        >
          <ArrowCounterClockwise size={20} className="mr-2" />
          Refresh
        </button>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          aria-modal="true"
          role="dialog"
          aria-labelledby="cancel-modal-title"
          aria-describedby="cancel-modal-description"
        >
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm mx-auto animate-fadeIn">
            <div className="flex items-center mb-4">
              <XCircle
                size={28}
                className="text-red-600 mr-2"
                aria-hidden="true"
              />
              <h3
                id="cancel-modal-title"
                className="text-lg md:text-xl font-semibold text-zinc-800"
              >
                Confirm Cancellation
              </h3>
            </div>
            <p
              id="cancel-modal-description"
              className="text-zinc-700 mb-6 text-sm md:text-base"
            >
              Are you sure you want to cancel this ride?{" "}
              <span className="font-semibold text-red-600">
                You may not be refunded.
              </span>
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowCancelModal(false)}
                className="bg-zinc-200 text-zinc-700 px-3 py-2 rounded-md text-sm md:text-base hover:bg-zinc-300 transition duration-200"
              >
                No, Keep Ride
              </button>
              <button
                onClick={handleCancelRide}
                disabled={isSubmitting}
                className="bg-red-600 text-white px-3 py-2 rounded-md text-sm md:text-base hover:bg-red-700 transition duration-200 disabled:opacity-50"
              >
                {isSubmitting ? "Cancelling..." : "Yes, Cancel Ride"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto border bg-white  rounded-xl p-6 md:p-8">
        <header className="flex justify-between">
          <h2 className="text-3xl font-semibold tracking-tighter text-zinc-900 mb-6 text-center">
            Ride Details
          </h2>
          <p className="text-zinc-700 mb-2  text-xl  lg:text-3xl">
            {format(
              parseISO(`2021-01-01T${rideSession.pickupTime}`),
              "hh:mm a"
            )}
          </p>
        </header>

        {/* Ride Information */}
        <div className="mb-8">
          <div className="bg-zinc-100 p-6 rounded-lg shadow-inner">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-zinc-700 mb-2">
                  <span className="font-semibold">Ride ID:</span>{" "}
                  {rideSession.id}
                </p>
                <p className="text-zinc-700 mb-2">
                  <span className="font-semibold">Date:</span>{" "}
                  {format(
                    new Date(rideSession.pickupDate),
                    "EEEE, MMMM dd, yyyy"
                  )}
                </p>
              </div>
              <div>
                <p className="text-zinc-700 mb-2">
                  <span className="font-semibold">Pickup Address:</span>{" "}
                  {rideSession.pickupAddress}
                </p>
                <p className="text-zinc-700 mb-2">
                  <span className="font-semibold">Drop-off Address:</span>{" "}
                  {rideSession.dropoffAddress}
                </p>
                {/* Removed Distance Field */}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-zinc-700">
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
            {/* Removed Real-Time Ride Link */}
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
            <p className="text-zinc-600">{statusInfo.description}</p>
          </div>
        )}

        {/* Driver Information */}
        {currentDriver && status.toLowerCase() === "accepted" && (
          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-zinc-800 mb-4">
              Driver Information
            </h3>
            <div className="bg-zinc-100 p-6 rounded-lg shadow-inner flex flex-col sm:flex-row items-center">
              {currentDriver.photo_url && (
                <Image
                  src={currentDriver.photo_url}
                  alt={`${currentDriver.first_name} ${currentDriver.last_name}`}
                  className="w-24 h-24 rounded-full mr-6 object-cover mb-4 sm:mb-0"
                />
              )}
              <div>
                <p className="text-zinc-700 mb-2">
                  <span className="font-semibold">Name:</span>{" "}
                  {currentDriver.first_name} {currentDriver.last_name}
                </p>
                <p className="text-zinc-700 mb-2">
                  <span className="font-semibold">Email:</span>{" "}
                  {currentDriver.email}
                </p>
                <p className="text-zinc-700 mb-2">
                  <span className="font-semibold">Phone:</span>{" "}
                  {currentDriver.phone_number}
                </p>
                <p className="text-zinc-700">
                  <span className="font-semibold">Vehicle:</span>{" "}
                  {currentDriver.vehicle_year} {currentDriver.vehicle_brand} (
                  {currentDriver.vehicle_color}) - {currentDriver.license_plate}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Real-Time Tracking Information for Ongoing Rides */}
        {status.toLowerCase() === "ongoing" && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-zinc-800 mb-4">
              Real-Time Tracking
            </h3>
            <div className="bg-zinc-100 p-6 rounded-lg shadow-inner">
              <p className="text-zinc-700 mb-4">
                You can track your ride in real-time using the button below.
              </p>
              <a
                href={rideSession.ride_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-teal-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-teal-700 transition duration-200"
              >
                Open in Google Maps
              </a>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {status.toLowerCase() !== "cancelled" &&
          status.toLowerCase() !== "completed" && (
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Cancel Ride Button */}

              {/* Conditional View Ride Button or Message */}
              {status.toLowerCase() === "ongoing" ? (
                <Link href={`/my-rides/session/${rideSession.id}`}>
                  <button className="w-full sm:w-auto bg-teal-600 text-white py-3 px-6 rounded-md font-semibold text-lg hover:bg-teal-700 transition duration-200 flex items-center justify-center">
                    View Ongoing Ride <ArrowRight size={20} className="ml-2" />
                  </button>
                </Link>
              ) : (
                <div className="w-full  bg-zinc-100 text-zinc-700 py-3 px-6 rounded-md text-lg flex items-center justify-center">
                  The link to location tracking will be available when the
                  driver has picked up the passenger.
                </div>
              )}
            </div>
          )}

        <button
          onClick={() => setShowCancelModal(true)}
          disabled={isSubmitting}
          className="mt-8 w-full sm:w-auto bg-red-600 text-white py-3 px-6 rounded-md font-semibold text-lg hover:bg-red-700 transition duration-200 disabled:opacity-50"
        >
          Cancel Ride
        </button>
      </div>
    </div>
  );
}
