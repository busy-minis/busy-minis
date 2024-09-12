"use client";
import React, { useState, useEffect } from "react";

import { CalendarCheck, CheckCircle } from "@phosphor-icons/react";
import {
  getAvailableTimeSlots,
  bookOrientation,
  cancelOrientation,
  getUserOrientationStatus,
} from "@/utils/supabase/supabaseQueries";

type TimeSlots = {
  [key: string]: string[]; // Key is a date (string), value is an array of time slots (strings)
};

export default function OrientationPage(props: { user_id: string }) {
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlots>({});
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [confirmedDate, setConfirmedDate] = useState<string>("");
  const [confirmedTime, setConfirmedTime] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

  useEffect(() => {
    async function checkUserOrientationStatus() {
      const { status, date, time } = await getUserOrientationStatus(
        props.user_id
      );

      if (status === "scheduled") {
        setIsConfirmed(true);
        setConfirmedDate(date);
        setConfirmedTime(time);
      } else {
        const slotsByDate = await getAvailableTimeSlots();
        setAvailableDates(Object.keys(slotsByDate));
        setTimeSlots(slotsByDate);

        if (Object.keys(slotsByDate).length > 0) {
          setSelectedDate(Object.keys(slotsByDate)[0]);
        }
      }
    }

    checkUserOrientationStatus();
  }, [props.user_id]);

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setSelectedTime("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDate && selectedTime) {
      const user_id = props.user_id;

      const isBooked = await bookOrientation(
        user_id,
        selectedDate,
        selectedTime
      );

      if (isBooked) {
        setIsConfirmed(true);
        setConfirmedDate(selectedDate);
        setConfirmedTime(selectedTime);
      } else {
        alert("There was an error booking your orientation. Please try again.");
      }
    } else {
      alert("Please select a date and time for your orientation.");
    }
  };

  const handleCancel = async () => {
    const user_id = props.user_id;

    const isCanceled = await cancelOrientation(
      user_id,
      confirmedDate,
      confirmedTime
    );

    if (isCanceled) {
      setIsConfirmed(false);
      setConfirmedDate("");
      setConfirmedTime("");
      setIsModalOpen(false); // Close the modal after canceling
      alert(
        "Your orientation has been canceled. You can book a new appointment."
      );
    } else {
      alert("There was an error canceling your orientation. Please try again.");
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
                ? `Your orientation has been successfully booked! You will receive a call on ${formatDate(
                    confirmedDate
                  )} at ${confirmedTime} to verify your account.`
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
                  onChange={(e) => handleDateChange(e.target.value)}
                  required
                >
                  <option value="">Choose a date</option>
                  {availableDates.map((date, index) => (
                    <option key={index} value={date}>
                      {formatDate(date)}
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
                  {timeSlots[selectedDate]?.map((time, index) => (
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
                You have successfully booked your orientation on{" "}
                {formatDate(confirmedDate)} at {confirmedTime}.
              </p>
              <p className="text-lg text-gray-600 mb-4">
                You will receive a call on the selected date to verify your
                account and finalize your setup. After verification, you’ll be
                able to start booking rides for your child!
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-red-600 text-white px-8 py-4 rounded-full shadow-lg hover:bg-red-700 transition duration-300"
              >
                Cancel Orientation
              </button>
            </div>
          )}
        </div>
      </section>

      {isModalOpen && (
        <CancelModal
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleCancel}
        />
      )}
    </div>
  );
}

function formatDate(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("en-US", options);
}

type CancelModalProps = {
  onClose: () => void;
  onConfirm: () => void;
};
function CancelModal({ onClose, onConfirm }: CancelModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Cancel Orientation?
        </h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to cancel your orientation? You can make a new
          appointment if you change your mind.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
          >
            No, Keep It
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Yes, Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
