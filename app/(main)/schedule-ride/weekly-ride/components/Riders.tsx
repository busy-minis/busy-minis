"use client";

import React from "react";
import { User, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Rider {
  name: string;
  age: string;
}

interface RidersProps {
  riders: Rider[];
  onRidersChange: (riders: Rider[]) => void;
}

const Riders: React.FC<RidersProps> = ({ riders, onRidersChange }) => {
  const addPassenger = () => {
    onRidersChange([...riders, { name: "", age: "" }]);
  };

  const removePassenger = (index: number) => {
    onRidersChange(riders.filter((_, i) => i !== index));
  };

  const handleRiderChange = (
    index: number,
    field: keyof Rider,
    value: string
  ) => {
    const newRiders = [...riders];
    newRiders[index][field] = value;
    onRidersChange(newRiders);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <User className="mr-2" />
          Add Riders
        </CardTitle>
      </CardHeader>
      <CardContent>
        {riders.map((rider, index) => (
          <div key={index} className="grid grid-cols-5 gap-4 mb-4">
            <div className="col-span-3">
              <Label htmlFor={`rider-name-${index}`}>
                Rider {index + 1} Name
              </Label>
              <Input
                id={`rider-name-${index}`}
                value={rider.name}
                onChange={(e) =>
                  handleRiderChange(index, "name", e.target.value)
                }
                required
              />
            </div>
            <div className="col-span-1">
              <Label htmlFor={`rider-age-${index}`}>Age</Label>
              <Input
                id={`rider-age-${index}`}
                type="number"
                min="1"
                value={rider.age}
                onChange={(e) =>
                  handleRiderChange(index, "age", e.target.value)
                }
                required
              />
            </div>
            {riders.length > 1 && (
              <div className="col-span-1 flex items-end">
                <Button
                  type="button"
                  onClick={() => removePassenger(index)}
                  variant="destructive"
                  className="w-full"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove
                </Button>
              </div>
            )}
          </div>
        ))}
        <Button type="button" onClick={addPassenger} className="mt-4">
          <Plus className="mr-2 h-4 w-4" />
          Add Rider
        </Button>
      </CardContent>
    </Card>
  );
};

export default Riders;
