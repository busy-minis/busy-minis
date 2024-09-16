"use client";

import React, { useState, useEffect, useRef } from "react";
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

const THROTTLE_INTERVAL = 5000; // 5 seconds
const MIN_DISTANCE_CHANGE = 10; // 10 meters

export default function RidePage({ userId }: any) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rideId = searchParams.get("ride_id");
  const driverId = userId; // Driver ID from your auth or session logic

  const [rideData, setRideData] = useState<Ride | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
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

  const stopTrackingDriverRef = useRef<(() => void) | null>(null);

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

  // Function to start tracking the driver's location and heading
  const startTrackingDriver = (rideId: string) => {
    let lastUpdateTime = 0;
    let lastPosition: { latitude: number; longitude: number } | null = null;

    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude, heading } = position.coords;
        const currentTime = Date.now();

        // Log position data
        console.log("Geolocation success:", position.coords);

        // Update driver's location and heading in state
        setDriverLocation({ lat: latitude, lng: longitude });
        setDriverHeading(heading !== null ? heading : driverHeading);

        // Log updated state
        console.log("Driver Location Updated:", {
          lat: latitude,
          lng: longitude,
        });
        console.log("Driver Heading Updated:", driverHeading);

        // Throttle updates to avoid too many requests
        if (
          currentTime - lastUpdateTime > THROTTLE_INTERVAL &&
          (!lastPosition ||
            getDistance(
              lastPosition.latitude,
              lastPosition.longitude,
              latitude,
              longitude
            ) > MIN_DISTANCE_CHANGE)
        ) {
          lastUpdateTime = currentTime;
          lastPosition = { latitude, longitude };

          // Update the driver's location in Supabase
          await updateDriverLocation(rideId, driverId, latitude, longitude);
        }
      },
      (error) => {
        console.error("Error tracking location:", error);
        setError(
          "Failed to retrieve your location. Please ensure location services are enabled and refresh the page."
        );
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 5000,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  };

  // Utility function to calculate the distance between two coordinates
  const getDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  };

  const startRideHandler = async () => {
    try {
      await startRide(rideId!);
      console.log("Ride started.");
      setRideStarted(true);
      setShowModal(false);

      // Start tracking driver's location
      stopTrackingDriverRef.current = startTrackingDriver(rideId!);
    } catch (error) {
      console.error("Failed to start the ride:", error);
    }
  };

  const endRideHandler = async () => {
    try {
      await endRide(rideId!);
      console.log("Ride ended.");
      setRideStarted(false);

      // Stop tracking driver's location
      if (stopTrackingDriverRef.current) {
        stopTrackingDriverRef.current();
        stopTrackingDriverRef.current = null;
      }

      router.push("/my-rides");
    } catch (error) {
      console.error("Failed to end the ride:", error);
    }
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (stopTrackingDriverRef.current) {
        stopTrackingDriverRef.current();
      }
    };
  }, []);

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
          dropoffLng={rideData.dropoffLng}
          dropoffLat={rideData.dropoffLat}
          driverLat={driverLocation.lat}
          driverLng={driverLocation.lng}
          driverHeading={driverHeading}
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
