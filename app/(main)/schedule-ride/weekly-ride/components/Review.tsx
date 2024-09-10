import React from "react";
import { format } from "date-fns"; // date-fns is great for date/time formatting

interface Rider {
  name: string;
  age: string;
}

interface FormData {
  user_id: string;
  status: string;
  pickupDate: string;
  selectedTime: string;
  selectedDays: string[];
  pickupAddress: string;
  pickupLat?: number;
  pickupLng?: number;
  dropoffAddress: string;
  dropoffLat?: number;
  dropoffLng?: number;
  riders: Rider[];
}

interface ReviewProps {
  formData: FormData;
  totalPrice: number;
  setPage: (page: number) => void;
}

// Utility function to format 24-hour time to 12-hour format with AM/PM
function formatTime(time24: string): string {
  const [hours, minutes] = time24.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const hours12 = hours % 12 || 12; // Convert 0 to 12 for 12 AM and PM
  return `${hours12}:${minutes < 10 ? `0${minutes}` : minutes} ${period}`;
}

export default function Review({ formData, totalPrice, setPage }: ReviewProps) {
  return (
    <div className="bg-white shadow-md rounded-lg p-8">
      <h2 className="text-3xl font-bold mb-6 text-teal-700 text-center">
        Review Your Booking
      </h2>

      {/* Pickup and Dropoff Information */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800">
          Pickup & Dropoff
        </h3>
        <p className="text-gray-700">
          <strong>Pickup Address:</strong> {formData.pickupAddress}
        </p>
        <p className="text-gray-700">
          <strong>Dropoff Address:</strong> {formData.dropoffAddress}
        </p>
      </div>

      {/* Date & Time Information */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Time</h3>
        <p className="text-gray-700">
          <strong>Pickup Time:</strong> {formatTime(formData.selectedTime)}
        </p>
      </div>

      {/* Selected Days */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Selected Days</h3>
        <p className="text-gray-700">
          <strong>Days:</strong> {formData.selectedDays.join(", ")}
        </p>
      </div>

      {/* Riders Information */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Riders</h3>
        {formData.riders.map((rider: Rider, index: number) => (
          <div key={index} className="text-gray-700">
            <p>
              <strong>Rider {index + 1}:</strong> {rider.name} (Age: {rider.age}
              )
            </p>
          </div>
        ))}
      </div>

      {/* Total Price */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Total Price</h3>
        <p className="text-gray-700">
          <strong>Final Price:</strong> ${totalPrice.toFixed(2)}
        </p>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6 space-x-4">
        <button
          type="button"
          onClick={() => setPage(1)}
          className="w-1/2 px-4 py-3 bg-gray-500 text-white rounded-lg shadow-lg hover:bg-gray-600 transition duration-200 ease-in-out"
        >
          Back
        </button>
        <button
          type="submit"
          className="w-1/2 px-4 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-lg shadow-lg hover:from-orange-600 hover:to-yellow-600 transition duration-200 ease-in-out"
        >
          Continue To Payment
        </button>
      </div>
    </div>
  );
}
