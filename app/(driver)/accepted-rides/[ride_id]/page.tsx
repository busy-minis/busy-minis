"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  getRideById,
  startRide,
  endRide,
} from "@/utils/supabase/supabaseQueries";
import Modal from "./components/Modal";
import Buttons from "./components/Buttons";
import RideInfo from "./components/RideInfo";
import Map from "./components/Map";
import { Ride, Passenger } from "@/app/types/types";

// Utility function to format date and time

export default function RidePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rideId = searchParams.get("ride_id");

  const [rideData, setRideData] = useState<Ride | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [rideStarted, setRideStarted] = useState(false);
  const [error, setError] = useState<string | null>(null); // Handle error state

  useEffect(() => {
    const fetchRide = async () => {
      if (rideId) {
        try {
          const ride = await getRideById(rideId);
          if (!ride) throw new Error("Ride not found.");
          setRideData(ride);
          setRideStarted(ride.status === "ongoing");
        } catch (error) {
          setError("Failed to fetch ride details.");
          console.error("Failed to fetch ride:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchRide();
  }, [rideId]);

  const startRideHandler = async () => {
    try {
      await startRide(rideId!);
      console.log("Ride started.");
      setRideStarted(true);
      setShowModal(false);
    } catch (error) {
      console.error("Failed to start the ride:", error);
    }
  };

  const endRideHandler = async () => {
    try {
      await endRide(rideId!);
      console.log("Ride ended.");
      router.push("/my-rides");
    } catch (error) {
      console.error("Failed to end the ride:", error);
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading ride details...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (!rideData) {
    return <p className="text-center text-gray-500">Ride not found.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg space-y-6">
        <h2 className="text-3xl font-extrabold text-gray-900">Ride Details</h2>

        {/* Ride Status */}
        <div className="bg-teal-100 p-4 rounded-lg">
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

        {/* Google Map */}
        <Map
          pickupLat={rideData.pickupLat}
          pickupLng={rideData.pickupLng}
          dropoffLng={rideData.dropoffLng}
          dropoffLat={rideData.dropoffLat}
        />

        <RideInfo rideData={rideData} />

        {/* Actions */}
        <Buttons
          setShowModal={setShowModal}
          endRideHandler={endRideHandler}
          rideStarted={rideStarted}
        />
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <Modal
          setShowModal={setShowModal}
          startRideHandler={startRideHandler}
        />
      )}
    </div>
  );
}
