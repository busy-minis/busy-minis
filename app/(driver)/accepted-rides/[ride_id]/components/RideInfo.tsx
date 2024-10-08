"use client";

import React, { useState } from "react";
import { User, MapPin, Calendar, Clock, Navigation, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Passenger {
  name: string;
  age: number;
}

interface Ride {
  id: string;
  distance: number;
  pickupAddress: string;
  dropoffAddress: string;
  pickupTime: string;
  pickupDate: string;
  status: string;
  riders: Passenger[];
}

interface RideInfoProps {
  rideData: Ride;
}

const formatDateTime = (date: string, time: string): string => {
  const dateTime = new Date(`${date}T${time}`);
  return dateTime.toLocaleString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const RideInfo: React.FC<RideInfoProps> = ({ rideData }) => {
  const [showRideId, setShowRideId] = useState(false);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="bg-primary text-primary-foreground">
          <CardTitle className="text-2xl flex items-center justify-between">
            <span>Ride Details</span>
            <Badge variant="secondary">{rideData.status}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Date & Time
                </p>
                <p className="text-lg font-semibold">
                  {formatDateTime(rideData.pickupDate, rideData.pickupTime)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Navigation className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Distance
                </p>
                <p className="text-lg font-semibold">
                  {rideData.distance.toFixed(1)} miles
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-primary" />
              <span>Pickup Location</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{rideData.pickupAddress}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-primary" />
              <span>Dropoff Location</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{rideData.dropoffAddress}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5 text-primary" />
            <span>Passengers</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {rideData.riders.map((rider, index) => (
              <li key={index} className="flex items-center space-x-4">
                <User className="h-4 w-4 text-primary" />
                <span className="text-gray-700">
                  {rider.name}, Age: {rider.age}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowRideId(!showRideId)}
          className="flex items-center space-x-2"
        >
          <Info className="h-4 w-4" />
          <span>{showRideId ? "Hide" : "Show"} Ride ID</span>
        </Button>
      </div>

      {showRideId && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-muted-foreground">Ride ID</p>
            <p className="text-lg font-semibold">{rideData.id}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RideInfo;
