"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  format,
  parseISO,
  addDays,
  isSameDay,
  isBefore,
  addWeeks,
} from "date-fns";
import { createClient } from "@/utils/supabase/client";
import {
  CheckCircle,
  Clock,
  XCircle,
  MapPin,
  Info,
  Calendar,
  Users,
} from "lucide-react";
import Link from "next/link";
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
import { useToast } from "@/hooks/use-toast";

interface ManageWeeklyRideProps {
  weeklyRide: {
    id: string;
    renewal_date: string;
    pickupTime: string;
    pickupAddress: string;
    dropoffAddress: string;
    riders: { name: string }[];
    selectedDays: string[];
    status: string;
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
  const { toast } = useToast();
  useEffect(() => {
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
          setLastRideDate(parseISO(weeklyRide.renewal_date));
        }
      } catch (error) {
        console.error(error);
        setError("An error occurred while fetching ride sessions.");
      }
    };

    fetchRideSessions();
  }, [supabase, weeklyRide.id, weeklyRide.renewal_date]);

  const isRenewButtonVisible = lastRideDate
    ? isSameDay(lastRideDate, new Date()) || isBefore(lastRideDate, new Date())
    : false;

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
      const { error: updateError } = await supabase
        .from("weekly_rides")
        .update({ status: "canceled" })
        .eq("id", weeklyRide.id);

      if (updateError) throw updateError;

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

      setShowCancelModal(false);
      toast({
        title: "Weekly Ride Canceled",
        description: "Your weekly ride subscription has been canceled.",
      });
      router.push("/my-rides");
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "An error occurred while canceling your weekly ride.",
        variant: "destructive",
      });
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

      const newRideSessions: any[] = [];
      const renewalDate = parseISO(weeklyRide.renewal_date);
      const startDate = addDays(renewalDate, 1);
      const numWeeks = 1;

      for (let week = 0; week < numWeeks; week++) {
        weeklyRide.selectedDays.forEach((day) => {
          const dayNumber = getDayNameToNumber(day);
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
          });
        });
      }

      if (newRideSessions.length > 0) {
        const { error: insertError } = await supabase
          .from("rides")
          .insert(newRideSessions);

        if (insertError) throw insertError;

        toast({
          title: "Weekly Ride Renewed",
          description: "Your weekly ride has been renewed successfully.",
        });

        const newRenewalDate = addWeeks(renewalDate, numWeeks);
        const { error: renewalError } = await supabase
          .from("weekly_rides")
          .update({ renewal_date: format(newRenewalDate, "yyyy-MM-dd") })
          .eq("id", weeklyRide.id);

        if (renewalError) throw renewalError;

        router.refresh();
      } else {
        toast({
          title: "No New Rides Added",
          description: "Please contact support for assistance.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "An error occurred while renewing your weekly ride.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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

  const getNextDateByDay = (startDate: Date, dayNumber: number) => {
    const currentDay = startDate.getDay();
    const difference = (dayNumber + 7 - currentDay) % 7;
    return addDays(startDate, difference);
  };

  return (
    <div className="container mx-auto py-8">
      <Dialog open={showCancelModal} onOpenChange={setShowCancelModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Cancellation</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel your weekly ride subscription?{" "}
              <span className="font-semibold text-red-600">
                You will not be refunded.
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCancelModal(false)}>
              No, Keep Ride
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelWeeklyRide}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Canceling..." : "Yes, Cancel Ride"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle>Manage Your Weekly Ride</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded mb-4 flex items-center">
              <Info className="mr-2" />
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Ride Information</h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <p>
                  <span className="font-semibold">Ride ID:</span>{" "}
                  {weeklyRide.id}
                </p>
                <p>
                  <span className="font-semibold">Pickup Time:</span>{" "}
                  {format(
                    parseISO(`2021-01-01T${weeklyRide.pickupTime}`),
                    "hh:mm a"
                  )}
                </p>
                <p>
                  <span className="font-semibold">Pickup Address:</span>{" "}
                  {weeklyRide.pickupAddress}
                </p>
                <p>
                  <span className="font-semibold">Drop-off Address:</span>{" "}
                  {weeklyRide.dropoffAddress}
                </p>
                <p>
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

            <div className="text-center">
              <p>
                Renewal Date:{" "}
                <span className="font-semibold">
                  {format(parseISO(weeklyRide.renewal_date), "MMMM dd, yyyy")}
                </span>
              </p>
              {isRenewButtonVisible && (
                <p className="mt-1">
                  You can renew your weekly ride subscription now.
                </p>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Scheduled Rides</h3>
              <div className="space-y-3">
                {rideSessions.map((session) => (
                  <Card key={session.id}>
                    <CardContent className="flex items-center justify-between p-4">
                      <div>
                        <p className="font-semibold">
                          {format(session.pickupDate, "EEEE, MMMM dd, yyyy")}
                        </p>
                        <p className="text-sm text-gray-600">
                          Pickup Time:{" "}
                          {format(
                            parseISO(`2021-01-01T${weeklyRide.pickupTime}`),
                            "hh:mm a"
                          )}
                        </p>
                        <div className="flex text-sm mt-1 items-center gap-2">
                          <Badge className=" " variant={"secondary"}>
                            {session.status}
                          </Badge>
                          {session.status.toLowerCase() === "pending" && (
                            <p className="text-yellow-600 ">
                              This ride is awaiting driver confirmation.
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-center ">
                        <Button asChild size="sm">
                          <Link href={`/my-rides/session/${session.id}`}>
                            View Ride
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="text-center text-red-600 font-semibold">
              Please note: If you cancel your weekly ride, you will not be
              refunded.
            </div>

            <div className="text-center">
              <p>
                For changes or more information, please{" "}
                <Link href="/contact" className="text-primary hover:underline">
                  contact us
                </Link>
                .
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="destructive"
                onClick={() => setShowCancelModal(true)}
                disabled={isSubmitting}
                className="w-full"
              >
                Cancel Weekly Ride
              </Button>
              {isRenewButtonVisible && (
                <Button
                  onClick={handleRenewWeeklyRide}
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? "Renewing..." : "Renew Ride"}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
