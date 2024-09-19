// RidePage.tsx
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  getRideById,
  startRide,
  endRide,
  updateDriverLocation,
} from "@/utils/supabase/supabaseQueries";
import Modal from "./components/Modal";
import Buttons from "./components/Buttons";
import RideInfo from "./components/RideInfo";
import Map from "./components/Map";
import { Ride } from "@/app/types/types";

export default function RidePage({ userId }: any) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rideId = searchParams.get("ride_id");
  const driverId = userId; // Driver ID from your auth or session logic

  const [rideData, setRideData] = useState<Ride | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState<"start" | "end" | null>(null);
  const [rideStarted, setRideStarted] = useState(false);
  const [driverLocation, setDriverLocation] = useState<{
    lat: number | null;
    lng: number | null;
  }>({
    lat: null,
    lng: null,
  });
  const [driverHeading, setDriverHeading] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const watchIdRef = useRef<number | null>(null);

  useEffect(() => {
    const fetchRide = async () => {
      if (rideId) {
        console.log("Fetching ride with ID:", rideId); // Debug log
        try {
          const ride = await getRideById(rideId);
          if (!ride) throw new Error("Ride not found.");
          setRideData(ride);
          setRideStarted(ride.status === "ongoing");
          console.log("Ride data fetched:", ride); // Debug log
        } catch (error) {
          setError("Failed to fetch ride details.");
          console.error("Failed to fetch ride:", error);
        } finally {
          setLoading(false);
        }
      } else {
        console.error("rideId is null or undefined");
        setError("Invalid ride ID.");
        setLoading(false);
      }
    };
    fetchRide();
  }, [rideId]);

  // Start tracking driver's location when ride is started
  useEffect(() => {
    if (!rideStarted) return;

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    const successCallback: PositionCallback = (position) => {
      const { latitude, longitude, heading } = position.coords;
      setDriverLocation({
        lat: latitude,
        lng: longitude,
      });
      setDriverHeading(heading || 0);

      if (rideId && driverId) {
        updateDriverLocation(rideId, driverId, latitude, longitude)
          .then(() => {
            console.log("Driver location updated in Supabase"); // Debug log
          })
          .catch((err) => {
            console.error("Failed to update driver location:", err);
          });
      }
    };

    const errorCallback: PositionErrorCallback = (error) => {
      setError("Failed to retrieve your location.");
      console.error("Geolocation error:", error);
    };

    // Start watching the position
    watchIdRef.current = navigator.geolocation.watchPosition(
      successCallback,
      errorCallback,
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000,
      }
    );

    // Cleanup on unmount
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [rideStarted, rideId, driverId]);

  // Define the onConfirm handler based on the action
  const handleConfirm = async () => {
    if (!rideId || !driverId) {
      setError("Invalid ride or driver ID.");
      return;
    }

    try {
      if (modalAction === "start") {
        await startRide(rideId);
        setRideStarted(true);
        console.log("Ride started successfully"); // Debug log
      } else if (modalAction === "end") {
        await endRide(rideId);
        setRideStarted(false);
        console.log("Ride ended successfully"); // Debug log
      }
    } catch (err) {
      setError("Failed to perform the action.");
      console.error("Action failed:", err);
    } finally {
      setShowModal(false);
      setModalAction(null);
    }
  };

  // Handlers to open modal with specific action
  const handleStartRide = () => {
    setModalAction("start");
    setShowModal(true);
  };

  const handleEndRide = () => {
    setModalAction("end");
    setShowModal(true);
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

        {/* Google Map with driver's live location and heading */}
        <Map
          pickupLat={rideData.pickupLat}
          pickupLng={rideData.pickupLng}
          dropoffLat={rideData.dropoffLat}
          dropoffLng={rideData.dropoffLng}
          driverLat={driverLocation.lat}
          driverLng={driverLocation.lng}
          driverHeading={driverHeading}
        />

        <RideInfo rideData={rideData} />

        {/* Actions */}
        <Buttons
          onStart={handleStartRide}
          onEnd={handleEndRide}
          rideStarted={rideStarted}
        />
      </div>

      {/* Confirmation Modal */}
      {showModal && modalAction && (
        <Modal
          setShowModal={setShowModal}
          onConfirm={handleConfirm}
          title={
            modalAction === "start"
              ? "Start Ride Confirmation"
              : "End Ride Confirmation"
          }
          message={
            modalAction === "start"
              ? "Are you sure you want to start the ride?"
              : "Are you sure you want to end the ride?"
          }
        />
      )}
    </div>
  );
}
