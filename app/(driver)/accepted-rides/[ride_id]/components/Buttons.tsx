"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, X } from "lucide-react";

interface ButtonsProps {
  onStart: () => void;
  onEnd: () => void;
  onCancel: () => void;
  rideStarted: boolean;
  status: string;
}

const Buttons: React.FC<ButtonsProps> = ({
  onStart,
  onEnd,
  onCancel,
  rideStarted,
  status,
}) => {
  const isRefunded = status === "refunded";
  const isCancelled = status === "cancelled";

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Button
          onClick={onStart}
          disabled={rideStarted || isRefunded || isCancelled}
          variant={rideStarted ? "secondary" : "default"}
          className="w-full"
        >
          <Play className="mr-2 h-4 w-4" />
          {rideStarted ? "Ride Started" : "Start Ride"}
        </Button>
        <Button
          onClick={onEnd}
          disabled={!rideStarted || isRefunded || isCancelled}
          variant="destructive"
          className="w-full"
        >
          <Pause className="mr-2 h-4 w-4" />
          End Ride
        </Button>
      </div>
      {!isRefunded && !isCancelled && (
        <Button onClick={onCancel} variant="outline" className="w-full">
          <X className="mr-2 h-4 w-4" />
          Cancel Ride
        </Button>
      )}
    </div>
  );
};

export default Buttons;
