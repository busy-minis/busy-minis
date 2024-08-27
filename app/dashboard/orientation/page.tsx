"use client";
import React, { useState } from "react";
import { CheckCircle } from "@phosphor-icons/react";

const ScheduleOrientation = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<string | null>(null);

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setSelectedSlot(null); // Reset the slot when the date changes
  };

  const handleSlotChange = (slot: string) => {
    setSelectedSlot(slot);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (selectedDate && selectedSlot) {
      setConfirmation(
        `Your orientation is scheduled on ${selectedDate} at ${selectedSlot}`
      );
      // Here you would send the selected date and slot to your backend
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-white shadow-md rounded-md">
      {!confirmation ? (
        <>
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-700 mb-6">
            Schedule Your Orientation
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select a Date
              </label>
              <select
                value={selectedDate || ""}
                onChange={(e) => handleDateChange(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              >
                <option value="" disabled>
                  Select a date
                </option>
                {availableTimeBlocks.map((block) => (
                  <option key={block.date} value={block.date}>
                    {block.date}
                  </option>
                ))}
              </select>
            </div>

            {selectedDate && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select a Time Slot
                </label>
                <select
                  value={selectedSlot || ""}
                  onChange={(e) => handleSlotChange(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                >
                  <option value="" disabled>
                    Select a time slot
                  </option>
                  {availableTimeBlocks
                    .find((block) => block.date === selectedDate)
                    ?.slots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                </select>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-theme-orange text-white py-2 rounded-md shadow-sm hover:bg-orange-600 transition-colors"
            >
              Confirm Orientation
            </button>
          </form>
        </>
      ) : (
        <div className="text-center">
          <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-700">
            Orientation Scheduled
          </h2>
          <p className="mt-2 text-gray-600">{confirmation}</p>
        </div>
      )}
    </div>
  );
};

export default ScheduleOrientation;

const availableTimeBlocks = [
  {
    date: "2024-08-20",
    slots: ["10:00 AM - 10:30 AM", "11:00 AM - 11:30 AM", "2:00 PM - 2:30 PM"],
  },
  {
    date: "2024-08-21",
    slots: ["9:00 AM - 9:30 AM", "12:00 PM - 12:30 PM", "3:00 PM - 3:30 PM"],
  },
  {
    date: "2024-08-22",
    slots: ["10:00 AM - 10:30 AM", "1:00 PM - 1:30 PM", "4:00 PM - 4:30 PM"],
  },
];
