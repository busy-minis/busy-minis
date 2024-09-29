"use client";

import React from "react";
import { CalendarCheck, Info } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DaySelectorProps {
  selectedDays: string[];
  onDaySelection: (day: string) => void;
}

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const DaySelector: React.FC<DaySelectorProps> = ({
  selectedDays,
  onDaySelection,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <CalendarCheck className="mr-2" />
          Select Days of the Week
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {daysOfWeek.map((day) => (
            <div key={day} className="flex items-center space-x-2">
              <Checkbox
                id={day}
                checked={selectedDays.includes(day)}
                onCheckedChange={() => onDaySelection(day)}
              />
              <Label htmlFor={day}>{day}</Label>
            </div>
          ))}
        </div>
        <Alert className="mt-4">
          <Info className="h-4 w-4" />
          <AlertDescription>
            Weekly rides will not be booked on the same day and will start on
            the next calendar day.
          </AlertDescription>
        </Alert>
        <Alert className="mt-2">
          <Info className="h-4 w-4" />
          <AlertDescription>
            You must select at least 4 days for weekly rides.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default DaySelector;
