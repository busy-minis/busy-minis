"use client";
import React, { useState } from "react";
import Footer from "@/app/components/ui/Footer";
import { CalendarCheck, UserPlus, UserMinus } from "@phosphor-icons/react";

export default function WeeklyRideBookingPage() {
  const [passengers, setPassengers] = useState([{ name: "", age: "" }]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [pickupAddress, setPickupAddress] = useState("");
  const [dropoffAddress, setDropoffAddress] = useState("");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [dateError, setDateError] = useState("");

  const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if the selected date is at least one day after today
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

      <section className="relative pt-24 pb-20 lg:pb-36">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <CalendarCheck size={64} className="text-teal-600 mx-auto mb-4" />
            <h2 className="font-bold text-5xl sm:text-6xl text-gray-900 mb-6">
              Book Your Weekly Ride
            </h2>
            <p className="text-lg max-w-3xl mx-auto text-gray-600">
              Schedule your weekly rides by selecting passengers, addresses, and
              the days of the week that work best for you.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-lg space-y-8"
          >
            {/* Passengers */}
            <div>
              <h4 className="text-xl font-semibold text-teal-900 mb-4">
                Add Passengers
              </h4>
              {passengers.map((passenger, index) => (
                <div key={index} className="grid grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder={`Passenger ${index + 1} Name`}
                    value={passenger.name}
                    onChange={(e) => {
                      const newPassengers = [...passengers];
                      newPassengers[index].name = e.target.value;
                      setPassengers(newPassengers);
                    }}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-teal-600 focus:border-teal-600"
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-teal-600 focus:border-teal-600"
                  />
                  {passengers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePassenger(index)}
                      className="bg-red-500 text-white p-2 rounded-lg shadow hover:bg-red-600 transition"
                    >
                      <UserMinus size={24} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addPassenger}
                className="bg-teal-600 text-white px-4 py-2 rounded-lg shadow hover:bg-teal-700 transition"
              >
                <UserPlus size={20} className="mr-2 inline" /> Add Passenger
              </button>
            </div>

            {/* Pickup and Dropoff Addresses */}
            <div>
              <h4 className="text-xl font-semibold text-teal-900 mb-4">
                Pickup & Dropoff
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

            {/* Date & Time */}
            <div>
              <h4 className="text-xl font-semibold text-teal-900 mb-4">
                Select Start Date & Time
              </h4>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setDateError(""); // Clear any previous date errors
                }}
                className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-teal-600 focus:border-teal-600"
                min={today} // Minimum date set to today's date
                required
              />
              {dateError && (
                <p className="text-red-500 text-sm mb-4">{dateError}</p>
              )}
              <input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-teal-600 focus:border-teal-600"
                required
              />
            </div>

            {/* Days of the Week */}
            <div>
              <h4 className="text-xl font-semibold text-teal-900 mb-4">
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
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                className="bg-teal-600 text-white px-8 py-4 rounded-full shadow-lg hover:bg-teal-700 transition duration-300"
              >
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
