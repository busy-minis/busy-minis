"use client";
import { PencilSimple } from "@phosphor-icons/react";
import Link from "next/link";
import React from "react";

export default function WeeklyRides() {
  const handleManage = (id: number) => {
    // Logic to manage the weekly ride
    console.log(`Manage weekly ride with id: ${id}`);
  };
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
  return (
    <div>
      <h3 className="font-semibold text-2xl text-teal-700 mb-6">
        Weekly Rides
      </h3>
      {/* {weeklyRides.length > 0 ? (
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
        <></>
      )} */}
      <>
        <p>No Weekly rides booked.</p>
        <button className="bg-theme-orange mt-2 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-md">
          <Link href={"/schedule-ride/single-ride"}>Book a Weekly Ride</Link>
        </button>
      </>
    </div>
  );
}
