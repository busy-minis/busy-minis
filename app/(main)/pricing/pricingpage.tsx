"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Users, MapPin, PlusCircle, MinusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type RideType = "single" | "regular";

export default function PricingPage() {
  const [selectedRideType, setSelectedRideType] = useState<RideType>("single");
  const [passengers, setPassengers] = useState(1);
  const [stops, setStops] = useState(0);
  const [miles, setMiles] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const baseFare = selectedRideType === "single" ? 16 : 13;
    const bookingFee = 3;
    const additionalMiles = miles > 5 ? (miles - 5) * 2 : 0;
    const additionalPassengers = passengers > 1 ? (passengers - 1) * 5 : 0;
    const additionalStops = stops * 5;
    const calculatedPrice =
      baseFare +
      bookingFee +
      additionalMiles +
      additionalPassengers +
      additionalStops;

    setTotalPrice(calculatedPrice);
  }, [selectedRideType, passengers, stops, miles]);

  return (
    <section className="bg-gradient-to-br from-teal-50 to-teal-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-extrabold text-teal-900 mb-4">
            Pricing Calculator
          </h1>
          <p className="text-xl text-gray-700">
            Estimate your ride cost in just a few clicks.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Customize Your Ride</CardTitle>
            </CardHeader>
            <CardContent>
              <RidePricingCalculator
                selectedRideType={selectedRideType}
                setSelectedRideType={setSelectedRideType}
                passengers={passengers}
                setPassengers={setPassengers}
                miles={miles}
                setMiles={setMiles}
                stops={stops}
                setStops={setStops}
                totalPrice={totalPrice}
              />
            </CardContent>
          </Card>

          <Card className="bg-teal-900 text-white">
            <CardHeader>
              <CardTitle>
                {selectedRideType === "single"
                  ? "One-Time Ride"
                  : "Regular Ride"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RideInfo selectedRideType={selectedRideType} />
            </CardContent>
          </Card>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16"
        >
          <PricingChart />
        </motion.div>
      </div>
    </section>
  );
}

const RidePricingCalculator = ({
  selectedRideType,
  setSelectedRideType,
  passengers,
  setPassengers,
  miles,
  setMiles,
  stops,
  setStops,
  totalPrice,
}: any) => {
  return (
    <div className="space-y-8">
      <Tabs
        value={selectedRideType}
        onValueChange={(value) => setSelectedRideType(value as RideType)}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="single">One-time Ride</TabsTrigger>
          <TabsTrigger value="regular">Regular Ride</TabsTrigger>
        </TabsList>
      </Tabs>

      <div>
        <h3 className="text-lg font-medium mb-4">Passengers</h3>
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPassengers(Math.max(1, passengers - 1))}
            disabled={passengers === 1}
          >
            <MinusCircle className="h-4 w-4" />
          </Button>
          <span className="text-2xl font-bold">{passengers}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPassengers(Math.min(4, passengers + 1))}
            disabled={passengers === 4}
          >
            <PlusCircle className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Distance (miles)</h3>
        <Slider
          min={0}
          max={50}
          step={1}
          value={[miles]}
          onValueChange={(value) => setMiles(value[0])}
        />
        <div className="flex justify-between mt-2 text-sm text-gray-500">
          <span>0 miles</span>
          <span>{miles} miles</span>
          <span>50+ miles</span>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Additional Stops: {stops}</h3>
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setStops(Math.max(0, stops - 1))}
            disabled={stops === 0}
          >
            <MinusCircle className="h-4 w-4" />
          </Button>
          <span className="text-2xl font-bold">{stops}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setStops(stops + 1)}
          >
            <PlusCircle className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="text-center">
        <p className="text-3xl font-bold text-teal-900 mb-4">
          Total Price: ${totalPrice.toFixed(2)}
        </p>
        <Button asChild>
          <Link href="/contact">Contact Us</Link>
        </Button>
      </div>
    </div>
  );
};

const RideInfo = ({ selectedRideType }: { selectedRideType: RideType }) => (
  <div className="space-y-4">
    <p className="text-lg">
      {selectedRideType === "single" ? "One-Time" : "Regular"} rides start at{" "}
      <span className="font-semibold">
        ${selectedRideType === "single" ? "16" : "13"}/trip
      </span>
      .
    </p>
    <p>
      The base rate covers up to 5 miles and 1 passenger. Additional charges
      apply for extra miles, passengers, and stops.
    </p>
    <ul className="list-disc list-inside space-y-2">
      <li>Additional miles: $2/mile beyond 5 miles</li>
      <li>Extra passengers: $5/passenger</li>
      <li>Additional stops: $5/stop</li>
    </ul>
  </div>
);

const PricingChart = () => (
  <Card>
    <CardHeader>
      <CardTitle>Pricing Details</CardTitle>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Category</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Cost</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pricingDetails.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.category}</TableCell>
              <TableCell>{row.description}</TableCell>
              <TableCell>{row.cost}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);

const pricingDetails = [
  {
    category: "Additional Miles",
    description: "Charge per mile beyond 5 miles.",
    cost: "+$2/mile",
  },
  {
    category: "Additional Passengers",
    description: "Cost for each extra passenger.",
    cost: "+$5/passenger",
  },
  {
    category: "Additional Stops",
    description: "Cost per stop.",
    cost: "+$5/stop",
  },
  {
    category: "Wait Times",
    description: "Charges after a 5-minute grace period.",
    cost: "+$1/minute",
  },
  {
    category: "Extended Hours",
    description: "Rides before 6 AM or after 6 PM.",
    cost: "+$10/trip",
  },
];
