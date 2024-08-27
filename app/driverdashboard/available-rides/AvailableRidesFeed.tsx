"use client";
import React, { useState, useEffect } from "react";
import wkx from "wkx";
import { useRouter } from "next/navigation";

interface Passenger {
  name: string;
  age: number;
}

interface Ride {
  id: string;
  pickup_location: string | null; // WKB as string
  dropoff_location: string | null; // WKB as string
  pickup_time: string;
  passengers: Passenger[];
  special_instructions?: string;
  stops?: string[]; // Additional stops (WKB as strings)
}

interface AvailableRidesFeedProps {
  rides: Ride[];
}

// Main component for displaying available rides
export default function AvailableRidesFeed({ rides }: AvailableRidesFeedProps) {
  const [addresses, setAddresses] = useState<
    Record<string, { pickup: string; dropoff: string }>
  >({});
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);
  const router = useRouter();

  useEffect(() => {
    preloadAddresses();
  }, [rides]);

  // Preload addresses by reverse geocoding
  const preloadAddresses = async () => {
    const addressesMap: Record<string, { pickup: string; dropoff: string }> =
      {};

    for (const ride of rides) {
      const pickupAddress = await getAddress(ride.pickup_location);
      const dropoffAddress = await getAddress(ride.dropoff_location);

      addressesMap[ride.id] = {
        pickup: pickupAddress,
        dropoff: dropoffAddress,
      };
    }

    setAddresses(addressesMap);
  };

  // Helper function to get address from WKB
  const getAddress = async (wkbHex: string | null) => {
    if (!wkbHex) return "Location not available";
    const coords = parseWKB(wkbHex);
    if (coords) return await reverseGeocode(coords);
    return "Invalid location";
  };

  // Function to open ride details modal
  const openModal = (ride: Ride) => setSelectedRide(ride);

  // Function to close modal
  const closeModal = () => setSelectedRide(null);

  // Function to accept a ride
  const acceptRide = (rideId: string) => {
    console.log(`Ride accepted: ${rideId}`);
    router.push("/my-rides");
  };

  // Handle when no rides are available
  if (!rides || rides.length === 0) {
    return (
      <p className="text-center text-gray-600">
        No rides available at the moment.
      </p>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <h2 className="text-3xl font-bold text-gray-900 text-center">
        Available Rides
      </h2>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {rides.map((ride) => (
          <RideCard
            key={ride.id}
            ride={ride}
            addresses={addresses[ride.id]}
            openModal={openModal}
          />
        ))}
      </div>

      {selectedRide && (
        <RideDetailsModal
          ride={selectedRide}
          addresses={addresses[selectedRide.id]}
          acceptRide={acceptRide}
          closeModal={closeModal}
        />
      )}
    </div>
  );
}

// Ride card component for displaying a summary of each ride
const RideCard = ({
  ride,
  addresses,
  openModal,
}: {
  ride: Ride;
  addresses: { pickup: string; dropoff: string } | undefined;
  openModal: (ride: Ride) => void;
}) => (
  <div className="relative bg-white border border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 ease-in-out">
    <div className="absolute top-0 right-0 bg-teal-500 text-white text-xs font-semibold py-1 px-3 rounded-bl-lg">
      {new Date(ride.pickup_time).toLocaleDateString([], {
        weekday: "short",
        month: "short",
        day: "numeric",
      })}
    </div>

    <div className="flex flex-col space-y-4">
      <div>
        <p className="text-lg font-medium text-gray-900">
          Pickup:{" "}
          <span className="font-normal">
            {addresses?.pickup || "Loading..."}
          </span>
        </p>
        <p className="text-sm text-gray-700">
          Dropoff:{" "}
          <span className="font-normal">
            {addresses?.dropoff || "Loading..."}
          </span>
        </p>
      </div>

      <p className="text-sm text-gray-700">
        Time:{" "}
        {new Date(ride.pickup_time).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
      <p className="text-sm text-gray-700">
        Passengers: {ride.passengers.length}
      </p>

      <button
        onClick={() => openModal(ride)}
        className="mt-4 w-full bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-lg transition-all duration-200"
      >
        View Details
      </button>
    </div>
  </div>
);

// Modal component for showing ride details
const RideDetailsModal = ({
  ride,
  addresses,
  acceptRide,
  closeModal,
}: {
  ride: Ride;
  addresses: { pickup: string; dropoff: string } | undefined;
  acceptRide: (rideId: string) => void;
  closeModal: () => void;
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
    <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg w-full relative animate-fadeIn">
      <h3 className="text-2xl font-bold text-gray-900 mb-4">Ride Details</h3>

      <p className="text-gray-800">
        <strong>Pickup:</strong> {addresses?.pickup || "Loading..."}
      </p>
      <p className="text-gray-800">
        <strong>Dropoff:</strong> {addresses?.dropoff || "Loading..."}
      </p>
      <p className="text-gray-800">
        <strong>Pickup Time:</strong>{" "}
        {new Date(ride.pickup_time).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>

      <p className="text-gray-800 mt-4">
        <strong>Passengers:</strong>
      </p>
      <ul className="list-disc pl-6 space-y-1">
        {ride.passengers.map((passenger, index) => (
          <li key={index} className="text-gray-800">
            {passenger.name} (Age: {passenger.age})
          </li>
        ))}
      </ul>

      {ride.special_instructions && (
        <p className="text-gray-800 italic mt-4">
          <strong>Instructions:</strong> {ride.special_instructions}
        </p>
      )}

      {ride.stops && ride.stops.length > 0 && (
        <div className="mt-4">
          <p className="text-gray-800">
            <strong>Additional Stops:</strong>
          </p>
          <ul className="list-disc pl-6 space-y-1">
            {ride.stops.map((stop, index) => {
              const stopCoords = parseWKB(stop);
              return (
                <li key={index} className="text-gray-800">
                  {stopCoords
                    ? `Lat: ${stopCoords.lat}, Lng: ${stopCoords.lng}`
                    : "Invalid stop location"}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="mt-8 flex justify-end space-x-4">
        <button
          onClick={() => acceptRide(ride.id)}
          className="bg-teal-600 text-white py-2 px-6 rounded-lg hover:bg-teal-700 transition-colors duration-200"
        >
          Accept Ride
        </button>
        <button
          onClick={closeModal}
          className="bg-gray-600 text-white py-2 px-6 rounded-lg hover:bg-gray-700 transition-colors duration-200"
        >
          Close
        </button>
      </div>
    </div>
  </div>
);

// Helper function to parse WKB to coordinates
function parseWKB(wkbHex: string) {
  try {
    const buffer = Buffer.from(wkbHex, "hex");
    const geometry = wkx.Geometry.parse(buffer);
    if (geometry instanceof wkx.Point) {
      const { x: lng, y: lat } = geometry;
      return { lat, lng };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error parsing WKB:", error);
    return null;
  }
}

// Reverse geocoding to convert coordinates to an address using Google Maps API
async function reverseGeocode(location: { lat: number; lng: number }) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat},${location.lng}&key=${apiKey}`
  );
  const data = await response.json();
  if (data.status === "OK" && data.results.length > 0) {
    return data.results[0].formatted_address;
  } else {
    return "Address not found";
  }
}
