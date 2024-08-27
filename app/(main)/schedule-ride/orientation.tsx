"use client";
import React, { useState } from "react";
import Footer from "@/app/components/ui/Footer";
import { CalendarCheck, CheckCircle } from "@phosphor-icons/react";

export default function OrientationPage() {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);

  // Sample dates and time slots
  const availableDates = [
    "September 1, 2024",
    "September 2, 2024",
    "September 3, 2024",
  ];
  const availableTimeSlots = ["10:00 AM", "12:00 PM", "2:00 PM", "4:00 PM"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDate && selectedTime) {
      setIsConfirmed(true); // Show confirmation message
    } else {
      alert("Please select a date and time for your orientation.");
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
              {isConfirmed ? "Orientation Confirmed" : "Book Your Orientation"}
            </h2>
            <p className="text-lg max-w-3xl mx-auto text-gray-600">
              {isConfirmed
                ? "Your orientation has been successfully booked! You will receive a call on the selected date to verify your account."
                : "Before booking a ride, please complete an orientation session to ensure safety and reliability for your child’s transportation. Choose a convenient date and time below to schedule your orientation."}
            </p>
          </div>

          {!isConfirmed ? (
            <form
              onSubmit={handleSubmit}
              className="max-w-xl mx-auto bg-white p-8 rounded-3xl shadow-lg"
            >
              <div className="mb-8">
                <label
                  htmlFor="date"
                  className="block text-lg font-semibold text-teal-900 mb-2"
                >
                  Select Orientation Date
                </label>
                <select
                  id="date"
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-teal-600 focus:border-teal-600"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  required
                >
                  <option value="">Choose a date</option>
                  {availableDates.map((date, index) => (
                    <option key={index} value={date}>
                      {date}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-8">
                <label
                  htmlFor="time"
                  className="block text-lg font-semibold text-teal-900 mb-2"
                >
                  Select Orientation Time
                </label>
                <select
                  id="time"
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-teal-600 focus:border-teal-600"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  required
                >
                  <option value="">Choose a time</option>
                  {availableTimeSlots.map((time, index) => (
                    <option key={index} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  className="bg-teal-600 text-white px-8 py-4 rounded-full shadow-lg hover:bg-teal-700 transition duration-300"
                >
                  Confirm Orientation
                </button>
              </div>
            </form>
          ) : (
            <div className="max-w-xl mx-auto bg-white p-8 rounded-3xl shadow-lg text-center">
              <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
              <h3 className="text-3xl font-semibold text-teal-900 mb-4">
                Orientation Booked!
              </h3>
              <p className="text-lg text-gray-600 mb-8">
                You have successfully booked your orientation on {selectedDate}{" "}
                at {selectedTime}.
              </p>
              <p className="text-lg text-gray-600">
                You will receive a call on the selected date to verify your
                account and finalize your setup. After verification, you’ll be
                able to start booking rides for your child!
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
