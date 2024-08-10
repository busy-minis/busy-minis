"use client";

import React, { useState } from "react";

const Calendar: React.FC<{ onDateChange: (date: Date) => void }> = ({
  onDateChange,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const generateCalendar = (month: number, year: number) => {
    const daysInMonth = getDaysInMonth(month, year);
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const calendarDays: (Date | null)[] = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarDays.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      calendarDays.push(new Date(year, month, day));
    }

    return calendarDays;
  };

  const handlePrevMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  };

  const calendarDays = generateCalendar(
    currentMonth.getMonth(),
    currentMonth.getFullYear()
  );

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handlePrevMonth}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Prev
        </button>
        <h2 className="text-lg font-bold">
          {currentMonth.toLocaleString("default", { month: "long" })}{" "}
          {currentMonth.getFullYear()}
        </h2>
        <button
          onClick={handleNextMonth}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Next
        </button>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center font-bold">
            {day}
          </div>
        ))}
        {calendarDays.map((date, index) => (
          <div key={index} className="text-center">
            {date ? (
              <button
                onClick={() => onDateChange(date)}
                className="w-full h-10 bg-gray-200 rounded hover:bg-blue-300 transition"
              >
                {date.getDate()}
              </button>
            ) : (
              <div className="w-full h-10"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const ScheduleOrientation = () => {
  const [date, setDate] = useState<Date | null>(null);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [name, setName] = useState<string>("");
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);

  const fetchAvailableTimes = (selectedDate: Date) => {
    const times = ["10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM"];
    setAvailableTimes(times);
  };

  const handleDateChange = (selectedDate: Date) => {
    setDate(selectedDate);
    fetchAvailableTimes(selectedDate);
  };

  const handleTimeChange = (time: string) => {
    setSelectedTime(time);
  };

  const handleConfirm = () => {
    if (date && selectedTime && name) {
      setIsConfirmed(true);
    } else {
      alert("Please select a date, time, and enter your name.");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 flex flex-col items-center justify-center">
      {!isConfirmed ? (
        <>
          <h1 className="text-3xl font-bold mb-6">Schedule Orientation</h1>
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <Calendar onDateChange={handleDateChange} />
            {date && (
              <>
                <h2 className="text-lg font-semibold mt-4 mb-2">
                  Available Times:
                </h2>
                <ul className="mb-4">
                  {availableTimes.map((time) => (
                    <li key={time} className="mb-2">
                      <button
                        onClick={() => handleTimeChange(time)}
                        className={`w-full px-4 py-2 rounded-lg text-left ${
                          selectedTime === time
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200"
                        } transition`}
                      >
                        {time}
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="mb-4">
                  <label
                    htmlFor="name"
                    className="block text-gray-700 font-bold mb-2"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
              </>
            )}
            <button
              onClick={handleConfirm}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Confirm
            </button>
          </div>
        </>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">Orientation Scheduled</h2>
          <p>
            {name}, your orientation has been scheduled for{" "}
            {date?.toDateString()} at {selectedTime}.
          </p>
        </div>
      )}
    </div>
  );
};

export default ScheduleOrientation;
