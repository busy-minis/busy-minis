import React from "react";

export default function Modal({ setShowModal, startRideHandler }: any) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg w-full">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Confirm Start Ride
        </h3>
        <p className="text-gray-700">
          Please make sure you are at the pickup location before starting the
          ride.
        </p>
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={() => setShowModal(false)} // Close the modal
            className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={startRideHandler}
            className="bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors duration-200"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
