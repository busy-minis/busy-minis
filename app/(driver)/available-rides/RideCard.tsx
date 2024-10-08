"use client";

import React, { useState } from "react";
import { MapPin, Users, Clock, Car } from "lucide-react";
import dayjs from "dayjs";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface Rider {
  id: string;
  name: string;
  age: number;
}

interface Ride {
  id: string;
  pickupDate: string;
  pickupTime: string;
  pickupAddress: string;
  dropoffAddress: string;
  riders: Rider[];
  distance: number;
}

interface RideCardProps {
  ride: Ride;
  handleAcceptRide: (rideId: string) => void;
}

const RideCard: React.FC<RideCardProps> = ({ ride, handleAcceptRide }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const formattedDate = dayjs(`${ride.pickupDate}T${ride.pickupTime}`).format(
    "ddd, MMM D, YYYY"
  );
  const formattedTime = dayjs(`${ride.pickupDate}T${ride.pickupTime}`).format(
    "h:mm A"
  );

  const confirmAccept = () => {
    handleAcceptRide(ride.id);
    setIsDialogOpen(false);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-wrap justify-between items-center text-gray-600 mb-3">
          <Badge variant="secondary" className="mb-2 sm:mb-0">
            <Clock className="mr-1 h-3 w-3 text-teal-600" />
            {formattedDate} at {formattedTime}
          </Badge>
          <Badge variant="outline" className="flex items-center">
            <Users className="mr-1 h-3 w-3 text-teal-600" />
            {ride.riders.length}{" "}
            {ride.riders.length > 1 ? "Passengers" : "Passenger"}
          </Badge>
        </div>

        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">
          Ride to {ride.dropoffAddress}
        </h3>

        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-teal-600 mr-2 flex-shrink-0" />
            <span className="text-sm sm:text-base">
              Pickup: {ride.pickupAddress}
            </span>
          </div>

          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 mr-2 flex-shrink-0" />
            <span className="text-sm sm:text-base">
              Dropoff: {ride.dropoffAddress}
            </span>
          </div>

          <div className="flex items-center text-gray-600">
            <Car className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 mr-2 flex-shrink-0" />
            <span className="text-sm sm:text-base">
              Distance: {ride.distance} miles
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full">
              <Car className="mr-2 h-4 w-4" />
              Accept Ride
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Confirm Ride Acceptance</DialogTitle>
              <DialogDescription>
                Are you sure you want to accept this ride to{" "}
                {ride.dropoffAddress}?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-between">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={confirmAccept}>Confirm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export default RideCard;
