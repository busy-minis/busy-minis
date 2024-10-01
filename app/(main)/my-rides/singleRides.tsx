"use client";
import React, { useState } from "react";
import { Trash2, Eye, MapPin, Clock } from "lucide-react";
import Link from "next/link";
import {
  cancelRideById,
  getRidesForUser,
} from "@/utils/supabase/supabaseQueries";
import ConfirmationModal from "./Modal";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface SingleRidesProps {
  initialRides: any[];
  user_id: string;
}

export default function SingleRides({
  initialRides,
  user_id,
}: SingleRidesProps) {
  const [rides, setRides] = useState(initialRides);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rideToCancel, setRideToCancel] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCancel = async (id: string) => {
    setIsLoading(true);
    try {
      await cancelRideById(id);
      const updatedRides = await getRidesForUser(user_id);
      setRides(updatedRides);
      setIsModalOpen(false);
      toast({
        title: "Ride Cancelled",
        description: "Your ride has been successfully cancelled.",
        variant: "default",
      });
    } catch (error) {
      console.error("Failed to cancel the ride:", error);
      toast({
        title: "Error",
        description: "Failed to cancel the ride. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (id: string) => {
    setRideToCancel(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setRideToCancel(null);
    setIsModalOpen(false);
  };

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      month: "short",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="w-full">
      <section className="space-y-4">
        {rides.length > 0 ? (
          <ul className="space-y-4">
            {rides.map((ride: any, index: number) => (
              <motion.li
                key={ride.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-lg font-semibold text-gray-800">
                      {formatDate(ride.pickupDate)}
                    </p>
                    <p className="text-gray-600 flex items-center">
                      <Clock className="mr-1 h-4 w-4" />
                      {formatTime(ride.pickupTime)}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                      ride.status
                    )}`}
                  >
                    {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
                  </span>
                </div>
                <div className="space-y-2 mb-4">
                  <p className="text-gray-700 flex items-center">
                    <MapPin className="mr-2 h-4 w-4 text-gray-500" />
                    <span className="font-medium">From:</span>{" "}
                    {ride.pickupAddress}
                  </p>
                  <p className="text-gray-700 flex items-center">
                    <MapPin className="mr-2 h-4 w-4 text-gray-500" />
                    <span className="font-medium">To:</span>{" "}
                    {ride.dropoffAddress}
                  </p>
                </div>
                <div className="flex justify-end space-x-2">
                  <Link href={`/my-rides/session/${ride.id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>
                  </Link>
                  {/* <Button
                    onClick={() => openModal(ride.id)}
                    variant="destructive"
                    size="sm"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Cancel
                  </Button> */}
                </div>
              </motion.li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-8 bg-white rounded-lg shadow-sm">
            <p className="text-gray-600 mb-4">No single rides booked.</p>
            <Link href="/schedule-ride/single-ride">
              <Button className="bg-black text-white hover:bg-gray-800">
                Book a Single Ride
              </Button>
            </Link>
          </div>
        )}

        <ConfirmationModal
          isOpen={isModalOpen}
          onConfirm={() => rideToCancel && handleCancel(rideToCancel)}
          onCancel={closeModal}
          isLoading={isLoading}
        />
      </section>
    </div>
  );
}
