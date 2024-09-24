// ManageWeeklyRide.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  format,
  parseISO,
  addDays,
  isSameDay,
  isBefore,
  isAfter,
  addWeeks,
  getDay,
} from "date-fns";
import { createClient } from "@/utils/supabase/client";
import {
  CheckCircle,
  Clock,
  XCircle,
  MapPin,
  Info,
} from "@phosphor-icons/react";
import Link from "next/link";

interface ManageWeeklyRideProps {
  weeklyRide: {
    id: string;
    renewal_date: string; // New Field
    pickupTime: string;
    pickupAddress: string;
    dropoffAddress: string;
    riders: { name: string }[];
    selectedDays: string[]; // e.g., ['Monday', 'Wednesday']
    status: string;
    // Add other necessary fields if any
  };
  userId: string;
}

export default function ManageWeeklyRide({
  weeklyRide,
  userId,
}: ManageWeeklyRideProps) {
  const [rideSessions, setRideSessions] = useState<any[]>([]);
  const [lastRideDate, setLastRideDate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Fetch ride_sessions associated with this weekly ride
    const fetchRideSessions = async () => {
      try {
        const { data: sessions, error: rideSessionsError } = await supabase
          .from("rides")
          .select("id, pickupDate, status")
          .eq("weekly_ride_id", weeklyRide.id)
          .order("pickupDate", { ascending: true });

        if (rideSessionsError) throw rideSessionsError;

        const parsedSessions = sessions.map((session: any) => ({
          ...session,
          pickupDate: parseISO(session.pickupDate),
        }));

        setRideSessions(parsedSessions);

        if (parsedSessions.length > 0) {
          setLastRideDate(parsedSessions[parsedSessions.length - 1].pickupDate);
        } else {
          // If no sessions, use renewal_date as the last ride date
          setLastRideDate(parseISO(weeklyRide.renewal_date));
        }
      } catch (error) {
        console.error(error);
        setError("An error occurred while fetching ride sessions.");
      }
    };

    fetchRideSessions();
  }, [supabase, weeklyRide.id, weeklyRide.renewal_date]);

  // Determine if the Renew button should be visible
  const isRenewButtonVisible = lastRideDate
    ? isSameDay(lastRideDate, new Date()) || isBefore(lastRideDate, new Date())
    : false;

  // Function to determine badge color based on status
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "canceled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-gray-200 text-gray-600";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleCancelWeeklyRide = async () => {
    setIsSubmitting(true);

    try {
      // Update the weekly_rides table to set status to 'canceled'
      const { error: updateError } = await supabase
        .from("weekly_rides")
        .update({ status: "canceled" })
        .eq("id", weeklyRide.id);

      if (updateError) throw updateError;

      // Delete all future ride_sessions associated with this weekly ride
      const today = new Date();

      const { data: futureSessions, error: futureSessionsError } =
        await supabase
          .from("rides")
          .select("id, pickupDate")
          .eq("weekly_ride_id", weeklyRide.id)
          .gte("pickupDate", format(today, "yyyy-MM-dd"));

      if (futureSessionsError) throw futureSessionsError;

      if (futureSessions.length > 0) {
        const { error: deleteError } = await supabase
          .from("rides")
          .delete()
          .in(
            "id",
            futureSessions.map((session: any) => session.id)
          );

        if (deleteError) throw deleteError;
      }

      // Close the modal and show success message
      setShowCancelModal(false);
      alert("Your weekly ride subscription has been canceled.");
      router.push("/my-rides");
    } catch (error) {
      console.error(error);
      alert("An error occurred while canceling your weekly ride.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRenewWeeklyRide = async () => {
    setIsSubmitting(true);

    try {
      if (!lastRideDate) {
        throw new Error("Last ride date is not available.");
      }

      // Calculate new ride_sessions based on the selectedDays
      const newRideSessions: any[] = [];
      const renewalDate = parseISO(weeklyRide.renewal_date);
      const startDate = addDays(renewalDate, 1); // Day after the renewal date
      const numWeeks = 1; // Extend by 1 week (adjust as needed)

      // Generate dates for the next 'numWeeks' weeks based on selectedDays
      for (let week = 0; week < numWeeks; week++) {
        weeklyRide.selectedDays.forEach((day) => {
          const dayNumber = getDayNameToNumber(day); // Convert day name to number
          const date = addDays(startDate, week * 7);
          const nextDate = getNextDateByDay(date, dayNumber);
          newRideSessions.push({
            user_id: userId,
            weekly_ride_id: weeklyRide.id,
            pickupDate: format(nextDate, "yyyy-MM-dd"),
            pickupTime: weeklyRide.pickupTime,
            pickupAddress: weeklyRide.pickupAddress,
            dropoffAddress: weeklyRide.dropoffAddress,
            riders: weeklyRide.riders,
            status: "available",
            // Add other necessary fields as per your database schema
          });
        });
      }

      // Insert new ride_sessions
      if (newRideSessions.length > 0) {
        const { error: insertError } = await supabase
          .from("rides")
          .insert(newRideSessions);

        if (insertError) throw insertError;

        alert("Your weekly ride has been renewed.");
        // Update the renewal_date to the next week
        const newRenewalDate = addWeeks(renewalDate, numWeeks);
        const { error: renewalError } = await supabase
          .from("weekly_rides")
          .update({ renewal_date: format(newRenewalDate, "yyyy-MM-dd") })
          .eq("id", weeklyRide.id);

        if (renewalError) throw renewalError;

        // Refresh the data
        router.refresh();
      } else {
        alert("No new rides were added. Please contact support.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while renewing your weekly ride.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to convert day name to day number
  const getDayNameToNumber = (dayName: string) => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days.indexOf(dayName);
  };

  // Helper function to get the next date by day number
  const getNextDateByDay = (startDate: Date, dayNumber: number) => {
    const currentDay = startDate.getDay();
    const difference = (dayNumber + 7 - currentDay) % 7;
    return addDays(startDate, difference);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-500 to-teal-100 py-6 px-4">
      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm mx-auto">
            <div className="flex items-center mb-4">
              <XCircle size={28} className="text-red-600 mr-2" />
              <h3 className="text-lg md:text-xl font-semibold text-gray-800">
                Confirm Cancellation
              </h3>
            </div>
            <p className="text-gray-700 mb-6 text-sm md:text-base">
              Are you sure you want to cancel your weekly ride subscription?{" "}
              <span className="font-semibold text-red-600">
                You will not be refunded.
              </span>
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowCancelModal(false)}
                className="bg-gray-200 text-gray-700 px-3 py-2 rounded-md text-sm md:text-base hover:bg-gray-300 transition duration-200"
              >
                No, Keep Ride
              </button>
              <button
                onClick={handleCancelWeeklyRide}
                disabled={isSubmitting}
                className="bg-red-600 text-white px-3 py-2 rounded-md text-sm md:text-base hover:bg-red-700 transition duration-200 disabled:opacity-50"
              >
                {isSubmitting ? "Canceling..." : "Yes, Cancel Ride"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto bg-white shadow-2xl rounded-2xl p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-4 md:mb-6 text-center">
          Manage Your Weekly Ride
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4 text-sm md:text-base flex items-center">
            <Info size={20} className="mr-2" />
            {error}
          </div>
        )}

        {/* Ride Details Section */}
        <div className="mb-6 md:mb-8">
          <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2 md:mb-4">
            Ride Information
          </h3>
          <div className="bg-gray-50 p-4 md:p-6 rounded-lg">
            <p className="text-gray-700 mb-1 md:mb-2 text-sm md:text-base">
              <span className="font-semibold">Ride ID:</span> {weeklyRide.id}
            </p>
            <p className="text-gray-700 mb-1 md:mb-2 text-sm md:text-base">
              <span className="font-semibold">Pickup Time:</span>{" "}
              {format(
                parseISO(`2021-01-01T${weeklyRide.pickupTime}`),
                "hh:mm a"
              )}
            </p>
            <p className="text-gray-700 mb-1 md:mb-2 text-sm md:text-base">
              <span className="font-semibold">Pickup Address:</span>{" "}
              {weeklyRide.pickupAddress}
            </p>
            <p className="text-gray-700 mb-1 md:mb-2 text-sm md:text-base">
              <span className="font-semibold">Drop-off Address:</span>{" "}
              {weeklyRide.dropoffAddress}
            </p>
            <p className="text-gray-700 text-sm md:text-base">
              <span className="font-semibold">Rider(s):</span>{" "}
              {weeklyRide.riders && weeklyRide.riders.length > 0
                ? weeklyRide.riders.map((rider, index) => (
                    <span key={index}>
                      {rider.name}
                      {index < weeklyRide.riders.length - 1 && ", "}
                    </span>
                  ))
                : "No riders added."}
            </p>
          </div>
        </div>

        {/* Renewal Date Information */}
        <div className="mb-4 md:mb-6 text-center">
          <p className="text-gray-700 text-sm md:text-base">
            Renewal Date:{" "}
            <span className="font-semibold text-gray-900">
              {format(parseISO(weeklyRide.renewal_date), "MMMM dd, yyyy")}
            </span>
          </p>
          {isRenewButtonVisible && (
            <p className="text-gray-700 mt-1 text-sm md:text-base">
              You can renew your weekly ride subscription now.
            </p>
          )}
        </div>

        {/* Scheduled Rides Ordered by Date */}
        <div className="mb-6 md:mb-8">
          <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2 md:mb-4">
            Scheduled Rides
          </h3>
          <div className="space-y-3">
            {rideSessions.map((session) => (
              <div
                key={session.id}
                className={`bg-white border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between shadow-sm ${
                  session.status.toLowerCase() === "completed"
                    ? "opacity-50"
                    : ""
                }`}
              >
                <div>
                  <p className="font-semibold text-base md:text-lg text-gray-800">
                    {format(session.pickupDate, "EEEE, MMMM dd, yyyy")}
                  </p>
                  <p className="text-sm md:text-base text-gray-600 mt-1">
                    Pickup Time:{" "}
                    {format(
                      parseISO(`2021-01-01T${weeklyRide.pickupTime}`),
                      "hh:mm a"
                    )}
                  </p>
                  {session.status.toLowerCase() === "pending" && (
                    <p className="text-yellow-600 text-sm md:text-base mt-1">
                      This ride is awaiting driver confirmation.
                    </p>
                  )}
                </div>
                <div className="flex items-center mt-2 md:mt-0">
                  {/* Status Indicator */}
                  <div className="flex items-center">
                    {session.status.toLowerCase() === "completed" ? (
                      <>
                        <CheckCircle
                          size={20}
                          className="text-green-500 mr-1 md:mr-2"
                        />
                        <span className="text-green-600 font-medium text-sm md:text-base">
                          Completed
                        </span>
                      </>
                    ) : session.status.toLowerCase() === "ongoing" ? (
                      <>
                        <MapPin
                          size={20}
                          className="text-blue-500 mr-1 md:mr-2"
                        />
                        <span className="text-blue-600 font-medium text-sm md:text-base">
                          Ongoing
                        </span>
                      </>
                    ) : session.status.toLowerCase() === "available" ? (
                      <>
                        <Clock
                          size={20}
                          className="text-yellow-500 mr-1 md:mr-2"
                        />
                        <span className="text-yellow-600 font-medium text-sm md:text-base">
                          Available
                        </span>
                      </>
                    ) : (
                      <>
                        <Clock
                          size={20}
                          className="text-gray-500 mr-1 md:mr-2"
                        />
                        <span className="text-gray-600 font-medium text-sm md:text-base">
                          {session.status}
                        </span>
                      </>
                    )}
                  </div>
                  {/* Add the "View Ride" button */}
                  <Link href={`/my-rides/session/${session.id}`}>
                    <button className="ml-2 md:ml-4 bg-teal-600 text-white px-3 py-1 md:px-4 md:py-2 rounded-md text-sm md:text-base hover:bg-teal-700 transition duration-200">
                      View Ride
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cancellation Notice */}
        <div className="mb-4 md:mb-6 text-center">
          <p className="text-red-600 font-semibold text-sm md:text-base">
            Please note: If you cancel your weekly ride, you will not be
            refunded.
          </p>
        </div>

        {/* Contact Information */}
        <div className="mb-6 md:mb-8 text-center">
          <p className="text-gray-700 text-sm md:text-base">
            For changes or more information, please{" "}
            <Link href="/contact">
              <span className="text-teal-600 font-semibold hover:underline cursor-pointer">
                contact us
              </span>
            </Link>
            .
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-3 md:gap-4">
          <button
            onClick={() => setShowCancelModal(true)}
            disabled={isSubmitting}
            className="w-full bg-red-600 text-white py-3 md:py-4 rounded-lg font-semibold text-base md:text-lg hover:bg-red-700 transition duration-300 disabled:opacity-50"
          >
            Cancel Weekly Ride
          </button>
          {isRenewButtonVisible && (
            <button
              onClick={handleRenewWeeklyRide}
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-teal-600 to-teal-500 text-white py-3 md:py-4 rounded-lg font-semibold text-base md:text-lg hover:opacity-90 transition duration-300 disabled:opacity-50"
            >
              {isSubmitting ? "Renewing..." : "Renew Ride"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
