import React from "react";
import { format, addDays, compareAsc } from "date-fns";
import { MapPin, User, Clock, MapPinLine } from "@phosphor-icons/react";

interface Rider {
  name: string;
  age: string;
}

interface Stop {
  address: string;
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
  renewal_date: string;
  stops: Stop[];
  dropoffAddress: string;
  dropoffLat?: number;
  dropoffLng?: number;
  riders: Rider[];
}

interface ReviewProps {
  formData: FormData;
  totalPrice: number;
  regularPrice: number;
  savings: number;
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
  regularPrice,
  savings,
}: ReviewProps) {
  const formattedDays = formData.selectedDays
    .map((day) => {
      const date = getNextDate(formData.pickupDate, day);
      return { day, date, formatted: formatDateWithDay(date) };
    })
    .sort((a, b) => compareAsc(a.date, b.date));

  return (
    <div className="rounded-2xl space-y-8 bg-white p-2 md:p-8 shadow-lg">
      <h2 className="text-3xl font-bold mb-8 text-black text-center">
        Review Your Booking
      </h2>

      {/* Trip Details */}
      <div className="mb-8 border-b border-gray-300 pb-6">
        <h3 className="text-2xl font-semibold text-black flex items-center">
          <MapPinLine size={28} className="text-black mr-3" />
          Trip Details
        </h3>
        <div className="text-gray-800 space-y-3 mt-4">
          {/* Pickup Address */}
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <MapPin size={24} className="text-green-500 mt-1" />
            </div>
            <div className="ml-3">
              <p className="font-medium text-black">Pickup Address</p>
              <p>{formData.pickupAddress}</p>
            </div>
          </div>

          {/* Stops */}
          {formData.stops && formData.stops.length > 0 && (
            <>
              {formData.stops.map((stop, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0">
                    <MapPin size={24} className="text-yellow-500 mt-1" />
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-black">Stop {index + 1}</p>
                    <p>{stop.address}</p>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* Dropoff Address */}
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <MapPin size={24} className="text-red-500 mt-1" />
            </div>
            <div className="ml-3">
              <p className="font-medium text-black">Dropoff Address</p>
              <p>{formData.dropoffAddress}</p>
            </div>
          </div>

          {/* Distance */}
          {distance !== null && (
            <p className="mt-4">
              <strong className="text-black">Estimated Distance:</strong>{" "}
              {distance.toFixed(2)} miles
            </p>
          )}
        </div>
      </div>

      {/* Schedule */}
      <div className="mb-8 border-b border-gray-300 pb-6">
        <h3 className="text-2xl font-semibold text-black flex items-center">
          <Clock size={28} className="text-black mr-3" />
          Schedule
        </h3>
        <p className="text-gray-800 mt-4">
          <strong className="text-black">Pickup Time:</strong>{" "}
          {formatTime(formData.selectedTime)}
        </p>

        {/* Selected Days */}
        <div className="mt-6">
          <h4 className="text-xl font-semibold text-black">Selected Days</h4>
          <ul className="text-gray-800 space-y-3 mt-4">
            {formattedDays.map(({ formatted }, index) => (
              <li
                key={index}
                className="p-4 bg-gray-100 rounded-lg shadow-sm flex items-center justify-between"
              >
                <strong className="text-black">{formatted}</strong>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Riders */}
      <div className="mb-8 border-b border-gray-300 pb-6">
        <h3 className="text-2xl font-semibold text-black flex items-center">
          <User size={28} className="text-black mr-3" />
          Riders
        </h3>
        <div className="space-y-3 mt-4 text-gray-800">
          {formData.riders.map((rider: Rider, index: number) => (
            <p key={index}>
              <strong className="text-black">Rider {index + 1}:</strong>{" "}
              {rider.name} (Age: {rider.age})
            </p>
          ))}
        </div>
      </div>
      <div className="mb-8">
        <h3 className="text-2xl font-semibold text-black">Renewal Date</h3>
        <p className="text-gray-800 mt-4">
          Your weekly ride subscription will renew on:{" "}
          <strong className="text-black">{formData.renewal_date}</strong>
        </p>
        <p className="text-gray-700 mt-2">
          You will have the option to renew your weekly ride on this date.
        </p>
      </div>

      {/* Total Price */}
      <div className="mb-8">
        <h3 className="text-2xl font-semibold text-black">Total Price</h3>

        <p className="text-gray-800 mt-4">
          <strong className="text-black">Total Price</strong>{" "}
          <span className=" line-through text-red-600 ">
            ${regularPrice.toFixed(2)}
          </span>
          $<strong>{totalPrice.toFixed(2)}</strong>
        </p>

        {/* <p className="text-green-600 mt-2 text-lg font-semibold">
          You save: ${savings.toFixed(2)} by booking weekly rides!
        </p> */}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between space-x-6">
        <button
          type="button"
          onClick={() => setPage(1)}
          className="w-1/2 px-6 py-3 bg-gray-200 text-black rounded-lg shadow hover:bg-gray-300 transition duration-300"
        >
          Back
        </button>
        <button
          type="submit"
          className="w-1/2 px-6 py-3 bg-black text-white rounded-lg shadow hover:bg-gray-800 transition duration-300"
        >
          Continue To Payment
        </button>
      </div>
    </div>
  );
}
