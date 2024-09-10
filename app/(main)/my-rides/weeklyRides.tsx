"use client";

import { PencilSimple, WarningCircle } from "@phosphor-icons/react";
import Link from "next/link";
import React, { useState } from "react";
import { format, isAfter } from "date-fns";

// Function to format time (24-hour to 12-hour AM/PM)
const formatTime = (time24: string) => {
  const [hours, minutes] = time24.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const hours12 = hours % 12 || 12; // Convert 0 to 12 for midnight and noon
  return `${hours12}:${minutes < 10 ? `0${minutes}` : minutes} ${period}`;
};

interface WeeklyRide {
  id: string;
  start_date: string;
  end_date?: string; // Optional end_date
  total_price: number;
  user_id: string;
  status: string;
  pickupAddress: string;
  dropoffAddress: string;
  pickupTime: string;
  riders: any; // Assuming riders as JSONB
  selectedDays: string[]; // Days selected for weekly rides
}

interface WeeklyRidesProps {
  user_id: string;
  weekly_rides: WeeklyRide[];
}

export default function WeeklyRides({
  user_id,
  weekly_rides,
}: WeeklyRidesProps) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedRideId, setSelectedRideId] = useState<string | null>(null);

  const handleManage = (id: string) => {
    setSelectedRideId(id);
    setShowModal(true);
  };

  const handleCancelRide = (id: string) => {
    // Logic to cancel the ride early
    console.log(`Cancelling weekly ride with id: ${id}`);
    setShowModal(false);
  };

  const handleExtendRide = (id: string) => {
    // Logic to extend the weekly ride
    console.log(`Extending weekly ride with id: ${id}`);
  };

  const currentDate = new Date();
  const placeholderEndDate = new Date(currentDate);
  placeholderEndDate.setDate(currentDate.getDate() + 5); // Add 5 days to the current date

  return (
    <div>
      <h3 className="font-semibold text-2xl text-teal-700 mb-6">
        Weekly Rides
      </h3>
      {weekly_rides.length > 0 ? (
        weekly_rides.map((weeklyRide) => {
          // Use placeholderEndDate if end_date is not available
          const rideEndDate =
            weeklyRide.end_date || placeholderEndDate.toISOString();
          const isRideDiscontinued = isAfter(
            currentDate,
            new Date(rideEndDate)
          );

          return (
            <div
              key={weeklyRide.id}
              className="p-6 mb-6 bg-white shadow-md rounded-lg relative"
            >
              {/* Ride discontinuation warning if end_date exists and the ride is discontinued */}
              {isRideDiscontinued && (
                <div className="flex items-center text-yellow-600 bg-yellow-100 p-3 rounded-lg mb-4">
                  <WarningCircle size={24} className="mr-2" />
                  <p>
                    This weekly ride has been discontinued. Payment is required
                    to continue.
                  </p>
                  <button
                    onClick={() => handleExtendRide(weeklyRide.id)}
                    className="ml-auto bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition duration-300"
                  >
                    Extend Ride
                  </button>
                </div>
              )}

              <h4 className="font-bold text-lg text-gray-900">
                Week of {format(new Date(weeklyRide.start_date), "MMMM do")} to{" "}
                {format(new Date(rideEndDate), "MMMM do")}
              </h4>

              <ul className="mt-4 text-gray-600">
                <li className="mb-3">
                  <strong>Pickup Address:</strong> {weeklyRide.pickupAddress}
                </li>
                <li className="mb-3">
                  <strong>Dropoff Address:</strong> {weeklyRide.dropoffAddress}
                </li>
                <li className="mb-3">
                  <strong>Pickup Time:</strong>{" "}
                  {formatTime(weeklyRide.pickupTime)}
                </li>
                <li className="mb-3">
                  <strong>Selected Days:</strong>{" "}
                  {weeklyRide.selectedDays.join(", ")}
                </li>
                <li className="mb-3">
                  <strong>Riders:</strong>{" "}
                  {weeklyRide.riders.map((rider: any) => rider.name).join(", ")}
                </li>
              </ul>

              <button
                className="mt-4 flex items-center bg-teal-500 text-white px-4 py-2 rounded-full hover:bg-teal-600 transition duration-300"
                onClick={() => handleManage(weeklyRide.id)}
              >
                <PencilSimple size={20} className="mr-2" />
                Cancel WeeklyRide
              </button>

              {/* Cancel Ride Modal */}
              {showModal && selectedRideId === weeklyRide.id && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                    <h2 className="text-lg font-semibold mb-4">
                      Cancel Weekly Ride
                    </h2>
                    <p>Are you sure you want to cancel this weekly ride?</p>
                    <div className="mt-6 flex justify-end space-x-4">
                      <button
                        className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                        onClick={() => setShowModal(false)}
                      >
                        No
                      </button>
                      <button
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        onClick={() => handleCancelRide(weeklyRide.id)}
                      >
                        Yes, Cancel Ride
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })
      ) : (
        <p>No weekly rides booked.</p>
      )}

      <div className="mt-4">
        <Link href="/schedule-ride/weekly-ride">
          <div className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-all duration-200 shadow-md">
            Book a Weekly Ride
          </div>
        </Link>
      </div>
    </div>
  );
}
