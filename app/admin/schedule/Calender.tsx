"use client";

import React, { useState, useEffect } from "react";

const generateDates = (days: number) => {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < days; i++) {
    const newDate = new Date(today);
    newDate.setDate(today.getDate() + i);
    dates.push(newDate);
  }
  return dates;
};

const generateTimeSlots = () => {
  const slots = [];
  const start = new Date();
  start.setHours(8, 0, 0, 0); //Time Slots Start at 8:00 AM

  for (let i = 0; i < 18; i++) {
    // 9 hours, 30-minute intervals
    const time = new Date(start);
    time.setMinutes(time.getMinutes() + i * 30);
    slots.push(
      time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  }

  return slots;
};

const Calender = () => {
  const [dates, setDates] = useState<Date[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [timeSlots, setTimeSlots] = useState<{ [key: string]: string[] }>({});

  useEffect(() => {
    setDates(generateDates(25)); // Generate the next 25 days
  }, []);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleAddSlot = (slot: string) => {
    if (!selectedDate) return;

    const dateKey = selectedDate.toISOString().split("T")[0];
    setTimeSlots((prev) => ({
      ...prev,
      [dateKey]: prev[dateKey] ? [...prev[dateKey], slot] : [slot],
    }));
  };

  const handleDeleteSlot = (slot: string) => {
    if (!selectedDate) return;

    const dateKey = selectedDate.toISOString().split("T")[0];
    setTimeSlots((prev) => ({
      ...prev,
      [dateKey]: prev[dateKey].filter((s) => s !== slot),
    }));
  };

  const handleSave = () => {
    if (!selectedDate) return;

    const dateKey = selectedDate.toISOString().split("T")[0];
    const slotsForSelectedDate = timeSlots[dateKey] || [];

    // Here you can call your API or update logic to save the selected slots
    console.log(`Saving slots for ${dateKey}:`, slotsForSelectedDate);

    // Optional: Show a success message or reset the form
    alert(`Time slots for ${dateKey} saved successfully!`);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">
        Admin: Manage Time Blocks
      </h1>

      <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4">
        {dates.map((date) => {
          const dateKey = date.toISOString().split("T")[0];
          return (
            <div
              key={dateKey}
              className={`p-4 rounded-lg shadow-md cursor-pointer ${
                selectedDate?.toISOString().split("T")[0] === dateKey
                  ? "bg-theme-orange text-white"
                  : "bg-white text-gray-800"
              }`}
              onClick={() => handleDateClick(date)}
            >
              <p className="text-lg font-semibold">
                {date.toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </p>
              <ul className="mt-2 space-y-1">
                {(timeSlots[dateKey] || []).map((slot) => (
                  <li
                    key={slot}
                    className="flex justify-between items-center bg-gray-100 text-gray-700 px-2 py-1 rounded"
                  >
                    <span>{slot}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSlot(slot);
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      &times;
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {selectedDate && (
        <div className="mt-6 p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800">
            Add Slots for{" "}
            {selectedDate.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </h2>
          <div className="grid grid-cols-4 gap-4 mt-4">
            {generateTimeSlots().map((slot) => {
              const dateKey = selectedDate.toISOString().split("T")[0];
              const isSlotTaken =
                timeSlots[dateKey] && timeSlots[dateKey].includes(slot);

              return (
                <button
                  key={slot}
                  onClick={() => handleAddSlot(slot)}
                  disabled={isSlotTaken}
                  className={`p-2 rounded-lg shadow-md ${
                    isSlotTaken
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-theme-orange text-white hover:bg-orange-600"
                  }`}
                >
                  {slot}
                </button>
              );
            })}
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSave}
              className="bg-theme-teal text-white px-6 py-2 rounded-lg hover:bg-teal-600 transition-all duration-200 shadow-md"
            >
              Save Slots
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calender;
