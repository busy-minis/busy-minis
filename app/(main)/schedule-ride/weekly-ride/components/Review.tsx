"use client";

import React from "react";
import { format, addDays, compareAsc } from "date-fns";
import { MapPin, User, Clock, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Rider {
  name: string;
  age: string;
}

interface Stop {
  address: string;
  lat?: number;
  lng?: number;
}

interface ReviewProps {
  formData: {
    pickupAddress: string;
    dropoffAddress: string;
    stops: Stop[];
    riders: Rider[];
    selectedTime: string;
    selectedDays: string[];
    pickupDate: string;
    renewal_date: string;
  };
  totalPrice: number;
  regularPrice: number;
  savings: number;
  distance: number | null;
  setPage: (page: number) => void;
}

const daysOfWeekMap: { [key: string]: number } = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

const Review: React.FC<ReviewProps> = ({
  formData,
  totalPrice,
  regularPrice,
  savings,
  distance,
  setPage,
}) => {
  const formattedDays = formData.selectedDays
    .map((day) => {
      const date = getNextDate(formData.pickupDate, day);
      return { day, date, formatted: formatDateWithDay(date) };
    })
    .sort((a, b) => compareAsc(a.date, b.date));

  function getNextDate(pickupDate: string, day: string): Date {
    const targetDay = daysOfWeekMap[day];
    const initialDate = new Date(pickupDate);
    const currentDay = initialDate.getDay();

    const dayDifference = (targetDay - currentDay + 7) % 7 || 7;
    return addDays(initialDate, dayDifference);
  }

  function formatDateWithDay(date: Date): string {
    return format(date, "EEEE, MMMM do");
  }

  function formatTime(time24: string): string {
    const [hours, minutes] = time24.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const hours12 = hours % 12 || 12;
    return `${hours12}:${minutes < 10 ? `0${minutes}` : minutes} ${period}`;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Review Your Booking
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold mb-2 flex items-center">
            <MapPin className="mr-2" />
            Trip Details
          </h3>
          <div className="space-y-2">
            <p>
              <strong>Pickup:</strong> {formData.pickupAddress}
            </p>
            {formData.stops.map((stop, index) => (
              <p key={index}>
                <strong>Stop {index + 1}:</strong> {stop.address}
              </p>
            ))}
            <p>
              <strong>Dropoff:</strong> {formData.dropoffAddress}
            </p>
            {distance !== null && (
              <p>
                <strong>Estimated Distance:</strong> {distance.toFixed(2)} miles
              </p>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2 flex items-center">
            <Clock className="mr-2" />
            Schedule
          </h3>
          <p>
            <strong>Pickup Time:</strong> {formatTime(formData.selectedTime)}
          </p>
          <div className="mt-2">
            <h4 className="font-semibold">Selected Days</h4>
            <ul className="space-y-1">
              {formattedDays.map(({ formatted }, index) => (
                <li key={index}>{formatted}</li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2 flex items-center">
            <User className="mr-2" />
            Riders
          </h3>
          {formData.riders.map((rider: Rider, index: number) => (
            <p key={index}>
              <strong>Rider {index + 1}:</strong> {rider.name} (Age: {rider.age}
              )
            </p>
          ))}
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2">Renewal Date</h3>
          <p>
            Your weekly ride subscription will renew on:{" "}
            <strong>{formData.renewal_date}</strong>
          </p>
          <p className="text-sm text-gray-600 mt-1">
            You will have the option to renew your weekly ride on this date.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2">Total Price</h3>
          <p>
            <strong>Total Price:</strong>{" "}
            <span className="line-through text-red-600 mr-2">
              ${regularPrice.toFixed(2)}
            </span>
            <strong>${totalPrice.toFixed(2)}</strong>
          </p>
          <p className="text-sm text-green-600 mt-1">
            You save: ${savings.toFixed(2)} by booking weekly rides!
          </p>
        </div>

        <div className="flex justify-between space-x-4">
          <Button
            onClick={() => setPage(1)}
            variant="outline"
            className="w-full"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button type="submit" className="w-full">
            Continue To Payment
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Review;
