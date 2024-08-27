"use client";

import { MapPin, Calendar, Clock } from "@phosphor-icons/react";
import React from "react";
import Link from "next/link";

export default function Page() {
  return (
    <section className="p-4 sm:p-6 md:p-10 bg-gray-100 min-h-screen">
      <div className="space-y-10 max-w-7xl mx-auto">
        <HeaderSection />

        <div className="grid grid-cols-1 gap-8 md:gap-12 md:grid-cols-2">
          {/* Single Rides Section */}
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Single Rides
            </h2>
            {dummyRides.length > 0 ? (
              dummyRides.map((ride) => <RideCard key={ride.id} ride={ride} />)
            ) : (
              <NoRidesFound />
            )}
          </div>

          {/* Weekly Rides Section */}
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Weekly Rides
            </h2>
            {weeklyRides.length > 0 ? (
              weeklyRides.map((ride) => (
                <WeeklyRideCard key={ride.id} ride={ride} />
              ))
            ) : (
              <NoRidesFound />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// Header Section
const HeaderSection = () => {
  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between border-b pb-4 mb-6">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800">
        Your Trips
      </h1>
      <div className="flex flex-col sm:flex-row sm:space-x-4 mt-4 lg:mt-0 w-full sm:w-auto">
        <button className="w-full sm:w-auto bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold rounded-lg py-3 px-6 shadow-md hover:from-teal-600 hover:to-teal-700 transition ease-in-out duration-300">
          Schedule a New Ride
        </button>
        <button className="w-full sm:w-auto bg-gradient-to-r from-gray-800 to-gray-900 text-white font-semibold rounded-lg py-3 px-6 mt-4 sm:mt-0 shadow-md hover:from-gray-700 hover:to-gray-800 transition ease-in-out duration-300">
          View Ride History
        </button>
      </div>
    </div>
  );
};

// Ride Card Component for Single Rides
const RideCard = ({ ride }: { ride: Ride }) => {
  return (
    <div className="p-4 sm:p-6 bg-gradient-to-br from-teal-700 via-teal-800 to-teal-950 text-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-300">
      <div className="flex items-center space-x-4 sm:space-x-6">
        <MapPin size={30} weight="fill" className="text-teal-200" />
        <div>
          <h3 className="text-lg sm:text-xl font-semibold">{ride.address}</h3>
          <div className="flex space-x-4 text-sm mt-2">
            <div className="flex items-center space-x-1">
              <Calendar size={18} />
              <span>{ride.date}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock size={18} />
              <span>{ride.time}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row sm:justify-between items-center gap-2">
        {ride.status === "awaiting_driver_confirmation" && (
          <StatusBadge status="Awaiting Driver Confirmation" color="yellow" />
        )}

        <ActionButtons rideId={ride.id} />
      </div>
    </div>
  );
};

// Weekly Ride Card Component
const WeeklyRideCard = ({ ride }: { ride: WeeklyRide }) => {
  return (
    <div className="p-4 sm:p-6 bg-gradient-to-br from-gray-700 via-gray-800 to-black text-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
      <h3 className="text-xl sm:text-2xl font-bold">Weekly Ride</h3>
      <p className="mt-4 text-lg font-semibold">Pickup: {ride.address}</p>
      <p className="mt-2 text-sm sm:text-base">
        Ride Days: {ride.days.join(", ")}
      </p>

      <div className="mt-6 flex flex-col sm:flex-row gap-2">
        {ride.status === "awaiting_driver_confirmation" && (
          <StatusBadge status="Awaiting Driver Confirmation" color="yellow" />
        )}
        <Link href={`/dashboard/ride/${ride.id}`}>
          <button className="w-full sm:w-auto bg-white text-gray-900 font-semibold rounded-lg py-2 px-6 shadow-md hover:bg-gray-200 transition ease-in-out duration-300">
            Manage Ride
          </button>
        </Link>
      </div>
    </div>
  );
};

// No Rides Found Component
const NoRidesFound = () => (
  <div className="p-6 sm:p-8 text-center bg-white border border-gray-200 rounded-lg shadow-md">
    <p className="text-lg sm:text-xl text-gray-600">
      No scheduled rides at this time.
    </p>
    <Link href="/book">
      <button className="mt-4 sm:mt-6 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold rounded-lg py-3 px-6 shadow-md hover:from-teal-600 hover:to-teal-700 transition ease-in-out duration-300">
        Schedule A Ride
      </button>
    </Link>
  </div>
);

// Status Badge Component
const StatusBadge = ({
  status,
  color,
}: {
  status: string;
  color: "yellow" | "red";
}) => {
  const colorClasses = {
    yellow: "bg-yellow-400 text-white",
    red: "bg-red-600 text-white",
  };

  return (
    <div
      className={`text-sm sm:text-base font-semibold w-full sm:w-auto text-center py-2 px-4 rounded-lg shadow ${colorClasses[color]}`}
    >
      {status}
    </div>
  );
};

// Action Buttons Component
const ActionButtons = ({ rideId }: { rideId: string }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
      <Link href={`/dashboard/ride/${rideId}`}>
        <button className="w-full sm:w-auto bg-teal-500 text-white font-semibold rounded-lg py-2 px-6 shadow-md hover:bg-teal-600 transition ease-in-out duration-300">
          View Details
        </button>
      </Link>
      <button className="w-full sm:w-auto bg-red-600 text-white font-semibold rounded-lg py-2 px-6 shadow-md hover:bg-red-700 transition ease-in-out duration-300">
        Cancel Ride
      </button>
    </div>
  );
};

// Dummy Ride Data (Single Rides)
type Ride = {
  id: string;
  date: string;
  time: string;
  address: string;
  status?: string;
};

const dummyRides: Ride[] = [
  {
    id: "1",
    date: "August 17th",
    time: "1:45 PM",
    address: "263 Sedgewick Trail",
    status: "awaiting_driver_confirmation",
  },
  {
    id: "2",
    date: "August 18th",
    time: "2:00 PM",
    address: "456 Elm Street",
  },
  {
    id: "3",
    date: "August 20th",
    time: "3:15 PM",
    address: "789 Oak Avenue",
  },
];

// Dummy Weekly Ride Data
type WeeklyRide = {
  id: string;
  address: string;
  days: string[];
  status?: string;
};

const weeklyRides: WeeklyRide[] = [
  {
    id: "4",
    address: "101 Pine Street",
    days: ["Monday", "Wednesday", "Friday"],
    status: "awaiting_driver_confirmation",
  },
  {
    id: "5",
    address: "202 Cedar Road",
    days: ["Tuesday", "Thursday"],
  },
];
