"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { User } from "@phosphor-icons/react/dist/ssr";
import {
  getRideById,
  startRide,
  endRide,
} from "@/utils/supabase/supabaseQueries";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import ShareLocationMap from "./ShareLocationMap";

interface Passenger {
  name: string;
  age: number;
}

interface Ride {
  id: string;
  pickupAddress: string;
  dropoffAddress: string;
  pickupTime: string;
  pickupDate: string;
  status: string;
  pickupLat: number;
  pickupLng: number;
  dropoffLat: number;
  dropoffLng: number;
  riders: Passenger[];
}

export default function RidePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rideId = searchParams.get("ride_id");

  const [rideData, setRideData] = useState<Ride | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false); // State to control the modal visibility
  const [rideStarted, setRideStarted] = useState(false); // State to track if the ride has started

  useEffect(() => {
    const fetchRide = async () => {
      if (rideId) {
        try {
          const ride = await getRideById(rideId); // Fetch ride data based on id
          setRideData(ride);
          if (ride.status === "ongoing") {
            setRideStarted(true); // Mark the ride as started if it's already ongoing
          }
        } catch (error) {
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
      await startRide(rideId!); // Start the ride by changing its status to "ongoing"
      console.log("Ride started.");
      setRideStarted(true); // Update the state to indicate the ride has started
      setShowModal(false); // Close the modal after starting the ride
    } catch (error) {
      console.error("Failed to start the ride:", error);
    }
  };

  const endRideHandler = async () => {
    try {
      await endRide(rideId!); // End the ride by changing its status to "completed"
      console.log("Ride ended.");
      router.push("/my-rides"); // Redirect to the "My Rides" page
    } catch (error) {
      console.error("Failed to end the ride:", error);
    }
  };

  if (loading) {
    return <p>Loading ride details...</p>;
  }

  if (!rideData) {
    return <p>Ride not found.</p>;
  }

  const mapContainerStyle = {
    width: "100%",
    height: "400px",
  };

  const center = {
    lat: rideData.pickupLat,
    lng: rideData.pickupLng,
  };

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
            className={`mt-2 font-semibold text-${
              rideStarted ? "green-600" : "red-600"
            }`}
          >
            {rideStarted ? "Ride is Ongoing" : "Ride Not Started"}
          </p>
        </div>

        {/* Google Map */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800">Route Map</h3>
          <LoadScript
            googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
          >
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={center}
              zoom={14}
            >
              <Marker position={center} />
              <Marker
                position={{
                  lat: rideData.dropoffLat,
                  lng: rideData.dropoffLng,
                }}
              />
            </GoogleMap>
          </LoadScript>
        </div>
        {/* <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800">
            Share Location
          </h3>
          <ShareLocationMap rideId={rideId!} />
        </div> */}

        {/* Pickup and Dropoff Information */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-teal-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800">
              Pickup Location
            </h3>
            <p className="text-gray-700 mt-2">{rideData.pickupAddress}</p>
          </div>
          <div className="bg-teal-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800">
              Dropoff Location
            </h3>
            <p className="text-gray-700 mt-2">{rideData.dropoffAddress}</p>
          </div>
        </div>

        {/* Ride Time */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800">Ride Time</h3>
          <p className="text-gray-700 mt-2">{rideData.pickupTime}</p>
        </div>

        {/* Passenger Information */}
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Passengers</h3>
          {rideData.riders.map((rider, index) => (
            <div key={index} className="flex items-center space-x-4">
              <User className="w-8 h-8 text-teal-600" />
              <p className="text-gray-700">
                {rider.name}, Age: {rider.age}
              </p>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center space-x-4">
          <button
            onClick={() => setShowModal(true)} // Open the modal
            disabled={rideStarted} // Disable the button if the ride is already started
            className={`w-full py-3 px-4 rounded-md transition-colors duration-200 ${
              rideStarted
                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                : "bg-teal-600 text-white hover:bg-teal-700"
            }`}
          >
            {rideStarted ? "Ride Started" : "Start Ride"}
          </button>
          <button
            onClick={endRideHandler}
            disabled={!rideStarted} // Disable the button if the ride hasn't started
            className={`w-full py-3 px-4 rounded-md transition-colors duration-200 ${
              rideStarted
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-gray-400 text-gray-200 cursor-not-allowed"
            }`}
          >
            End Ride
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Confirm Start Ride
            </h3>
            <p className="text-gray-700">
              Please make sure you are at the pickup location before starting
              the ride.
            </p>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setShowModal(false)} // Close the modal
                className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={startRideHandler}
                className="bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors duration-200"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
