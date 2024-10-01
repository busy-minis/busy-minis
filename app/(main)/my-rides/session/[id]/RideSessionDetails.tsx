"use client";

import React, { useState, useEffect } from "react";
import { format, parseISO, addDays } from "date-fns";
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
  Car,
  Calendar,
  MapPinned,
  Users,
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
import { motion } from "framer-motion";

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
    total_cost: number;
    weekly: boolean;
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
      if (!rideSession.weekly) {
        // Process refund for single rides
        const refundResponse = await fetch("/api/refund", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ rideId: rideSession.id }),
        });

        if (!refundResponse.ok) {
          throw new Error("Failed to process refund");
        }

        const refundResult = await refundResponse.json();

        if (refundResult.success) {
          setStatus("refunded");
          toast({
            title: "Ride Cancelled and Refunded",
            description:
              "Your ride has been cancelled and refunded successfully. The refund will appear in your account within 5-10 business days.",
          });
        } else {
          throw new Error("Refund failed");
        }
      } else {
        // For weekly rides, just cancel without refund
        const { error } = await supabase
          .from("rides")
          .update({ status: "cancelled" })
          .eq("id", rideSession.id);

        if (error) throw error;

        setStatus("cancelled");
        toast({
          title: "Ride Cancelled",
          description: "Your weekly ride has been cancelled successfully.",
        });
      }

      setShowCancelModal(false);
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
      case "refunded":
        return {
          text: "Refunded",
          icon: <RotateCcw className="h-5 w-5 text-green-500" />,
          color: "bg-green-100 text-green-800",
          description:
            "Your ride has been cancelled and refunded. The refund will appear in your account within 5-10 business days.",
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

  // Fix for date discrepancy
  const adjustedDate = addDays(new Date(rideSession.pickupDate), 1);

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-end mb-4"
      >
        <Button onClick={() => router.refresh()} variant="outline">
          <RotateCcw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </motion.div>

      <Dialog open={showCancelModal} onOpenChange={setShowCancelModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Cancellation</DialogTitle>
            <DialogDescription>
              {rideSession.weekly
                ? "Are you sure you want to cancel this weekly ride? You will not be refunded for weekly rides."
                : "Are you sure you want to cancel this ride? You will be refunded the full amount."}
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

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className=" shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl font-bold text-zinc-800">
                Ride Details
              </CardTitle>
              <p className="text-3xl font-semibold text-zinc-700">
                {format(
                  parseISO(`2021-01-01T${rideSession.pickupTime}`),
                  "hh:mm a"
                )}
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-2">
                <Car className="h-5 w-5 text-zinc-600" />
                <div>
                  <p className="font-semibold text-zinc-800">Ride ID:</p>
                  <p className="text-zinc-600">{rideSession.id}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-zinc-600" />
                <div>
                  <p className="font-semibold text-zinc-800">Date:</p>
                  <p className="text-zinc-600">
                    {format(adjustedDate, "EEEE, MMMM dd, yyyy")}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <MapPinned className="h-5 w-5 text-zinc-600" />
                <div>
                  <p className="font-semibold text-zinc-800">Pickup Address:</p>
                  <p className="text-zinc-600">{rideSession.pickupAddress}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-zinc-600" />
                <div>
                  <p className="font-semibold text-zinc-800">
                    Drop-off Address:
                  </p>
                  <p className="text-zinc-600">{rideSession.dropoffAddress}</p>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center space-x-2">
              <Users className="h-5 w-5 text-zinc-600" />
              <div>
                <p className="font-semibold text-zinc-800">Rider(s):</p>
                <p className="text-zinc-600">
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
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mt-6 flex items-center justify-center"
            >
              <Badge
                variant="outline"
                className={`${statusInfo.color} text-lg px-3 py-1 shadow-md`}
              >
                {statusInfo.icon}
                <span className="ml-2">{statusInfo.text}</span>
              </Badge>
            </motion.div>

            {statusInfo.description && (
              <p className="mt-4 text-center text-sm text-indigo-700">
                {statusInfo.description}
              </p>
            )}

            {currentDriver && status.toLowerCase() === "accepted" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <Card className="mt-6 bg-white">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-indigo-800">
                      Driver Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-center space-x-4">
                    <Avatar className="h-20 w-20 border-2 border-indigo-500">
                      <AvatarImage
                        src={currentDriver.photo_url}
                        alt={`${currentDriver.first_name} ${currentDriver.last_name}`}
                      />
                      <AvatarFallback className="bg-indigo-200 text-indigo-700">
                        {currentDriver.first_name[0]}
                        {currentDriver.last_name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-indigo-800">
                        <span className="font-semibold">Name:</span>{" "}
                        {currentDriver.first_name} {currentDriver.last_name}
                      </p>
                      <p className="text-indigo-700">
                        <span className="font-semibold">Email:</span>{" "}
                        {currentDriver.email}
                      </p>
                      <p className="text-indigo-700">
                        <span className="font-semibold">Phone:</span>{" "}
                        {currentDriver.phone_number}
                      </p>
                      <p className="text-indigo-700">
                        <span className="font-semibold">Vehicle:</span>{" "}
                        {currentDriver.vehicle_year}{" "}
                        {currentDriver.vehicle_brand} (
                        {currentDriver.vehicle_color}) -{" "}
                        {currentDriver.license_plate}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {status.toLowerCase() === "ongoing" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <Card className="mt-6 bg-white">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-indigo-800">
                      Real-Time Tracking
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-indigo-700">
                      You can track your ride in real-time using the button
                      below.
                    </p>
                    <Button
                      asChild
                      className="bg-indigo-600 hover:bg-indigo-700"
                    >
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
              </motion.div>
            )}

            <div className="mt-6 space-y-4">
              {status.toLowerCase() === "ongoing" && (
                <Button
                  asChild
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                >
                  <a
                    href={rideSession.ride_link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Ongoing Ride
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              )}
              {status.toLowerCase() !== "cancelled" &&
                status.toLowerCase() !== "completed" &&
                status.toLowerCase() !== "refunded" && (
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => setShowCancelModal(true)}
                    disabled={isSubmitting}
                  >
                    Cancel Ride
                  </Button>
                )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
