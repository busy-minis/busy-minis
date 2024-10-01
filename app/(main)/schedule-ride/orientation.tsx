"use client";

import React, { useState, useEffect, useRef } from "react";
import { format, parseISO, isBefore, startOfDay } from "date-fns";
import { CalendarCheck, CheckCircle, X } from "lucide-react";
import {
  getAvailableTimeSlots,
  bookOrientation,
  cancelOrientation,
  getUserOrientationStatus,
} from "@/utils/supabase/supabaseQueries";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

type TimeSlots = {
  [key: string]: string[];
};

export default function OrientationPage({ user_id }: { user_id: string }) {
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlots>({});
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [confirmedDate, setConfirmedDate] = useState<string>("");
  const [confirmedTime, setConfirmedTime] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function checkUserOrientationStatus() {
      const { status, date, time } = await getUserOrientationStatus(user_id);

      if (status === "scheduled") {
        setIsConfirmed(true);
        setConfirmedDate(date);
        setConfirmedTime(time);
      } else {
        const slotsByDate = await getAvailableTimeSlots();
        const availableDatesArray = Object.keys(slotsByDate).filter((date) =>
          isBefore(startOfDay(new Date()), parseISO(date))
        );
        setAvailableDates(availableDatesArray);
        setTimeSlots(slotsByDate);

        if (availableDatesArray.length > 0) {
          setSelectedDate(availableDatesArray[0]);
        }
      }
    }

    checkUserOrientationStatus();
  }, [user_id]);

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setSelectedTime("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!selectedDate || !selectedTime) {
      toast({
        title: "Error",
        description: "Please select both a date and time.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    const isBooked = await bookOrientation(user_id, selectedDate, selectedTime);

    setIsLoading(false);
    if (isBooked) {
      setIsConfirmed(true);
      setConfirmedDate(selectedDate);
      setConfirmedTime(selectedTime);
      toast({
        title: "Success",
        description: "Orientation booked successfully!",
      });
    } else {
      toast({
        title: "Error",
        description:
          "There was an error booking your orientation. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = async () => {
    const isCanceled = await cancelOrientation(
      user_id,
      confirmedDate,
      confirmedTime
    );

    if (isCanceled) {
      setIsConfirmed(false);
      setConfirmedDate("");
      setConfirmedTime("");
      setIsModalOpen(false);
      toast({
        title: "Canceled",
        description: "Your orientation has been canceled.",
      });
    } else {
      toast({
        title: "Error",
        description: "There was an error canceling your orientation.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-teal-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <CalendarCheck className="mx-auto h-16 w-16 text-teal-600" />
          <h1 className="mt-6 text-4xl font-extrabold text-gray-900 sm:text-5xl">
            {isConfirmed ? "Orientation Confirmed" : "Book Your Orientation"}
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            {isConfirmed
              ? `Your orientation is scheduled for ${format(
                  parseISO(confirmedDate),
                  "MMMM d, yyyy"
                )} at ${confirmedTime}.`
              : "Schedule your orientation to get started with our service."}
          </p>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>
              {isConfirmed ? "Orientation Details" : "Select Your Orientation"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!isConfirmed ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="date"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Select Date
                  </label>
                  <Select onValueChange={handleDateChange} value={selectedDate}>
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue placeholder="Choose a date" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableDates.map((date) => (
                        <SelectItem key={date} value={date}>
                          {format(parseISO(date), "MMMM d, yyyy")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label
                    htmlFor="time"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Select Time
                  </label>
                  <Select onValueChange={setSelectedTime} value={selectedTime}>
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue placeholder="Choose a time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots[selectedDate]?.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </form>
            ) : (
              <div className="text-center">
                <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                <p className="mt-4 text-lg text-gray-600">
                  You will receive a call on{" "}
                  {format(parseISO(confirmedDate), "MMMM d, yyyy")} at{" "}
                  {confirmedTime} to verify your account.
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end">
            {!isConfirmed ? (
              <Button
                type="submit"
                onClick={handleSubmit}
                disabled={isLoading || !selectedDate || !selectedTime}
              >
                {isLoading ? "Booking..." : "Confirm Orientation"}
              </Button>
            ) : (
              <Button
                variant="destructive"
                onClick={() => setIsModalOpen(true)}
              >
                Cancel Orientation
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Orientation?</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel your orientation? You can make a
              new appointment if you change your mind.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              No, Keep It
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancel}
              ref={cancelButtonRef}
            >
              Yes, Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
