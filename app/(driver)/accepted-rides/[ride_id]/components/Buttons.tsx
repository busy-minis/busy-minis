"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface ButtonsProps {
  onStart: () => void;
  onEnd: () => void;
  onCancel: () => void;
  rideStarted: boolean;
  isWeekly: boolean;
  status: string;
}

const Buttons: React.FC<ButtonsProps> = ({
  onStart,
  onEnd,
  onCancel,
  rideStarted,
  isWeekly,
  status,
}) => {
  const isRefunded = status === "refunded";
  const isCancelled = status === "cancelled";

  return (
    <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
      <Button
        onClick={onStart}
        disabled={rideStarted || isRefunded || isCancelled}
        variant={rideStarted ? "secondary" : "default"}
        className="w-full"
      >
        {rideStarted ? "Ride Started" : "Start Ride"}
      </Button>
      <Button
        onClick={onEnd}
        disabled={!rideStarted || isRefunded || isCancelled}
        variant="destructive"
        className="w-full"
      >
        End Ride
      </Button>
      {!isRefunded && !isCancelled && (
        <Button onClick={onCancel} variant="outline" className="w-full">
          Cancel Ride
        </Button>
      )}
    </div>
  );
};

export default Buttons;
