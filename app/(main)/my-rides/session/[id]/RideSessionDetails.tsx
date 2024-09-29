"use client";

import React, { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Check,
  Clock,
  Hourglass,
  MapPin,
  X,
  UserCheck,
  RotateCcw,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Driver {
  id: string;
  first_name: string;
  last_name: string;
  photo_url: string;
  license_plate: string;
  vehicle_brand: string;
  vehicle_year: string;
  vehicle_color: string;
  email: string;
  phone_number: string;
  driver: boolean;
}

interface RideSessionDetailsProps {
  rideSession: {
    id: string;
    pickupDate: string;
    pickupTime: string;
    pickupAddress: string;
    dropoffAddress: string;
    riders: { name: string }[];
    status: string;
    ride_link: string;
    driver_id?: string | null;
  };
  userId: string;
  driver?: Driver | null;
}

export default function RideSessionDetails({
  rideSession,
  userId,
  driver,
}: RideSessionDetailsProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(rideSession.status);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [currentDriver, setCurrentDriver] = useState(driver || null);

  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const channelName = `ride_updates_${rideSession.id}`;
    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "rides",
          filter: `id=eq.${rideSession.id}`,
        },
        (payload) => {
          const updatedStatus = payload.new.status;
          setStatus(updatedStatus);

          if (updatedStatus === "accepted" && payload.new.driver_id) {
            fetchDriverInfo(payload.new.driver_id);
          }
        }
      )
      .subscribe();

    const fetchDriverInfo = async (driverId: string) => {
      try {
        const { data: updatedDriver, error: driverError } = await supabase
          .from("drivers")
          .select("*")
          .eq("id", driverId)
          .single();

        if (driverError) {
          console.error("Error fetching updated driver info:", driverError);
        } else {
          setCurrentDriver(updatedDriver);
        }
      } catch (err) {
        console.error("Error in fetchDriverInfo:", err);
      }
    };

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, rideSession.id]);

  const handleCancelRide = async () => {
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("rides")
        .update({ status: "cancelled" })
        .eq("id", rideSession.id);

      if (error) throw error;

      setStatus("cancelled");
      setShowCancelModal(false);
      toast({
        title: "Ride Cancelled",
        description: "Your ride has been cancelled successfully.",
      });
      router.refresh();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "An error occurred while cancelling your ride.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return {
          text: "Completed",
          icon: <Check className="h-5 w-5 text-green-500" />,
          color: "bg-green-100 text-green-800",
          description: "Your ride has been completed successfully.",
        };
      case "ongoing":
        return {
          text: "Ongoing",
          icon: <MapPin className="h-5 w-5 text-blue-500" />,
          color: "bg-blue-100 text-blue-800",
          description:
            "Your ride is currently in progress. Track it in real-time.",
        };
      case "pending":
        return {
          text: "Pending",
          icon: <Hourglass className="h-5 w-5 text-orange-500" />,
          color: "bg-orange-100 text-orange-800",
          description: "Waiting for a driver to accept your ride.",
        };
      case "accepted":
        return {
          text: "Accepted",
          icon: <UserCheck className="h-5 w-5 text-blue-500" />,
          color: "bg-blue-100 text-blue-800",
          description: "A driver has accepted your ride.",
        };
      case "cancelled":
        return {
          text: "Cancelled",
          icon: <X className="h-5 w-5 text-red-500" />,
          color: "bg-red-100 text-red-800",
          description: "Your ride has been cancelled.",
        };
      default:
        return {
          text: status,
          icon: <Clock className="h-5 w-5 text-gray-500" />,
          color: "bg-gray-100 text-gray-800",
          description: "Unknown status.",
        };
    }
  };

  const statusInfo = getStatusInfo(status);

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-end mb-4">
        <Button onClick={() => router.refresh()} variant="outline">
          <RotateCcw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <Dialog open={showCancelModal} onOpenChange={setShowCancelModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Cancellation</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this ride?{" "}
              <span className="font-semibold text-red-600">
                You may not be refunded.
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCancelModal(false)}>
              No, Keep Ride
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelRide}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Cancelling..." : "Yes, Cancel Ride"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Ride Details</CardTitle>
            <p className="text-2xl font-semibold">
              {format(
                parseISO(`2021-01-01T${rideSession.pickupTime}`),
                "hh:mm a"
              )}
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="font-semibold">Ride ID:</p>
              <p>{rideSession.id}</p>
            </div>
            <div>
              <p className="font-semibold">Date:</p>
              <p>
                {format(
                  new Date(rideSession.pickupDate),
                  "EEEE, MMMM dd, yyyy"
                )}
              </p>
            </div>
            <div>
              <p className="font-semibold">Pickup Address:</p>
              <p>{rideSession.pickupAddress}</p>
            </div>
            <div>
              <p className="font-semibold">Drop-off Address:</p>
              <p>{rideSession.dropoffAddress}</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="font-semibold">Rider(s):</p>
            <p>
              {rideSession.riders && rideSession.riders.length > 0
                ? rideSession.riders.map((rider: any, index: number) => (
                    <span key={index}>
                      {rider.name}
                      {index < rideSession.riders.length - 1 && ", "}
                    </span>
                  ))
                : "No riders added."}
            </p>
          </div>

          <div className="mt-6 flex items-center justify-center">
            <Badge
              variant="outline"
              className={`${statusInfo.color} text-lg px-3 py-1`}
            >
              {statusInfo.icon}
              <span className="ml-2">{statusInfo.text}</span>
            </Badge>
          </div>

          {statusInfo.description && (
            <p className="mt-4 text-center text-sm text-gray-600">
              {statusInfo.description}
            </p>
          )}

          {currentDriver && status.toLowerCase() === "accepted" && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Driver Information</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage
                    src={currentDriver.photo_url}
                    alt={`${currentDriver.first_name} ${currentDriver.last_name}`}
                  />
                  <AvatarFallback>
                    {currentDriver.first_name[0]}
                    {currentDriver.last_name[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p>
                    <span className="font-semibold">Name:</span>{" "}
                    {currentDriver.first_name} {currentDriver.last_name}
                  </p>
                  <p>
                    <span className="font-semibold">Email:</span>{" "}
                    {currentDriver.email}
                  </p>
                  <p>
                    <span className="font-semibold">Phone:</span>{" "}
                    {currentDriver.phone_number}
                  </p>
                  <p>
                    <span className="font-semibold">Vehicle:</span>{" "}
                    {currentDriver.vehicle_year} {currentDriver.vehicle_brand} (
                    {currentDriver.vehicle_color}) -{" "}
                    {currentDriver.license_plate}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {status.toLowerCase() === "ongoing" && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Real-Time Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  You can track your ride in real-time using the button below.
                </p>
                <Button asChild>
                  <a
                    href={rideSession.ride_link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open in Google Maps
                  </a>
                </Button>
              </CardContent>
            </Card>
          )}

          <div className="mt-6 space-y-4">
            {status.toLowerCase() !== "cancelled" &&
              status.toLowerCase() !== "completed" && (
                <>
                  {status.toLowerCase() === "ongoing" ? (
                    <Button asChild className="w-full">
                      <Link href={`/my-rides/session/${rideSession.id}`}>
                        View Ongoing Ride
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  ) : (
                    <p className="text-sm text-gray-600 text-center">
                      The link to location tracking will be available when the
                      driver has picked up the passenger.
                    </p>
                  )}
                </>
              )}
            <Button
              variant="destructive"
              className="w-full"
              onClick={() => setShowCancelModal(true)}
              disabled={
                isSubmitting ||
                status.toLowerCase() === "cancelled" ||
                status.toLowerCase() === "completed"
              }
            >
              Cancel Ride
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
