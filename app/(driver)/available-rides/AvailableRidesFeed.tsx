"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { acceptRide } from "@/utils/supabase/supabaseQueries";
import { MapPin, Loader2, Calendar, RefreshCw } from "lucide-react";
import RideCard from "./RideCard";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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

interface AvailableRidesFeedProps {
  rides: Ride[];
  user_id: string;
}

const groupRidesByDate = (rides: Ride[]) => {
  return rides.reduce((groups: { [key: string]: Ride[] }, ride) => {
    const formattedDate = dayjs(`${ride.pickupDate}T${ride.pickupTime}`).format(
      "dddd, MMMM D, YYYY"
    );
    if (!groups[formattedDate]) {
      groups[formattedDate] = [];
    }
    groups[formattedDate].push(ride);
    return groups;
  }, {});
};

const filterUpcomingRides = (rides: Ride[]) => {
  const now = dayjs();
  return rides.filter((ride) => {
    const rideDateTime = dayjs(`${ride.pickupDate}T${ride.pickupTime}`);
    return rideDateTime.isAfter(now);
  });
};

export default function AvailableRidesFeed({
  rides,
  user_id,
}: AvailableRidesFeedProps) {
  const [groupedRides, setGroupedRides] = useState<{ [key: string]: Ride[] }>(
    {}
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    processRides();
  }, [rides]);

  const processRides = () => {
    const upcomingRides = filterUpcomingRides(rides);
    const sortedRides = [...upcomingRides].sort((a, b) => {
      const dateA = dayjs(`${a.pickupDate}T${a.pickupTime}`).toDate();
      const dateB = dayjs(`${b.pickupDate}T${b.pickupTime}`).toDate();
      return dateA.getTime() - dateB.getTime();
    });
    const grouped = groupRidesByDate(sortedRides);
    setGroupedRides(grouped);
    setIsLoading(false);
  };

  const handleAcceptRide = async (rideId: string) => {
    try {
      await acceptRide(rideId, user_id);
      toast.success("Ride accepted successfully!");
      router.push("/accepted-rides");
    } catch (error) {
      console.error("Failed to accept ride:", error);
      toast.error("Failed to accept ride. Please try again.");
    }
  };

  const hasRides = rides && filterUpcomingRides(rides).length > 0;

  return (
    <div className="space-y-6 sm:space-y-8">
      {isLoading ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Loader2 className="w-12 h-12 animate-spin text-teal-600 mb-4" />
            <p className="text-lg text-gray-700">Loading available rides...</p>
          </CardContent>
        </Card>
      ) : !hasRides ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-8">
            <MapPin className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-lg text-gray-700 mb-4">
              No upcoming rides available at the moment.
            </p>
            <Button
              onClick={() => {
                setIsLoading(true);
                router.refresh();
                setTimeout(() => processRides(), 1000);
              }}
              className="flex items-center"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </CardContent>
        </Card>
      ) : (
        Object.keys(groupedRides).map((date) => (
          <div key={date} className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-semibold text-teal-600 border-b pb-2 flex items-center">
              <Calendar className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
              {date}
            </h2>
            <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {groupedRides[date].map((ride) => (
                <RideCard
                  key={ride.id}
                  ride={ride}
                  handleAcceptRide={handleAcceptRide}
                />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
