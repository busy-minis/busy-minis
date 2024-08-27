"use client";
import React, { useState, useEffect } from "react";

// Define the Passenger type
interface Passenger {
  name: string;
  age: number;
}

// Define the Ride type
interface Ride {
  id: string;
  pickup_time: string;
  pickup_address: string;
  dropoff_address: string;
  passengers: Passenger[];
  special_instructions: string;
  ride_duration: string; // Added ride duration field
}

export default function MyRides() {
  // Define the state with the correct type for acceptedRides
  const [acceptedRides, setAcceptedRides] = useState<Ride[]>([]);
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);

  // Dummy data representing accepted rides
  const dummyRides: Ride[] = [
    {
      id: "1",
      pickup_time: "2024-08-25T14:00:00Z",
      pickup_address: "123 Main St, Springfield",
      dropoff_address: "456 Oak Ave, Shelbyville",
      passengers: [
        { name: "John Doe", age: 30 },
        { name: "Jane Doe", age: 28 },
      ],
      special_instructions:
        "Handle with care, passengers are carrying fragile items.",
      ride_duration: "30 minutes",
    },
    {
      id: "2",
      pickup_time: "2024-08-26T16:00:00Z",
      pickup_address: "789 Maple Dr, Capital City",
      dropoff_address: "101 Pine St, Ogdenville",
      passengers: [
        { name: "Alice Smith", age: 25 },
        { name: "Bob Johnson", age: 35 },
      ],
      special_instructions:
        "Passenger has a pet. Please allow time for breaks.",
      ride_duration: "45 minutes",
    },
    {
      id: "3",
      pickup_time: "2024-08-27T18:00:00Z",
      pickup_address: "123 Elm St, North Haverbrook",
      dropoff_address: "456 Cedar Rd, Brockway",
      passengers: [{ name: "Charlie Brown", age: 20 }],
      special_instructions: "Drop off near the back entrance.",
      ride_duration: "25 minutes",
    },
  ];

  useEffect(() => {
    // Simulate fetching rides (using dummy data)
    setAcceptedRides(dummyRides);
  }, []);

  const closeModal = () => {
    setSelectedRide(null);
  };

  if (acceptedRides.length === 0) {
    return (
      <p className="text-center text-gray-600">You have no accepted rides.</p>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen p-8">
      <h2 className="text-4xl font-extrabold text-center text-white mb-12">
        My Rides
      </h2>
      <div className="grid gap-12 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
        {acceptedRides.map((ride) => (
          <div
            key={ride.id}
            className="bg-gradient-to-b from-gray-700 to-gray-800 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105"
          >
            <div className="text-center">
              <span className="block text-xs uppercase tracking-widest text-gray-400">
                {new Date(ride.pickup_time).toLocaleDateString([], {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </span>
              <h3 className="text-2xl text-white mt-2">Standard Ride</h3>
              <p className="text-sm text-gray-400 mt-1">
                {ride.passengers.length}{" "}
                {ride.passengers.length > 1 ? "Passengers" : "Passenger"}
              </p>
            </div>

            <div className="mt-6 text-center space-y-4">
              <div className="bg-gray-600 p-4 rounded-md">
                <h4 className="text-lg text-white">Pickup</h4>
                <p className="text-gray-300">{ride.pickup_address}</p>
              </div>

              <div className="bg-gray-600 p-4 rounded-md">
                <h4 className="text-lg text-white">Dropoff</h4>
                <p className="text-gray-300">{ride.dropoff_address}</p>
              </div>

              <div className="bg-gray-600 p-4 rounded-md">
                <h4 className="text-lg text-white">Estimated Time</h4>
                <p className="text-gray-300">{ride.ride_duration}</p>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => alert(`Starting ride for Ride ID: ${ride.id}`)}
                className="mt-4 bg-green-600 hover:bg-green-500 text-white py-2 px-4 rounded-md transition-colors duration-200"
              >
                Start Ride
              </button>
              <button
                onClick={() => setSelectedRide(ride)}
                className="mt-4 ml-4 bg-teal-600 hover:bg-teal-500 text-white py-2 px-4 rounded-md transition-colors duration-200"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Ride Details Modal */}
      {selectedRide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Ride Details
            </h3>
            <p className="text-gray-800">
              <strong>Pickup:</strong> {selectedRide.pickup_address}
            </p>
            <p className="text-gray-800">
              <strong>Dropoff:</strong> {selectedRide.dropoff_address}
            </p>
            <p className="text-gray-800">
              <strong>Pickup Time:</strong>{" "}
              {new Date(selectedRide.pickup_time).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <p className="text-gray-800">
              <strong>Passengers:</strong>
            </p>
            <ul className="list-disc pl-5 text-gray-800">
              {selectedRide.passengers.map((passenger, index) => (
                <li key={index}>
                  {passenger.name} (Age: {passenger.age})
                </li>
              ))}
            </ul>
            <p className="text-gray-800 italic mt-4">
              <strong>Instructions:</strong> {selectedRide.special_instructions}
            </p>
            <div className="mt-8 flex justify-end">
              <button
                onClick={closeModal}
                className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
