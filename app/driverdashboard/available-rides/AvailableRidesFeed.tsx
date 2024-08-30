"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Updated for Next.js 14
import { acceptRide } from "@/utils/supabase/supabaseQueries"; // Import the acceptRide function

// Main component for displaying available rides
export default function AvailableRidesFeed({ rides, user_id }: any) {
  const [selectedRide, setSelectedRide] = useState<any | null>(null);
  const router = useRouter();

  // Function to open ride details modal
  const openModal = (ride: any) => setSelectedRide(ride);

  // Function to close modal
  const closeModal = () => setSelectedRide(null);

  // Function to handle accepting a ride
  const handleAcceptRide = async (rideId: string) => {
    try {
      await acceptRide(rideId, user_id); // Call the acceptRide function with the rideId and user_id
      router.push("/driverdashboard/my-rides"); // Redirect to the "My Rides" page after accepting the ride
    } catch (error) {
      console.error("Failed to accept ride:", error);
    }
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
        {rides.map((ride: any) => (
          <RideCard key={ride.id} ride={ride} openModal={openModal} />
        ))}
      </div>

      {selectedRide && (
        <RideDetailsModal
          ride={selectedRide}
          acceptRide={handleAcceptRide}
          closeModal={closeModal}
        />
      )}
    </div>
  );
}

// Ride card component for displaying a summary of each ride
const RideCard = ({
  ride,
  openModal,
}: {
  ride: any;
  openModal: (ride: any) => void;
}) => (
  <div className="relative bg-white border border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 ease-in-out">
    <div className="absolute top-0 right-0 bg-teal-500 text-white text-xs font-semibold py-1 px-3 rounded-bl-lg">
      {new Date(ride.pickupDate + "T" + ride.pickupTime).toLocaleDateString(
        [],
        {
          weekday: "short",
          month: "short",
          day: "numeric",
        }
      )}
    </div>

    <div className="flex flex-col space-y-4">
      <div>
        <p className="text-lg font-medium text-gray-900">
          Pickup: <span className="font-normal">{ride.pickupAddress}</span>
        </p>
        <p className="text-sm text-gray-700">
          Dropoff: <span className="font-normal">{ride.dropoffAddress}</span>
        </p>
      </div>

      <p className="text-sm text-gray-700">
        Time:{" "}
        {new Date(ride.pickupDate + "T" + ride.pickupTime).toLocaleTimeString(
          [],
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        )}
      </p>
      <p className="text-sm text-gray-700">Passengers: {ride.riders.length}</p>

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
  acceptRide,
  closeModal,
}: {
  ride: any;
  acceptRide: (rideId: string) => void;
  closeModal: () => void;
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
    <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg w-full relative animate-fadeIn">
      <h3 className="text-2xl font-bold text-gray-900 mb-4">Ride Details</h3>

      <p className="text-gray-800">
        <strong>Pickup:</strong> {ride.pickupAddress}
      </p>
      <p className="text-gray-800">
        <strong>Dropoff:</strong> {ride.dropoffAddress}
      </p>
      <p className="text-gray-800">
        <strong>Pickup Time:</strong>{" "}
        {new Date(ride.pickupDate + "T" + ride.pickupTime).toLocaleTimeString(
          [],
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        )}
      </p>

      <p className="text-gray-800 mt-4">
        <strong>Passengers:</strong>
      </p>
      <ul className="list-disc pl-6 space-y-1">
        {ride.riders.map((rider: any, index: number) => (
          <li key={index} className="text-gray-800">
            {rider.name} (Age: {rider.age})
          </li>
        ))}
      </ul>

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
