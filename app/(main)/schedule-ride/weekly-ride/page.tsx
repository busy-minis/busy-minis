"use client";
import React, { useState } from "react";
import Footer from "@/app/components/ui/Footer";
import {
  CalendarCheck,
  UserPlus,
  UserMinus,
  MapPin,
  Clock,
  Car,
  Info,
} from "@phosphor-icons/react";

export default function WeeklyRideBookingPage() {
  const [passengers, setPassengers] = useState([{ name: "", age: "" }]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [pickupAddress, setPickupAddress] = useState("");
  const [dropoffAddress, setDropoffAddress] = useState("");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [dateError, setDateError] = useState("");
  const [timeWarning, setTimeWarning] = useState("");

  const today = new Date().toISOString().split("T")[0];
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const currentDay = new Date().toLocaleDateString("en-US", {
    weekday: "long",
  });

  const addPassenger = () => {
    setPassengers([...passengers, { name: "", age: "" }]);
  };

  const removePassenger = (index: number) => {
    setPassengers(passengers.filter((_, i) => i !== index));
  };

  const handleDaySelection = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day)
        ? prev.filter((selectedDay) => selectedDay !== day)
        : [...prev, day]
    );
  };

  const handleTimeChange = (time: string) => {
    setSelectedTime(time);

    const [hours] = time.split(":").map(Number);
    if (hours < 8 || hours > 18) {
      setTimeWarning(
        "Selecting an off-peak time (before 8 AM or after 6 PM) will incur an additional fee."
      );
    } else {
      setTimeWarning("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selected = new Date(selectedDate);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (selected < tomorrow) {
      setDateError("The start date must be at least one day after today.");
      return;
    }

    if (
      !selectedDate ||
      !selectedTime ||
      !pickupAddress ||
      !dropoffAddress ||
      passengers.some((p) => p.name === "" || p.age === "") ||
      selectedDays.length === 0
    ) {
      alert("Please fill out all fields and select at least one day.");
    } else {
      alert(
        `Weekly Ride Booked!\n\nDate: ${selectedDate}\nTime: ${selectedTime}\nPickup: ${pickupAddress}\nDropoff: ${dropoffAddress}\nPassengers: ${passengers
          .map((p) => `${p.name} (Age: ${p.age})`)
          .join(", ")}\nDays: ${selectedDays.join(", ")}`
      );
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-teal-50 to-teal-100">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-teal-400 to-teal-100 opacity-70"></div>
        <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-t from-orange-200 to-yellow-100 opacity-70"></div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-24 pb-12">
        <div className="container mx-auto px-6 text-center">
          <CalendarCheck size={64} className="text-teal-600 mx-auto mb-4" />
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
            Schedule Your Weekly Ride
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Simplify your commute by booking a weekly ride. Select passengers,
            pick-up and drop-off points, and your preferred days.
          </p>
          <p className="text-md text-gray-500">
            <Info size={20} className="inline text-teal-600" /> Weekly rides
            will not be booked on the same day and will start on the next
            calendar day.
          </p>
          <Car size={48} className="text-teal-600 mx-auto mb-4 mt-6" />
        </div>
      </section>

      {/* Booking Form */}
      <section className="relative pb-20 lg:pb-36">
        <div className="container mx-auto px-6">
          <form
            onSubmit={handleSubmit}
            className="max-w-3xl mx-auto bg-white p-10 rounded-xl shadow-xl space-y-10"
          >
            {/* Passengers Card */}
            <div className="bg-gray-50 p-6 rounded-xl shadow-md">
              <h4 className="text-2xl font-semibold text-teal-900 mb-6 flex items-center">
                <UserPlus size={28} className="mr-2 text-teal-600" /> Add
                Passengers
              </h4>
              {passengers.map((passenger, index) => (
                <div key={index} className="grid grid-cols-5 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder={`Passenger ${index + 1} Name`}
                    value={passenger.name}
                    onChange={(e) => {
                      const newPassengers = [...passengers];
                      newPassengers[index].name = e.target.value;
                      setPassengers(newPassengers);
                    }}
                    className="col-span-3 p-3 border border-gray-300 rounded-lg focus:ring-teal-600 focus:border-teal-600"
                  />
                  <input
                    type="number"
                    placeholder="Age"
                    value={passenger.age}
                    onChange={(e) => {
                      const newPassengers = [...passengers];
                      newPassengers[index].age = e.target.value;
                      setPassengers(newPassengers);
                    }}
                    className="col-span-1 p-3 border border-gray-300 rounded-lg focus:ring-teal-600 focus:border-teal-600"
                  />
                  {passengers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePassenger(index)}
                      className="col-span-1 bg-red-500 text-white p-2 rounded-lg shadow hover:bg-red-600 transition"
                    >
                      <UserMinus size={24} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addPassenger}
                className="mt-4 bg-teal-600 text-white px-4 py-2 rounded-lg shadow hover:bg-teal-700 transition inline-flex items-center"
              >
                <UserPlus size={20} className="mr-2" /> Add Passenger
              </button>
              {passengers.length > 1 && (
                <p className="mt-4 text-sm text-yellow-600">
                  <Info size={16} className="inline" /> Adding more than one
                  passenger will incur an additional fee.
                </p>
              )}
            </div>

            {/* Pickup and Dropoff Card */}
            <div className="bg-gray-50 p-6 rounded-xl shadow-md">
              <h4 className="text-2xl font-semibold text-teal-900 mb-6 flex items-center">
                <MapPin size={28} className="mr-2 text-teal-600" /> Pickup &
                Dropoff
              </h4>
              <input
                type="text"
                placeholder="Pickup Address"
                value={pickupAddress}
                onChange={(e) => setPickupAddress(e.target.value)}
                className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-teal-600 focus:border-teal-600"
                required
              />
              <input
                type="text"
                placeholder="Dropoff Address"
                value={dropoffAddress}
                onChange={(e) => setDropoffAddress(e.target.value)}
                className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-teal-600 focus:border-teal-600"
                required
              />
            </div>

            {/* Date & Time Card */}
            <div className="bg-gray-50 p-6 rounded-xl shadow-md">
              <h4 className="text-2xl font-semibold text-teal-900 mb-6 flex items-center">
                <Clock size={28} className="mr-2 text-teal-600" /> Select Time
              </h4>

              {dateError && (
                <p className="text-red-500 text-sm mb-4">{dateError}</p>
              )}
              <input
                type="time"
                value={selectedTime}
                onChange={(e) => handleTimeChange(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-teal-600 focus:border-teal-600"
                required
              />
              {timeWarning && (
                <p className="mt-4 text-sm text-yellow-600">
                  <Info size={16} className="inline" /> {timeWarning}
                </p>
              )}
            </div>

            {/* Days of the Week Card */}
            <div className="bg-gray-50 p-6 rounded-xl shadow-md">
              <h4 className="text-2xl font-semibold text-teal-900 mb-6 flex items-center">
                <CalendarCheck size={28} className="mr-2 text-teal-600" />{" "}
                Select Days of the Week
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {daysOfWeek.map((day) => (
                  <label key={day} className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      value={day}
                      checked={selectedDays.includes(day)}
                      onChange={() => handleDaySelection(day)}
                      className="form-checkbox h-5 w-5 text-teal-600 focus:ring-0"
                    />
                    <span className="ml-2 text-teal-900">{day}</span>
                  </label>
                ))}
              </div>
              <p className="mt-4 text-sm text-yellow-600">
                <Info size={16} className="inline" /> If you select a day that
                matches todays date, your ride will be scheduled for the same
                day in the following week, as same-day bookings are not allowed.
              </p>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                className="bg-teal-600 text-white px-8 py-4 rounded-full shadow-lg hover:bg-teal-700 transition duration-300 inline-flex items-center"
              >
                <CalendarCheck size={24} className="mr-2" />
                Confirm Weekly Ride
              </button>
            </div>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}
