"use client";
import React from "react";
import { Clock, Info } from "@phosphor-icons/react";

export default function Time({
  timeWarning,
  formData,
  dateError,
  setTimeWarning,
  setFormData,
}: any) {
  const handleTimeChange = (time: string) => {
    const [hours] = time.split(":").map(Number);

    if (hours < 8 || hours > 18) {
      setTimeWarning(
        "Selecting an off-peak time (before 8 AM or after 6 PM) will incur an additional fee."
      );
    } else {
      setTimeWarning("");
    }

    setFormData((prevData: any) => ({
      ...prevData,
      selectedTime: time,
    }));
  };

  return (
    <div className="bg-gray-50 p-6 rounded-xl shadow-md">
      <h4 className="text-2xl font-semibold text-teal-900 mb-6 flex items-center">
        <Clock size={28} className="mr-2 text-teal-600" /> Select Time
      </h4>

      {dateError && <p className="text-red-500 text-sm mb-4">{dateError}</p>}
      <input
        type="time"
        value={formData.selectedTime}
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
  );
}
