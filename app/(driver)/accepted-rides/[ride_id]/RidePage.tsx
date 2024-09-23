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
  const driverId = userId;

  const [rideData, setRideData] = useState<Ride | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState<
    "start" | "end" | "arrive" | null
  >(null);
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
  const [isOffline, setIsOffline] = useState(false);
  const [isPickupComplete, setIsPickupComplete] = useState(false);

  const watchIdRef = useRef<number | null>(null);
  const lastUpdateTimeRef = useRef<number>(0);
  const cachedRouteRef = useRef<any>(null);

  useEffect(() => {
    const fetchRide = async () => {
      if (rideId) {
        try {
          const ride = await getRideById(rideId);
          if (!ride) throw new Error("Ride not found.");
          setRideData(ride);
          setRideStarted(ride.status === "ongoing");
          setIsPickupComplete(ride.pickupComplete || false);
          cachedRouteRef.current = ride.cachedRoute;
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

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!rideStarted) return;

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    const successCallback: PositionCallback = (position) => {
      const { latitude, longitude, heading } = position.coords;
      const currentTime = Date.now();

      // Update location every 5 seconds or if the driver has moved more than 10 meters
      if (
        currentTime - lastUpdateTimeRef.current > 5000 ||
        (driverLocation.lat &&
          driverLocation.lng &&
          calculateDistance(
            driverLocation.lat,
            driverLocation.lng,
            latitude,
            longitude
          ) > 10)
      ) {
        setDriverLocation({
          lat: latitude,
          lng: longitude,
        });
        setDriverHeading(heading || 0);
        lastUpdateTimeRef.current = currentTime;

        if (rideId && driverId && !isOffline) {
          updateDriverLocation(rideId, driverId, latitude, longitude).catch(
            (err) => {
              console.error("Failed to update driver location:", err);
            }
          );
        }
      }
    };

    const errorCallback: PositionErrorCallback = (error) => {
      setError("Failed to retrieve your location.");
      console.error("Geolocation error:", error);
    };

    watchIdRef.current = navigator.geolocation.watchPosition(
      successCallback,
      errorCallback,
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000,
      }
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [rideStarted, rideId, driverId, isOffline]);

  const calculateDistance = (
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

    return R * c;
  };

  const handleConfirm = async () => {
    if (!rideId || !driverId) {
      setError("Invalid ride or driver ID.");
      return;
    }

    try {
      if (modalAction === "start") {
        await startRide(rideId);
        setRideStarted(true);
      } else if (modalAction === "end") {
        await endRide(rideId);
        setRideStarted(false);
      } else if (modalAction === "arrive") {
        setIsPickupComplete(true);
        // Update pickup complete status in your backend here
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

  const handleArrival = () => {
    setModalAction("arrive");
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
          {isOffline && (
            <p className="text-yellow-600 font-semibold">Offline Mode</p>
          )}
        </div>

        <Map
          pickupLat={rideData.pickupLat}
          pickupLng={rideData.pickupLng}
          dropoffLat={rideData.dropoffLat}
          dropoffLng={rideData.dropoffLng}
          driverLat={driverLocation.lat}
          driverLng={driverLocation.lng}
          driverHeading={driverHeading}
          isPickupComplete={isPickupComplete}
          onArrival={handleArrival}
        />

        <RideInfo rideData={rideData} />

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
              ? "Start Ride Confirmation"
              : modalAction === "end"
              ? "End Ride Confirmation"
              : "Arrival Confirmation"
          }
          message={
            modalAction === "start"
              ? "Are you sure you want to start the ride?"
              : modalAction === "end"
              ? "Are you sure you want to end the ride?"
              : isPickupComplete
              ? "Have you arrived at the drop-off location?"
              : "Have you arrived at the pickup location?"
          }
        />
      )}
    </div>
  );
}
