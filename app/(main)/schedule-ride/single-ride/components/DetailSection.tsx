import React, { useState } from "react";
import { Input } from "./Input";

import {
  Calendar,
  Clock,
  User,
  Plus,
  Trash,
  ArrowRight,
} from "@phosphor-icons/react";
import { format, isBefore, parseISO, addHours } from "date-fns";
import { Warning } from "./Warning";

interface Rider {
  name: string;
  age: string;
}
interface FormData {
  user_id: string;
  status: string;
  pickupDate: string;
  pickupTime: string;
  pickupAddress: string;
  pickupLat?: number;
  pickupLng?: number;
  dropoffAddress: string;
  dropoffLat?: number;
  dropoffLng?: number;
  riders: Rider[];
}
export default function DetailSection({
  formData,
  setFormData,
  validationErrors,
  handleNextStep,
  isSameDay,
  setIsSameDay,
  isOffPeak,
  setIsOffPeak,
  isMoreRiders,
  setIsMoreRiders,
  isWithinOneHour,
  setIsWithinOneHour,
}: any) {
  const today = format(new Date(), "yyyy-MM-dd");
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof FormData | keyof Rider,
    index?: number
  ) => {
    const { value } = e.target;

    if (typeof index === "number" && (field === "name" || field === "age")) {
      const updatedRiders = [...formData.riders];
      updatedRiders[index][field] = value;
      setFormData({ ...formData, riders: updatedRiders });
    } else {
      setFormData({ ...formData, [field]: value });
      if (field === "pickupDate")
        checkSameDayAndTime(value, formData.pickupTime);
      if (field === "pickupTime")
        checkSameDayAndTime(formData.pickupDate, value);
    }
  };
  const checkSameDayAndTime = (pickupDate: string, pickupTime: string) => {
    const isSame = pickupDate === today;
    const isOffPeakTime =
      pickupTime &&
      (parseInt(pickupTime.split(":")[0]) < 6 ||
        parseInt(pickupTime.split(":")[0]) >= 18);
    const withinOneHour =
      pickupDate &&
      pickupTime &&
      isBefore(
        parseISO(`${pickupDate}T${pickupTime}`),
        addHours(new Date(), 1)
      );

    setIsSameDay(isSame);
    setIsOffPeak(Boolean(isOffPeakTime));
    setIsWithinOneHour(Boolean(withinOneHour));
  };
  const handleAddRider = () => {
    setFormData({
      ...formData,
      riders: [...formData.riders, { name: "", age: "" }],
    });
    setIsMoreRiders(true);
  };

  const handleRemoveRider = (index: number) => {
    setFormData({
      ...formData,
      riders: formData.riders.filter((_: any, i: any) => i !== index),
    });
    setIsMoreRiders(false);
  };

  return (
    <>
      <section className="flex gap-2 mb-8 items-center">
        <div className="bg-orange-500 grid place-content-center text-sm size-6 rounded-full text-white">
          1
        </div>
        <p className=" font-semibold"> Details</p>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <Input
            label="Pickup Date"
            type="date"
            icon={<Calendar size={24} />}
            value={formData.pickupDate}
            min={today} // Restrict past dates
            onChange={(e) => handleInputChange(e, "pickupDate")}
          />
          {isSameDay && (
            <Warning text="Same-day pickups will incur an additional fee." />
          )}
        </div>
        <div>
          <Input
            label="Pickup Time"
            type="time"
            icon={<Clock size={24} />}
            value={formData.pickupTime}
            onChange={(e) => handleInputChange(e, "pickupTime")}
          />
          {isOffPeak && (
            <Warning text="Off-peak hours (before 6 AM or after 6 PM) will incur an additional fee." />
          )}
          {isWithinOneHour && (
            <Warning text="Rides within one hour will incur an additional fee." />
          )}
        </div>
      </div>

      {formData.riders.map((rider: Rider, index: any) => (
        <div
          key={index}
          className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 mb-6"
        >
          <Input
            label={`Rider ${index + 1} Name`}
            icon={<User size={24} />}
            value={rider.name}
            onChange={(e) => handleInputChange(e, "name", index)}
          />
          <Input
            label={`Rider ${index + 1} Age`}
            type="number"
            min="0"
            value={rider.age}
            onChange={(e) => handleInputChange(e, "age", index)}
          />
          {index > 0 && (
            <button
              type="button"
              className="text-red-600 bg-red-100 w-fit px-2 py-2 font-bold  flex items-center space-x-2"
              onClick={() => handleRemoveRider(index)}
            >
              <Trash size={20} />
              <span>Remove Rider</span>
            </button>
          )}
        </div>
      ))}
      {isMoreRiders && (
        <Warning text="More Riders will incur an additional fee." />
      )}

      {formData.riders.length < 4 && (
        <button
          type="button"
          className="mb-4 px-4 py-2 bg-gray-500 w-full text-white rounded-lg shadow-md hover:shadow-lg transition-transform duration-200 ease-in-out transform hover:-translate-y-1 flex justify-center items-center space-x-2"
          onClick={handleAddRider}
        >
          <Plus size={20} />
          <span>Add Another Rider</span>
        </button>
      )}

      {validationErrors.length > 0 && (
        <div className="text-red-600 text-sm mb-4 mt-2 text-center">
          {validationErrors.map((error: any, index: any) => (
            <p key={index}>{error}</p>
          ))}
        </div>
      )}

      <button
        type="button"
        className="w-full px-4 py-2 bg-gradient-to-r from-theme-orange to-theme-yellow text-white rounded-lg shadow-md hover:shadow-lg  ease-in-out transform flex justify-center items-center"
        onClick={handleNextStep}
      >
        Next
      </button>
    </>
  );
}
