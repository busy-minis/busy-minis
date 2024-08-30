"use client";
import React, { useState, useEffect } from "react";
import { MapPin, Clock, Car, User } from "@phosphor-icons/react";
import Footer from "@/app/components/ui/Footer";

// Dummy Data
const rideData = {
  rideId: "Ride1234",
  pickupAddress: "123 Main St, Springfield",
  dropoffAddress: "456 Oak St, Springfield",
  pickupTime: "2:00 PM",
  dropoffTime: "3:00 PM",
  eta: "2:45 PM",
  driverName: "John Doe",
  driverVehicle: "Blue Honda Odyssey",
  passengers: [
    { name: "Alice Smith", age: 8 },
    { name: "Bob Johnson", age: 10 },
  ],
};

export default function RideTrackingPage() {
  const [progress, setProgress] = useState(30); // Simulated progress as a percentage
  const [eta, setEta] = useState(rideData.eta);

  useEffect(() => {
    // Simulating ETA updates (this could be connected to real-time tracking APIs)
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) return 100;
        return prevProgress + 5; // Simulate ride progress
      });

      // Update ETA as the progress increases
      if (progress >= 90) setEta("Arriving soon");
    }, 3000);

    return () => clearInterval(interval);
  }, [progress]);

  return (
    <section className="bg-zinc-200 min-h-screen">
      <div className="max-w-4xl mx-auto py-12 px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-teal-900 text-center mb-8">
          Ride Tracking
        </h1>

        <div className="bg-white shadow-md rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-semibold text-teal-900 mb-4">
            Ride Details
          </h2>

          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-4">
              <MapPin size={24} className="text-teal-600" />
              <div>
                <p className="text-gray-700">Pickup:</p>
                <p className="text-lg font-semibold text-gray-900">
                  {rideData.pickupAddress}
                </p>
                <p className="text-gray-600">
                  Pickup Time: {rideData.pickupTime}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <MapPin size={24} className="text-teal-600" />
              <div>
                <p className="text-gray-700">Dropoff:</p>
                <p className="text-lg font-semibold text-gray-900">
                  {rideData.dropoffAddress}
                </p>
                <p className="text-gray-600">
                  Estimated Dropoff Time: {rideData.dropoffTime}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Clock size={24} className="text-teal-600" />
              <div>
                <p className="text-gray-700">
                  Estimated Time of Arrival (ETA):
                </p>
                <p className="text-lg font-semibold text-gray-900">{eta}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Car size={24} className="text-teal-600" />
              <div>
                <p className="text-gray-700">Driver:</p>
                <p className="text-lg font-semibold text-gray-900">
                  {rideData.driverName}
                </p>
                <p className="text-gray-600">
                  Vehicle: {rideData.driverVehicle}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Passengers Section */}
        <div className="bg-white shadow-md rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-semibold text-teal-900 mb-4">
            Passengers
          </h2>
          <div className="space-y-4">
            {rideData.passengers.map((passenger, index) => (
              <div key={index} className="flex items-center space-x-4">
                <User size={24} className="text-teal-600" />
                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    {passenger.name}
                  </p>
                  <p className="text-gray-600">Age: {passenger.age}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Tracking Section */}
        <div className="bg-white shadow-md rounded-xl p-8">
          <h2 className="text-2xl font-semibold text-teal-900 mb-4">
            Live Tracking
          </h2>
          <div className="relative pt-1">
            <p className="text-gray-700 mb-4">Ride Progress:</p>
            <div className="overflow-hidden h-4 text-xs flex rounded bg-teal-200">
              <div
                style={{ width: `${progress}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-teal-600"
              ></div>
            </div>
            <p className="mt-4 text-gray-600">
              {progress < 100
                ? `Ride in Progress - ${progress}% completed`
                : "Ride Complete"}
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </section>
  );
}
