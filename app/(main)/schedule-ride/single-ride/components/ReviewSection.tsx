import { ArrowLeft } from "@phosphor-icons/react";
import React from "react";

function formatTime(time24: string): string {
  const [hours, minutes] = time24.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const hours12 = hours % 12 || 12;
  return `${hours12}:${minutes < 10 ? `0${minutes}` : minutes} ${period}`;
}

interface Stop {
  address: string;
  lat?: number;
  lng?: number;
}

interface Rider {
  name: string;
  age: string;
}

interface FormData {
  pickupDate: string;
  pickupTime: string;
  pickupAddress: string;
  dropoffAddress: string;
  riders: Rider[];
  stops: Stop[];
}

interface ReviewSectionProps {
  formData: FormData;
  totalPrice: number;
  setStep: (step: number) => void;
  distance: number | null;
}

export default function ReviewSection({
  formData,
  totalPrice,
  setStep,
  distance,
}: ReviewSectionProps) {
  return (
    <>
      <div className="flex items-center mb-8">
        <div className="bg-orange-500 grid place-content-center text-sm w-8 h-8 rounded-full text-white">
          3
        </div>
        <p className="font-semibold text-lg ml-2">Review Your Ride Details</p>
      </div>

      <section className="mb-6 p-2   md:p-6 bg-white shadow-lg rounded-lg">
        {/* Riders Information */}
        <h4 className="font-semibold text-xl text-teal-700 mb-4">
          Riders Information
        </h4>
        <ul className="list-disc list-inside mb-6">
          {formData.riders.map((rider, index) => (
            <li key={index} className="text-gray-700">
              <span className="font-medium text-gray-900">{rider.name}</span>,{" "}
              {rider.age} years old
            </li>
          ))}
        </ul>

        {/* Ride Details */}
        <h4 className="font-semibold text-xl text-teal-700 mb-4">
          Ride Details
        </h4>
        <div className="bg-gray-100 p-4 rounded-lg shadow-sm mb-6">
          {/* Pickup Date and Time */}
          <div className="mb-4">
            <p className="text-gray-600">
              <span className="font-medium text-teal-700">Pickup Date:</span>{" "}
              {formData.pickupDate}
            </p>
            <p className="text-gray-600">
              <span className="font-medium text-teal-700">Pickup Time:</span>{" "}
              {formatTime(formData.pickupTime)}
            </p>
          </div>

          {/* Route */}
          <h5 className="font-semibold text-lg text-teal-700 mt-2">Route</h5>
          <ol className="list-decimal list-inside text-gray-800 mt-2 space-y-2">
            <li>
              <span className="font-medium text-gray-900">Pickup Address:</span>{" "}
              {formData.pickupAddress}
            </li>
            {formData.stops && formData.stops.length > 0 && (
              <>
                {formData.stops.map((stop, index) => (
                  <li key={index + 1}>
                    <span className="font-medium text-gray-900">
                      Stop {index + 1}:
                    </span>{" "}
                    {stop.address}
                  </li>
                ))}
              </>
            )}
            <li>
              <span className="font-medium text-gray-900">
                Dropoff Address:
              </span>{" "}
              {formData.dropoffAddress}
            </li>
          </ol>
        </div>

        {/* Distance Display */}
        {distance !== null && (
          <div className="bg-teal-50 p-4 rounded-lg shadow-md mb-4">
            <p className="text-gray-600">
              <span className="font-medium text-teal-700">Total Distance:</span>{" "}
              {distance.toFixed(2)} miles
            </p>
          </div>
        )}

        {/* Final Cost */}
        <div className="bg-teal-100 p-4 rounded-lg shadow-md">
          <h4 className="font-semibold text-lg text-teal-700 mb-2">
            Total Cost: ${totalPrice.toFixed(2)}
          </h4>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <button
            type="button"
            className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg shadow-md hover:shadow-lg transition-transform duration-200 ease-in-out transform hover:-translate-y-1 mr-2 flex justify-center items-center"
            onClick={() => setStep(2)}
          >
            <ArrowLeft size={24} className="mr-2" />
            Back
          </button>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-lg shadow-md hover:shadow-lg transition-transform duration-200 ease-in-out transform hover:-translate-y-1 ml-2 flex justify-center items-center"
          >
            Continue to Payment
          </button>
        </div>
      </section>
    </>
  );
}
