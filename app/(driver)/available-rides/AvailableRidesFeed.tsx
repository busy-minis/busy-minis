"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { acceptRide } from "@/utils/supabase/supabaseQueries";
import { Car, MapPin, Users, Clock } from "@phosphor-icons/react"; // Import icons from phosphor
import Image from "next/image";

export default function AvailableRidesFeed({ rides, user_id }: any) {
  const [selectedRide, setSelectedRide] = useState<any | null>(null);
  const router = useRouter();

  const openModal = (ride: any) => setSelectedRide(ride);
  const closeModal = () => setSelectedRide(null);

  const handleAcceptRide = async (rideId: string) => {
    try {
      await acceptRide(rideId, user_id);
      router.push("/driverdashboard/my-rides"); // Redirect to 'My Rides' after accepting
    } catch (error) {
      console.error("Failed to accept ride:", error);
    }
  };

  if (!rides || rides.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-500 p-4">
        <p className="text-lg text-white text-center">
          No rides available at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-r from-blue-100 to-white min-h-screen">
      {/* Instructional Header with Image */}
      <div className="flex flex-col items-center text-center mb-8">
        <Image
          src="/carguy.png"
          alt="Driver dashboard image"
          width={250}
          height={250}
          className="mb-4"
        />
        <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
          Available Rides
        </h2>
        <p className="text-lg text-gray-700 max-w-2xl">
          Welcome, driver! Below is a list of rides that have been posted and
          are available for you to accept. Once accepted, these rides will move
          to your My Rides page.
        </p>
      </div>

      {/* Grid Layout with Balanced Ride Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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

// Ride card component with a more balanced layout
const RideCard = ({
  ride,
  openModal,
}: {
  ride: any;
  openModal: (ride: any) => void;
}) => (
  <div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between space-y-4">
    {/* Ride Info */}
    <div className="space-y-2">
      {/* Date Tag */}
      <div className="bg-gradient-to-r from-teal-500 to-green-500 text-white text-xs font-semibold py-1 px-3 rounded-md inline-block mb-2">
        {new Date(ride.pickupDate + "T" + ride.pickupTime).toLocaleDateString(
          [],
          {
            weekday: "short",
            month: "short",
            day: "numeric",
          }
        )}
      </div>

      {/* Pickup */}
      <div className="flex items-center space-x-2">
        <MapPin size={20} className="text-teal-500" />
        <p className="text-lg font-semibold text-gray-900">
          Pickup:{" "}
          <span className="font-normal text-gray-700">
            {ride.pickupAddress}
          </span>
        </p>
      </div>

      {/* Dropoff */}
      <div className="flex items-center space-x-2">
        <MapPin size={20} className="text-red-500" />
        <p className="text-lg font-semibold text-gray-900">
          Dropoff:{" "}
          <span className="font-normal text-gray-700">
            {ride.dropoffAddress}
          </span>
        </p>
      </div>

      {/* Time */}
      <div className="flex items-center space-x-2">
        <Clock size={20} className="text-blue-500" />
        <p className="text-sm text-gray-700">
          {new Date(ride.pickupDate + "T" + ride.pickupTime).toLocaleTimeString(
            [],
            {
              hour: "2-digit",
              minute: "2-digit",
            }
          )}
        </p>
      </div>

      {/* Passengers */}
      <div className="flex items-center space-x-2">
        <Users size={20} className="text-gray-700" />
        <p className="text-sm text-gray-700">
          Passengers: {ride.riders.length}
        </p>
      </div>
    </div>

    {/* Button */}
    <button
      onClick={() => openModal(ride)}
      className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-2 px-6 rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all"
    >
      View Details
    </button>
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
    <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg w-full">
      <h3 className="text-2xl font-bold text-gray-900 mb-4">Ride Details</h3>

      <p className="text-gray-800 mb-2">
        <strong>Pickup:</strong> {ride.pickupAddress}
      </p>
      <p className="text-gray-800 mb-2">
        <strong>Dropoff:</strong> {ride.dropoffAddress}
      </p>
      <p className="text-gray-800 mb-2">
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
          className="bg-gradient-to-r from-teal-500 to-green-500 text-white py-2 px-6 rounded-lg hover:from-teal-600 hover:to-green-600 transition-colors"
        >
          Accept Ride
        </button>
        <button
          onClick={closeModal}
          className="bg-gray-600 text-white py-2 px-6 rounded-lg hover:bg-gray-700 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  </div>
);
