"use client";

import React, { useState, useEffect, useCallback } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { format, addDays, compareAsc } from "date-fns";

import { Elements } from "@stripe/react-stripe-js";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { createWeeklyRide } from "@/utils/supabase/supabaseQueries";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import AddressAutocomplete from "./components/AddressAutocompleteProps";
import Riders from "./components/Riders";
import Stops from "./components/Stops";
import Time from "./components/Time";
import DaySelector from "./components/DaySelector";
import Review from "./components/Review";
import { GoogleMapsApiProvider } from "./components/GoogleMapsApiProvider";
import CheckoutForm from "./components/CheckoutForm";
import { useToast } from "@/hooks/use-toast";
import { WeeklyFormData } from "@/app/types/types";
import { useRouter } from "next/navigation";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const daysOfWeekMap: { [key: string]: number } = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

interface Rider {
  name: string;
  age: string;
}

interface Stop {
  address: string;
  lat?: number;
  lng?: number;
}

export default function WeeklyRideBookingPage({ userId }: { userId: string }) {
  const [totalPrice, setTotalPrice] = useState(13);
  const [distance, setDistance] = useState<number>(0);

  const [formData, setFormData] = useState<WeeklyFormData>({
    renewal_date: "",
    user_id: userId,
    status: "pending",
    end_date: "",
    pickupDate: "",
    pickupAddress: "",
    pickupLat: undefined,
    pickupLng: undefined,
    total_cost: 0,
    distance: distance,
    payment_status: "",
    payment_intent_id: "",
    stops: [],
    dropoffAddress: "",
    dropoffLat: undefined,
    dropoffLng: undefined,
    riders: [{ name: "", age: "" }],
    selectedTime: "",
    selectedDays: [],
  });
  const [dateError, setDateError] = useState("");
  const [timeWarning, setTimeWarning] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [regularPrice, setRegularPrice] = useState(0);
  const [savings, setSavings] = useState(0);
  const [loadingDistance, setLoadingDistance] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const { toast } = useToast();
  const calculateDistance = useCallback(() => {
    if (
      window.google &&
      formData.pickupLat !== undefined &&
      formData.pickupLng !== undefined &&
      formData.dropoffLat !== undefined &&
      formData.dropoffLng !== undefined
    ) {
      setLoadingDistance(true);
      const directionsService = new google.maps.DirectionsService();

      const waypoints = formData.stops
        .filter(
          (stop: Stop) => stop.lat !== undefined && stop.lng !== undefined
        )
        .map((stop: Stop) => ({
          location: new google.maps.LatLng(stop.lat!, stop.lng!),
          stopover: true,
        }));

      const request = {
        origin: new google.maps.LatLng(
          formData.pickupLat!,
          formData.pickupLng!
        ),
        destination: new google.maps.LatLng(
          formData.dropoffLat!,
          formData.dropoffLng!
        ),
        waypoints: waypoints,
        travelMode: google.maps.TravelMode.DRIVING,
      };

      directionsService.route(request, (result, status) => {
        setLoadingDistance(false);
        if (
          status === "OK" &&
          result &&
          result.routes &&
          result.routes.length > 0
        ) {
          let totalDistance = 0;
          const legs = result.routes[0].legs;
          if (legs && legs.length > 0) {
            for (let i = 0; i < legs.length; i++) {
              const legDistanceValue = legs[i].distance?.value;
              if (legDistanceValue !== undefined) {
                totalDistance += legDistanceValue;
              }
            }
            const distanceInMiles = (totalDistance / 1000) * 0.621371;
            setDistance(distanceInMiles);
          }
        } else {
          console.error("Error calculating route:", status);
        }
      });
    } else {
      console.error("Google Maps is not available or coordinates are missing.");
    }
  }, [
    formData.pickupLat,
    formData.pickupLng,
    formData.dropoffLat,
    formData.dropoffLng,
    formData.stops,
  ]);

  const calculateTotalPrice = useCallback(() => {
    const basePricePerDay = 13;
    const regularPricePerDay = 16;
    const selectedDaysCount = formData.selectedDays.length;

    const calculateAdditionalCost = () => {
      const miles = distance;
      let totalCost = 0;

      if (miles !== null && miles > 5) {
        const additionalMiles = miles - 5;
        totalCost += additionalMiles * 2;
      }

      return Math.round(totalCost * 100) / 100;
    };

    let price = selectedDaysCount * basePricePerDay;
    let regularPriceTotal = selectedDaysCount * regularPricePerDay;

    if (timeWarning) {
      price += 10;
      regularPriceTotal += 10;
    }
    if (formData.riders.length > 1) {
      const additionalRidersCost = (formData.riders.length - 1) * 5;
      price += additionalRidersCost;
      regularPriceTotal += additionalRidersCost;
    }
    if (distance) {
      const additionalCost = calculateAdditionalCost();
      price += additionalCost;
      regularPriceTotal += additionalCost;
    }
    if (formData.stops.length > 0) {
      const stopsCost = formData.stops.length * 5;
      price += stopsCost;
      regularPriceTotal += stopsCost;
    }

    setTotalPrice(price);
    setRegularPrice(regularPriceTotal);
    setSavings(regularPriceTotal - price);
  }, [
    timeWarning,
    formData.riders,
    formData.selectedDays,
    distance,
    formData.stops.length,
  ]);

  useEffect(() => {
    calculateTotalPrice();
  }, [calculateTotalPrice]);

  const calculateNextPickupDate = (selectedDays: string[]): string | null => {
    if (selectedDays.length === 0) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayDay = today.getDay();

    let nextPickupDate = new Date(today);
    let daysToAdd = 7;

    selectedDays.forEach((day) => {
      const selectedDayOffset = daysOfWeekMap[day];
      let offset = (selectedDayOffset - todayDay + 7) % 7;
      if (offset === 0) offset = 7; // If it's today, move to next week
      if (offset < daysToAdd) daysToAdd = offset;
    });

    nextPickupDate.setDate(today.getDate() + daysToAdd);
    return nextPickupDate.toISOString().split("T")[0];
  };
  function calculateLastRideDate(
    selectedDays: string[],
    pickupDate: string
  ): string {
    console.log("calculateLastRideDate - Input:", { selectedDays, pickupDate });

    if (
      !Array.isArray(selectedDays) ||
      selectedDays.length === 0 ||
      !pickupDate
    ) {
      console.log(
        "calculateLastRideDate - Invalid input, returning empty string"
      );
      return "";
    }

    const formattedDays = selectedDays
      .map((day) => {
        const date = getNextDate(pickupDate, day);
        console.log(`Formatted day for ${day}:`, format(date, "yyyy-MM-dd"));
        return { day, date };
      })
      .sort((a, b) => compareAsc(a.date, b.date));

    console.log(
      "calculateLastRideDate - Formatted and sorted days:",
      formattedDays
    );

    // Get the last date from formattedDays
    const lastDate = formattedDays[formattedDays.length - 1].date;
    console.log(
      "calculateLastRideDate - Last date:",
      format(lastDate, "yyyy-MM-dd")
    );

    return format(lastDate, "yyyy-MM-dd");
  }

  function getNextDate(pickupDate: string, day: string): Date {
    const targetDay = daysOfWeekMap[day];
    const initialDate = new Date(pickupDate);
    const currentDay = initialDate.getDay();

    const dayDifference = (targetDay - currentDay + 7) % 7 || 7;
    const nextDate = addDays(initialDate, dayDifference);

    console.log(`getNextDate - For ${day}:`, format(nextDate, "yyyy-MM-dd"));
    return nextDate;
  }

  const validateForm = () => {
    if (!formData.pickupAddress || !formData.dropoffAddress) {
      setValidationError("Please fill in both pickup and dropoff addresses.");
      return false;
    }

    if (!formData.riders.every((rider) => /^[a-zA-Z\s]+$/.test(rider.name))) {
      setValidationError("Rider names should only contain letters.");
      return false;
    }

    if (formData.selectedDays.length < 4) {
      setValidationError("Please select at least 4 days.");
      return false;
    }

    setValidationError(null);
    return true;
  };

  const handleDaySelection = (day: string) => {
    console.log("handleDaySelection - Selected day:", day);

    setFormData((prevData) => {
      const updatedDays = prevData.selectedDays.includes(day)
        ? prevData.selectedDays.filter((selectedDay) => selectedDay !== day)
        : [...prevData.selectedDays, day];

      console.log("handleDaySelection - Updated selected days:", updatedDays);

      const pickupDate = calculateNextPickupDate(updatedDays) || "";
      console.log("handleDaySelection - Calculated pickup date:", pickupDate);

      const lastRideDate =
        pickupDate && updatedDays.length > 0
          ? calculateLastRideDate(updatedDays, pickupDate)
          : "";

      console.log(
        "handleDaySelection - Calculated last ride date:",
        lastRideDate
      );

      return {
        ...prevData,
        selectedDays: updatedDays,
        pickupDate,
        end_date: lastRideDate,
      };
    });
  };
  const handleNext = async () => {
    if (!validateForm()) return;
    calculateDistance();
    if (page === 1) {
      setPage(2);
    } else if (page === 2) {
      await createPaymentIntent();
      setPage(3);
    }
  };

  const handleBack = () => {
    setPage(page - 1);
  };
  const router = useRouter();

  const createPaymentIntent = async () => {
    try {
      const response = await fetch("/api/create-payment-weekly-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          price: totalPrice,
          rideData: formData,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to create payment intent");
      }
      const data = await response.json();
      setClientSecret(data.clientSecret);
    } catch (error) {
      console.error("Error creating Payment Intent:", error);
      toast({
        title: "Error",
        description: "Failed to create payment intent. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePaymentSuccess = async (paymentIntent: any) => {
    try {
      const rideData: WeeklyFormData = {
        ...formData,
        total_cost: totalPrice,
        payment_status: "paid",
        payment_intent_id: paymentIntent.id,
        user_id: userId,
        status: "active",
        renewal_date: formData.end_date,
        end_date: formData.end_date, // Use renewal_date as the end_date
      };
      const result = await createWeeklyRide({ formData: rideData });
      if (result.success) {
        toast({
          title: "Success",
          description: "Your weekly ride has been booked successfully!",
          variant: "default",
        });
        router.push("/success");
      } else {
        throw new Error("Failed to create weekly ride");
      }
    } catch (error) {
      console.error("Failed to create weekly ride:", error);
      toast({
        title: "Error",
        description: "Failed to create weekly ride. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <GoogleMapsApiProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 py-12">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center">
                Weekly Ride Booking
              </CardTitle>
              <CardDescription className="text-center">
                Schedule your rides weekly with up to a 10% discount.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div onSubmit={(e) => e.preventDefault()} className="space-y-8">
                {page === 1 && (
                  <>
                    <Riders
                      riders={formData.riders}
                      onRidersChange={(riders) =>
                        setFormData({ ...formData, riders })
                      }
                    />

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-xl">
                          Pickup and Dropoff
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <AddressAutocomplete
                          label="Pickup Address"
                          value={formData.pickupAddress}
                          onAddressSelect={(address, lat, lng) =>
                            setFormData({
                              ...formData,
                              pickupAddress: address,
                              pickupLat: lat,
                              pickupLng: lng,
                            })
                          }
                        />
                        <AddressAutocomplete
                          label="Dropoff Address"
                          value={formData.dropoffAddress}
                          onAddressSelect={(address, lat, lng) =>
                            setFormData({
                              ...formData,
                              dropoffAddress: address,
                              dropoffLat: lat,
                              dropoffLng: lng,
                            })
                          }
                        />
                      </CardContent>
                    </Card>

                    <Stops
                      stops={formData.stops}
                      onStopsChange={(stops) =>
                        setFormData({ ...formData, stops })
                      }
                    />

                    <Time
                      selectedTime={formData.selectedTime}
                      onTimeChange={(time) =>
                        setFormData({ ...formData, selectedTime: time })
                      }
                      timeWarning={timeWarning}
                      setTimeWarning={setTimeWarning}
                      dateError={dateError}
                    />

                    <DaySelector
                      selectedDays={formData.selectedDays}
                      onDaySelection={handleDaySelection}
                    />

                    {validationError && (
                      <Alert variant="destructive">
                        <AlertDescription>{validationError}</AlertDescription>
                      </Alert>
                    )}

                    <Button onClick={handleNext} className="w-full">
                      Review Booking
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </>
                )}

                {page === 2 && (
                  <>
                    <Review
                      formData={formData}
                      totalPrice={totalPrice}
                      regularPrice={regularPrice}
                      savings={savings}
                      distance={distance}
                    />
                    <div className="flex justify-between">
                      <Button onClick={handleBack}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                      </Button>
                      <Button type="button" onClick={handleNext}>
                        Proceed to Payment
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </>
                )}

                {page === 3 && clientSecret && (
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <CheckoutForm
                      formData={formData}
                      clientSecret={clientSecret}
                      onSuccess={handlePaymentSuccess}
                      totalPrice={totalPrice}
                    />
                  </Elements>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </GoogleMapsApiProvider>
  );
}
