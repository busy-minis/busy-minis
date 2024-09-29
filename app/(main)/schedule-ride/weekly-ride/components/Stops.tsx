"use client";

import React from "react";
import { MapPin, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AddressAutocomplete from "./AddressAutocompleteProps";

interface Stop {
  address: string;
  lat?: number;
  lng?: number;
}

interface StopsProps {
  stops: Stop[];
  onStopsChange: (stops: Stop[]) => void;
}

const Stops: React.FC<StopsProps> = ({ stops, onStopsChange }) => {
  const addStop = () => {
    onStopsChange([...stops, { address: "", lat: undefined, lng: undefined }]);
  };

  const removeStop = (index: number) => {
    onStopsChange(stops.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <MapPin className="mr-2" />
          Add Stops
        </CardTitle>
      </CardHeader>
      <CardContent>
        {stops.map((stop, index) => (
          <div key={index} className="mb-4">
            <AddressAutocomplete
              label={`Stop ${index + 1} Address`}
              value={stop.address}
              onAddressSelect={(address, lat, lng) => {
                const newStops = [...stops];
                newStops[index] = { address, lat, lng };
                onStopsChange(newStops);
              }}
            />
            {stops.length > 0 && (
              <Button
                type="button"
                onClick={() => removeStop(index)}
                variant="destructive"
                className="mt-2"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Remove Stop
              </Button>
            )}
          </div>
        ))}
        <Button type="button" onClick={addStop} className="mt-4">
          <Plus className="mr-2 h-4 w-4" />
          Add Stop
        </Button>
      </CardContent>
    </Card>
  );
};

export default Stops;
