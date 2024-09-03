"use client";

import React, { useState, useEffect } from "react";
import {
  getAllTimeSlots,
  saveTimeSlotsToSupabase,
  removeTimeSlotFromSupabase,
} from "@/utils/supabase/supabaseQueries"; // Adjust this import based on your setup

const generateDates = (days: number) => {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < days; i++) {
    const newDate = new Date(today);
    newDate.setDate(today.getUTCDate() + i);
    dates.push(
      new Date(newDate.getTime() - newDate.getTimezoneOffset() * 60000)
    );
  }
  return dates;
};

const generateTimeSlots = () => {
  const slots = [];
  const start = new Date();
  start.setUTCHours(13, 0, 0, 0); // Time Slots Start at 8:00 AM UTC

  for (let i = 0; i < 18; i++) {
    // 9 hours, 30-minute intervals
    const time = new Date(start);
    time.setUTCMinutes(time.getUTCMinutes() + i * 30);
    slots.push(
      time.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    );
  }

  return slots;
};

const Calender = () => {
  const [dates, setDates] = useState<Date[]>([]);
  const [timeSlots, setTimeSlots] = useState<{
    [key: string]: { id: number; slot: string; booked: boolean }[];
  }>({});
  const [initialTimeSlots, setInitialTimeSlots] = useState<{
    [key: string]: { id: number; slot: string; booked: boolean }[];
  }>({});
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    setDates(generateDates(25)); // Generate the next 25 days
    // Fetch all time slots on component load
    getAllTimeSlots()
      .then((slots) => {
        setTimeSlots(slots);
      })
      .catch((error) => {
        console.error("Failed to fetch time slots:", error);
      });
  }, []);

  const handleDateClick = (date: Date) => {
    const dateKey = date.toISOString().split("T")[0]; // Use the full date in UTC
    setSelectedDate(date);
    setInitialTimeSlots((prev) => ({
      ...prev,
      [dateKey]: timeSlots[dateKey] || [],
    }));
  };

  const handleAddSlot = (slot: string, date: string) => {
    const isSlotBooked = timeSlots[date]?.some(
      (timeSlot) => timeSlot.slot === slot && timeSlot.booked
    );

    if (isSlotBooked) return;

    setTimeSlots((prev) => ({
      ...prev,
      [date]: prev[date]
        ? [...prev[date], { id: Date.now(), slot, booked: false }] // Use a placeholder id for newly added slots
        : [{ id: Date.now(), slot, booked: false }],
    }));
  };

  const handleDeleteSlot = async (id: number, date: string) => {
    try {
      await removeTimeSlotFromSupabase(id);
      setTimeSlots((prev) => ({
        ...prev,
        [date]: prev[date].filter((timeSlot) => timeSlot.id !== id),
      }));
    } catch (error) {
      console.error("Failed to delete time slot:", error);
      alert("Failed to delete time slot. Please try again.");
    }
  };

  const handleSave = async (date: string) => {
    const slotsForSelectedDate = timeSlots[date] || [];
    const initialSlotsForSelectedDate = initialTimeSlots[date] || [];

    // Find slots to delete (those that were in the initial state but are not in the current state)
    const slotsToDelete = initialSlotsForSelectedDate
      .filter(
        (timeSlot) =>
          !slotsForSelectedDate.some((slot) => slot.slot === timeSlot.slot)
      )
      .map((slot) => slot.id);

    // Find slots to add (those that are in the current state but were not in the initial state)
    const slotsToAdd = slotsForSelectedDate
      .filter(
        (timeSlot) =>
          !initialSlotsForSelectedDate.some(
            (slot) => slot.slot === timeSlot.slot
          )
      )
      .map((slot) => slot.slot);

    try {
      // Delete removed slots from the database for the current date
      for (const id of slotsToDelete) {
        await removeTimeSlotFromSupabase(id);
      }

      // Save new slots to the database for the current date
      if (slotsToAdd.length > 0) {
        await saveTimeSlotsToSupabase(date, slotsToAdd);
      }

      // Update initialTimeSlots to reflect the current state as the new initial state
      setInitialTimeSlots((prev) => ({
        ...prev,
        [date]: slotsForSelectedDate,
      }));

      alert(`Time slots for ${date} saved successfully!`);
    } catch (error) {
      console.error("Failed to save time slots:", error);
      alert("Failed to save time slots. Please try again.");
    }
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
              className={`p-4 rounded-lg shadow-md cursor-pointer bg-white text-gray-800`}
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
                {(timeSlots[dateKey] || []).map((timeSlot) => (
                  <li
                    key={timeSlot.id}
                    className={`flex justify-between items-center px-2 py-1 rounded ${
                      timeSlot.booked
                        ? "bg-red-300 text-red-800"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    <span>{timeSlot.slot}</span>
                    {!timeSlot.booked && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSlot(timeSlot.id, dateKey);
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        &times;
                      </button>
                    )}
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
              const isSlotBooked = timeSlots[dateKey]?.some(
                (timeSlot) => timeSlot.slot === slot && timeSlot.booked
              );
              const isSlotTaken = timeSlots[dateKey]?.some(
                (timeSlot) => timeSlot.slot === slot
              );

              return (
                <button
                  key={slot}
                  onClick={() => handleAddSlot(slot, dateKey)}
                  disabled={isSlotBooked || isSlotTaken}
                  className={`p-2 rounded-lg shadow-md ${
                    isSlotBooked
                      ? "bg-red-300 text-red-800 cursor-not-allowed"
                      : isSlotTaken
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
              onClick={() =>
                handleSave(selectedDate.toISOString().split("T")[0])
              }
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
