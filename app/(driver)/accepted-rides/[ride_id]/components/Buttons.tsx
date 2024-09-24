"use client";

import React from "react";

interface ButtonsProps {
  onStart: () => void;
  onEnd: () => void;
  rideStarted: boolean;
}

const Buttons: React.FC<ButtonsProps> = ({ onStart, onEnd, rideStarted }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
      <button
        onClick={onStart}
        disabled={rideStarted}
        className={`w-full py-3 px-4 rounded-md transition-colors duration-200 ${
          rideStarted
            ? "bg-gray-400 text-gray-200 cursor-not-allowed"
            : "bg-teal-600 text-white hover:bg-teal-700"
        }`}
      >
        {rideStarted ? "Ride Started" : "Start Ride"}
      </button>
      <button
        onClick={onEnd}
        disabled={!rideStarted}
        className={`w-full py-3 px-4 rounded-md transition-colors duration-200 ${
          rideStarted
            ? "bg-red-600 text-white hover:bg-red-700"
            : "bg-gray-400 text-gray-200 cursor-not-allowed"
        }`}
      >
        End Ride
      </button>
    </div>
  );
};

export default Buttons;
