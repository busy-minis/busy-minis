"use client";
import React from "react";
import { NavBar } from "../components/ui/NavBar";

export default function page() {
  const rides = 0;
  const scheduleARide = () => {
    // TODO: Implement
  };
  return (
    <div className="">
      <NavBar />
      <div className="flex text-xl justify-around py-8 border-b-2 ">
        <p>Rides</p>
        <p>Schedule A Ride</p>
        <p>Ride History</p>
        <p>Settings</p>
        <p>Help Center</p>
      </div>

      <div className="grid place-content-center py-48">
        <Ride />
        You have no scheduled rides at this time
      </div>
    </div>
  );
}

const Ride = () => {
  return (
    <div className="flex gap-8 items-center justify-between border-2 rounded-lg p-4">
      <div>
        <p>From: </p>
        <p>263 Sedgewick Trail</p>
      </div>
      <div>
        <p>To: </p>
        <p>123 Main Street</p>
      </div>
      <div>
        <p>Time</p>
        <p> 1:45 pm EST </p>
      </div>
      <button className="bg-red-800 text-white uppercase font-semibold px-4 py-1 ">
        Change Details
      </button>
      <button className="bg-red-800 text-white uppercase font-semibold px-4 py-1 ">
        Cancel Ride
      </button>
    </div>
  );
};
