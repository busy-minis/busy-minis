import React from "react";
import { format, addDays, compareAsc } from "date-fns";
import { MapPin, User, Clock } from "@phosphor-icons/react";

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
  distance: number | null;
  setPage: (page: number) => void;
}

function formatTime(time24: string): string {
  const [hours, minutes] = time24.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const hours12 = hours % 12 || 12;
  return `${hours12}:${minutes < 10 ? `0${minutes}` : minutes} ${period}`;
}

function getNextDate(pickupDate: string, day: string): Date {
  const daysOfWeekMap: { [key: string]: number } = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };

  const targetDay = daysOfWeekMap[day];
  const initialDate = new Date(pickupDate);
  const currentDay = initialDate.getDay();

  const dayDifference = (targetDay - currentDay + 7) % 7 || 7;
  return addDays(initialDate, dayDifference);
}

function formatDateWithDay(date: Date): string {
  return format(date, "EEEE, MMMM do");
}

export default function Review({
  formData,
  totalPrice,
  setPage,
  distance,
}: ReviewProps) {
  const formattedDays = formData.selectedDays
    .map((day) => {
      const date = getNextDate(formData.pickupDate, day);
      return { day, date, formatted: formatDateWithDay(date) };
    })
    .sort((a, b) => compareAsc(a.date, b.date));

  return (
    <div className="  rounded-2xl  space-y-8">
      <h2 className="text-4xl font-extrabold mb-8 text-teal-700 text-center">
        Review Your Booking
      </h2>

      {/* Pickup and Dropoff Information */}
      <div className="mb-8 border-b border-gray-200 pb-6">
        <h3 className="text-2xl font-bold text-gray-900 flex items-center">
          <MapPin size={28} className="text-teal-600 mr-3" />
          Pickup & Dropoff
        </h3>
        <div className="text-gray-700 space-y-3 mt-4">
          <p>
            <strong className="text-teal-700">Pickup Address:</strong>{" "}
            {formData.pickupAddress}
          </p>
          <p>
            <strong className="text-teal-700">Dropoff Address:</strong>{" "}
            {formData.dropoffAddress}
          </p>
          {distance !== null && (
            <p>
              <strong className="text-teal-700">Distance:</strong>{" "}
              {distance.toFixed(2)} miles
            </p>
          )}
        </div>
      </div>

      {/* Date & Time Information */}
      <div className="mb-8 border-b border-gray-200 pb-6">
        <h3 className="text-2xl font-bold text-gray-900 flex items-center">
          <Clock size={28} className="text-teal-600 mr-3" />
          Time & Days
        </h3>
        <p className="text-gray-700 mt-4">
          <strong className="text-teal-700">Pickup Time:</strong>{" "}
          {formatTime(formData.selectedTime)}
        </p>

        <div className="mt-6">
          <h4 className="text-xl font-semibold text-gray-900">Selected Days</h4>
          <ul className="text-gray-700 space-y-3 mt-4">
            {formattedDays.map(({ formatted }, index) => (
              <li
                key={index}
                className="p-4 bg-gradient-to-r from-teal-50 to-teal-100 rounded-lg shadow-md flex items-center justify-between"
              >
                <strong className="text-teal-900">{formatted}</strong>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Riders Information */}
      <div className="mb-8 border-b border-gray-200 pb-6">
        <h3 className="text-2xl font-bold text-gray-900 flex items-center">
          <User size={28} className="text-teal-600 mr-3" />
          Riders
        </h3>
        <div className="space-y-3 mt-4 text-gray-700">
          {formData.riders.map((rider: Rider, index: number) => (
            <p key={index}>
              <strong className="text-teal-700">Rider {index + 1}:</strong>{" "}
              {rider.name} (Age: {rider.age})
            </p>
          ))}
        </div>
      </div>

      {/* Total Price */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900">$ Total Price</h3>
        <p className="text-gray-700 mt-4">
          <strong className="text-teal-700">Final Price:</strong> $
          {totalPrice.toFixed(2)}
        </p>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between space-x-6">
        <button
          type="button"
          onClick={() => setPage(1)}
          className="w-1/2 px-6 py-3 bg-gray-400 text-white rounded-lg shadow-lg hover:bg-gray-500 transition duration-300"
        >
          Back
        </button>
        <button
          type="submit"
          className="w-1/2 px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-lg shadow-lg hover:from-orange-600 hover:to-yellow-600 transition duration-300"
        >
          Continue To Payment
        </button>
      </div>
    </div>
  );
}
