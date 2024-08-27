"use client";
import React from "react";
import { Trash, PencilSimple, CalendarPlus, Eye } from "@phosphor-icons/react";
import Footer from "@/app/components/ui/Footer";
import Link from "next/link";

export default function MyRides() {
  const singleRides = [
    {
      id: 1,
      date: "August 27, 2024",
      time: "3:00 PM",
      pickup: "123 Main St, Springfield",
      dropOff: "456 Elm St, Springfield",
      status: "Scheduled",
    },
    {
      id: 2,
      date: "August 28, 2024",
      time: "4:00 PM",
      pickup: "789 Maple St, Springfield",
      dropOff: "101 Oak St, Springfield",
      status: "Scheduled",
    },
  ];

  const weeklyRides = [
    {
      id: 1,
      weekStart: "August 26, 2024",
      weekEnd: "September 1, 2024",
      rides: [
        { date: "August 26, 2024", time: "8:00 AM", pickup: "123 Main St" },
        { date: "August 27, 2024", time: "8:00 AM", pickup: "123 Main St" },
        { date: "August 28, 2024", time: "8:00 AM", pickup: "123 Main St" },
      ],
    },
  ];

  const handleCancel = (id: number) => {
    // Logic to cancel the single ride
    console.log(`Cancel ride with id: ${id}`);
  };

  const handleManage = (id: number) => {
    // Logic to manage the weekly ride
    console.log(`Manage weekly ride with id: ${id}`);
  };

  return (
    <div className="relative ">
      {/* Background Decorations */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-teal-200 to-white opacity-80"></div>
        <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-t from-orange-100 to-white opacity-80"></div>
      </div>

      <section className="relative pt-24  pb-16 lg:pb-32">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="font-semibold text-xl text-teal-600 mb-2 block">
              My Rides
            </span>
            <h2 className="font-bold text-4xl sm:text-5xl text-gray-900 mb-6">
              Your Booked Rides
            </h2>
            <p className="text-lg max-w-2xl mx-auto text-gray-600">
              Manage and review your booked rides, both single rides and weekly
              rides. You can cancel individual rides or manage your weekly
              rides, adjusting pickup times and dates.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Single Rides Section */}
            <div>
              <h3 className="font-semibold text-2xl text-teal-700 mb-6">
                Single Rides
              </h3>
              {singleRides.length > 0 ? (
                singleRides.map((ride) => (
                  <div
                    key={ride.id}
                    className="p-6 mb-6 bg-white shadow-md rounded-lg flex justify-between items-center"
                  >
                    <div>
                      <h4 className="font-bold text-lg text-gray-900">
                        {ride.date} - {ride.time}
                      </h4>
                      <p className="text-gray-600">
                        Pickup: {ride.pickup} <br />
                        Drop-off: {ride.dropOff}
                      </p>
                      <div
                        className={`mt-2 font-semibold text-${
                          ride.status === "Scheduled" ? "teal-600" : "gray-500"
                        }`}
                      >
                        Status: {ride.status}
                      </div>
                      <p className="text-red-500">
                        Waiting for driver confirmation
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Link href={"/my-rides/ride"}>
                        <button
                          className="flex items-center bg-theme-orange text-white px-4 py-2 rounded-full hover:bg-red-600 transition duration-300"
                          onClick={() => handleCancel(ride.id)}
                        >
                          <Eye size={20} className="mr-2" />
                          View Ride
                        </button>
                      </Link>
                      <button
                        className="flex items-center bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition duration-300"
                        onClick={() => handleCancel(ride.id)}
                      >
                        <Trash size={20} className="mr-2" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p>No single rides booked.</p>
              )}
            </div>

            {/* Weekly Rides Section */}
            <div>
              <h3 className="font-semibold text-2xl text-teal-700 mb-6">
                Weekly Rides
              </h3>
              {weeklyRides.length > 0 ? (
                weeklyRides.map((weeklyRide) => (
                  <div
                    key={weeklyRide.id}
                    className="p-6 mb-6 bg-white shadow-md rounded-lg"
                  >
                    <h4 className="font-bold text-lg text-gray-900">
                      Week of {weeklyRide.weekStart} to {weeklyRide.weekEnd}
                    </h4>
                    <ul className="mt-4 text-gray-600">
                      {weeklyRide.rides.map((ride, index) => (
                        <li key={index} className="mb-3">
                          <strong>{ride.date}</strong> - {ride.time} <br />
                          Pickup: {ride.pickup}
                        </li>
                      ))}
                    </ul>
                    <button
                      className="mt-4 flex items-center bg-teal-500 text-white px-4 py-2 rounded-full hover:bg-teal-600 transition duration-300"
                      onClick={() => handleManage(weeklyRide.id)}
                    >
                      <PencilSimple size={20} className="mr-2" />
                      Manage Weekly Ride
                    </button>
                  </div>
                ))
              ) : (
                <p>No weekly rides booked.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
