// components/Buttons.tsx
"use client";

import React from "react";

interface ButtonsProps {
  onStart: () => void;
  onEnd: () => void;
  rideStarted: boolean;
}

const Buttons: React.FC<ButtonsProps> = ({ onStart, onEnd, rideStarted }) => {
  return (
    <div className="flex justify-between items-center space-x-4">
      <button
        onClick={onStart} // Trigger the start ride confirmation
        disabled={rideStarted} // Disable if ride has started
        className={`w-full py-3 px-4 rounded-md transition-colors duration-200 ${
          rideStarted
            ? "bg-gray-400 text-gray-200 cursor-not-allowed"
            : "bg-teal-600 text-white hover:bg-teal-700"
        }`}
      >
        {rideStarted ? "Ride Started" : "Start Ride"}
      </button>
      <button
        onClick={onEnd} // Trigger the end ride confirmation
        disabled={!rideStarted} // Disable if ride hasn't started
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
