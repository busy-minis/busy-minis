"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  getRideById,
  startRide,
  endRide,
  updateRideLink,
} from "@/utils/supabase/supabaseQueries";
import Modal from "./components/Modal";
import Buttons from "./components/Buttons";
import RideInfo from "./components/RideInfo";
import { Ride } from "@/app/types/types";

export default function RidePage({ userId }: any) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rideId = searchParams.get("ride_id");
  const driverId = userId;

  const [rideData, setRideData] = useState<Ride | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState<
    "start" | "end" | "updateLink" | null
  >(null);
  const [rideStarted, setRideStarted] = useState(false);
  const [googleMapsLink, setGoogleMapsLink] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRide = async () => {
      if (rideId) {
        try {
          const ride = await getRideById(rideId);
          if (!ride) throw new Error("Ride not found.");
          setRideData(ride);
          setRideStarted(ride.status === "ongoing");
          setGoogleMapsLink(ride.google_maps_link || "");
        } catch (error) {
          setError("Failed to fetch ride details.");
          console.error("Failed to fetch ride:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setError("Invalid ride ID.");
        setLoading(false);
      }
    };
    fetchRide();
  }, [rideId]);

  const handleConfirm = async (linkInputValue?: string) => {
    if (!rideId || !driverId) {
      setError("Invalid ride or driver ID.");
      return;
    }

    try {
      if (modalAction === "start") {
        if (!linkInputValue) {
          setError("Please provide the Google Maps link.");
          return;
        }
        await startRide(rideId);
        await updateRideLink(rideId, linkInputValue);
        setGoogleMapsLink(linkInputValue);
        setRideStarted(true);
      } else if (modalAction === "end") {
        await endRide(rideId);
        setRideStarted(false);
        router.push("/");
      } else if (modalAction === "updateLink") {
        if (!linkInputValue) {
          setError("Please provide the new Google Maps link.");
          return;
        }
        await updateRideLink(rideId, linkInputValue);
        setGoogleMapsLink(linkInputValue);
      }
    } catch (err) {
      setError("Failed to perform the action.");
      console.error("Action failed:", err);
    } finally {
      setShowModal(false);
      setModalAction(null);
    }
  };

  const handleStartRide = () => {
    setModalAction("start");
    setShowModal(true);
  };

  const handleEndRide = () => {
    setModalAction("end");
    setShowModal(true);
  };

  const handleUpdateLink = () => {
    setModalAction("updateLink");
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-center text-gray-500 text-lg">
          Loading ride details...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <p className="text-center text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  if (!rideData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <p className="text-center text-gray-500 text-lg">Ride not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-lg space-y-6">
        <h2 className="text-3xl font-extrabold text-gray-900">Ride Details</h2>

        <div className="bg-teal-100 p-4 sm:p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-teal-900">
            Ride ID: <span className="text-teal-800">{rideData.id}</span>
          </h3>
          <p
            className={`mt-2 font-semibold ${
              rideStarted ? "text-green-600" : "text-red-600"
            }`}
          >
            {rideStarted ? "Ride is Ongoing" : "Ride Not Started"}
          </p>
        </div>

        {rideStarted && (
          <div className="bg-blue-100 p-4 sm:p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900">
              Google Maps Link
            </h3>
            <p className="mt-2 text-blue-800 break-words">
              <a
                href={googleMapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                {googleMapsLink}
              </a>
            </p>
            <button
              onClick={handleUpdateLink}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              Refresh Link
            </button>
          </div>
        )}

        <RideInfo rideData={rideData} />

        {error && (
          <div className="bg-red-100 p-4 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <Buttons
          onStart={handleStartRide}
          onEnd={handleEndRide}
          rideStarted={rideStarted}
        />
      </div>

      {showModal && modalAction && (
        <Modal
          setShowModal={setShowModal}
          onConfirm={handleConfirm}
          title={
            modalAction === "start"
              ? "Start Ride"
              : modalAction === "end"
              ? "End Ride Confirmation"
              : "Update Google Maps Link"
          }
          message={
            modalAction === "start"
              ? "Please paste your Google Maps link to share your location."
              : modalAction === "end"
              ? "Are you at the destination? Ending the ride will prevent access to this page."
              : "Please paste the new Google Maps link."
          }
          requireInput={modalAction !== "end"}
        />
      )}
    </div>
  );
}
