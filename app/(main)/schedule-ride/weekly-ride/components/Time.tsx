"use client";

import React from "react";
import { Clock, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface TimeProps {
  selectedTime: string;
  onTimeChange: (time: string) => void;
  timeWarning: string;
  setTimeWarning: (warning: string) => void;
  dateError: string;
}

const Time: React.FC<TimeProps> = ({
  selectedTime,
  onTimeChange,
  timeWarning,
  setTimeWarning,
  dateError,
}) => {
  const handleTimeChange = (time: string) => {
    const [hours] = time.split(":").map(Number);

    if (hours < 8 || hours > 18) {
      setTimeWarning(
        "Selecting an off-peak time (before 8 AM or after 6 PM) will incur an additional fee."
      );
    } else {
      setTimeWarning("");
    }

    onTimeChange(time);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <Clock className="mr-2" />
          Select Time
        </CardTitle>
      </CardHeader>
      <CardContent>
        {dateError && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{dateError}</AlertDescription>
          </Alert>
        )}
        <Input
          type="time"
          value={selectedTime}
          onChange={(e) => handleTimeChange(e.target.value)}
          required
        />
        {timeWarning && (
          <Alert className="mt-4">
            <Info className="h-4 w-4" />
            <AlertDescription>{timeWarning}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default Time;
