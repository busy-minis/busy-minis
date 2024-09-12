import React from "react";

export default function Buttons({
  setShowModal,
  rideStarted,
  endRideHandler,
}: any) {
  return (
    <div className="flex justify-between items-center space-x-4">
      <button
        onClick={() => setShowModal(true)} // Open the modal
        disabled={rideStarted} // Disable the button if the ride is already started
        className={`w-full py-3 px-4 rounded-md transition-colors duration-200 ${
          rideStarted
            ? "bg-gray-400 text-gray-200 cursor-not-allowed"
            : "bg-teal-600 text-white hover:bg-teal-700"
        }`}
      >
        {rideStarted ? "Ride Started" : "Start Ride"}
      </button>
      <button
        onClick={endRideHandler}
        disabled={!rideStarted} // Disable the button if the ride hasn't started
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
}
