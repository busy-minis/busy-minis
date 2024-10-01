"use client";

import React from "react";
import { format, addDays, compareAsc } from "date-fns";
import {
  MapPin,
  User,
  Clock,
  Calendar,
  DollarSign,
  Repeat,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

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
    end_date?: any; // Made optional if it's no longer used
    selectedTime: string;
    selectedDays: string[];
    pickupDate: string;
    renewal_date?: string; // Assuming this might be used elsewhere
  };
  totalPrice: number;
  regularPrice: number;
  savings: number;
  distance: number | null;
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
}) => {
  const formattedDays = formData.selectedDays
    .map((day) => {
      const date = getNextDate(formData.pickupDate, day);
      return { day, date, formatted: formatDateWithDay(date) };
    })
    .sort((a, b) => compareAsc(a.date, b.date));

  // Get the last date from the formattedDays array
  const lastDate = formattedDays[formattedDays.length - 1]?.date;

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
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center">
          Your Weekly Ride Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold mb-4 flex items-center">
            <MapPin className="mr-2" />
            Trip Details
          </h3>
          <div className="space-y-2">
            <p className="flex items-center">
              <Badge variant="secondary" className="mr-2">
                Pickup
              </Badge>
              {formData.pickupAddress}
            </p>
            {formData.stops.map((stop, index) => (
              <p key={index} className="flex items-center">
                <Badge variant="secondary" className="mr-2">
                  Stop {index + 1}
                </Badge>
                {stop.address}
              </p>
            ))}
            <p className="flex items-center">
              <Badge variant="secondary" className="mr-2">
                Dropoff
              </Badge>
              {formData.dropoffAddress}
            </p>
            {distance !== null && (
              <p className="mt-4">
                <Badge variant="outline" className="text-white">
                  Estimated Distance: {distance.toFixed(2)} miles
                </Badge>
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center">
                <Clock className="mr-2" />
                Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium">
                Pickup Time: {formatTime(formData.selectedTime)}
              </p>
              <Separator className="my-4" />
              <h4 className="font-semibold mb-2">Selected Days</h4>
              <ul className="space-y-1">
                {formattedDays.map(({ formatted }, index) => (
                  <li key={index} className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    {formatted}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center">
                <User className="mr-2" />
                Riders
              </CardTitle>
            </CardHeader>
            <CardContent>
              {formData.riders.map((rider: Rider, index: number) => (
                <div key={index} className="flex items-center mb-2">
                  <Badge variant="outline" className="mr-2">
                    Rider {index + 1}
                  </Badge>
                  <span>
                    {rider.name} (Age: {rider.age})
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center">
              <Repeat className="mr-2" />
              Renewal Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            {lastDate ? (
              <>
                <p>
                  Your weekly ride subscription will renew on:{" "}
                  <strong>
                    {format(new Date(lastDate), "EEEE, MMMM do, yyyy")}
                  </strong>
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  You will have the option to renew your weekly ride on this
                  date.
                </p>
              </>
            ) : (
              <p className="text-sm text-gray-600">
                No selected days to determine the renewal date.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-green-50">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center">
              <DollarSign className="mr-2" />
              Pricing Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <span>Regular Price:</span>
              <span className="line-through text-gray-500">
                ${regularPrice.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center font-bold text-lg mt-2">
              <span>Your Price:</span>
              <span className="text-green-600">${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-sm text-green-600 mt-1">
              <span>Your Savings:</span>
              <span>${savings.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default Review;
