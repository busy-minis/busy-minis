"use client";

import React, { useState, useEffect, useCallback } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { ArrowRight } from "lucide-react";
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

const stripePromise = loadStripe("your-stripe-public-key-here");

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

interface FormData {
  renewal_date: string;
  user_id: string;
  status: string;
  end_date: string;
  pickupDate: string;
  pickupAddress: string;
  pickupLat?: number;
  total_price: number;
  pickupLng?: number;
  stops: Stop[];
  dropoffAddress: string;
  dropoffLat?: number;
  dropoffLng?: number;
  riders: Rider[];
  selectedTime: string;
  selectedDays: string[];
}

export default function WeeklyRideBookingPage({ userId }: { userId: string }) {
  const [totalPrice, setTotalPrice] = useState(13);
  const [formData, setFormData] = useState<FormData>({
    renewal_date: "",
    user_id: userId,
    status: "pending",
    end_date: "",
    pickupDate: "",
    total_price: totalPrice,
    pickupAddress: "",
    pickupLat: undefined,
    pickupLng: undefined,
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
  const [distance, setDistance] = useState<number | null>(null);
  const [loadingDistance, setLoadingDistance] = useState(false);

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
    const todayDay = today.getDay();

    let minOffset = 7;
    selectedDays.forEach((day) => {
      const selectedDayOffset = daysOfWeekMap[day];
      let offset = (selectedDayOffset - todayDay + 7) % 7;
      if (offset === 0) offset = 7;
      if (offset < minOffset) minOffset = offset;
    });

    const nextPickupDate = new Date();
    nextPickupDate.setDate(today.getDate() + minOffset);
    return nextPickupDate.toISOString().split("T")[0];
  };

  function calculateRenewalDate(
    pickupDate: string,
    selectedDays: string[]
  ): string {
    const dates = selectedDays.map((day) => {
      const targetDay = daysOfWeekMap[day];
      const initialDate = new Date(pickupDate);
      const currentDay = initialDate.getDay();

      let dayDifference = targetDay - currentDay;
      if (dayDifference < 0) dayDifference += 7;
      if (dayDifference === 0) dayDifference = 7;

      const nextDate = new Date(initialDate);
      nextDate.setDate(initialDate.getDate() + dayDifference);

      return nextDate;
    });

    const renewalDate = dates.reduce((latest, current) =>
      current > latest ? current : latest
    );

    return renewalDate.toISOString().split("T")[0];
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
    setFormData((prevData) => {
      const updatedDays = prevData.selectedDays.includes(day)
        ? prevData.selectedDays.filter((selectedDay) => selectedDay !== day)
        : [...prevData.selectedDays, day];

      const pickupDate = calculateNextPickupDate(updatedDays) || "";

      const renewalDate =
        pickupDate && updatedDays.length > 0
          ? calculateRenewalDate(pickupDate, updatedDays)
          : "";

      return {
        ...prevData,
        selectedDays: updatedDays,
        pickupDate,
        renewal_date: renewalDate,
      };
    });
  };

  const handleNext = () => {
    if (!validateForm()) return;
    calculateDistance();
    setPage(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.pickupDate) {
      setDateError("Please select at least one day.");
      return;
    }

    try {
      await createWeeklyRide({ formData });

      const stripe = await stripePromise;

      if (stripe) {
        const response = await fetch("/api/create-checkout-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            price: totalPrice,
            rideData: formData,
          }),
        });

        const session = await response.json();
        await stripe.redirectToCheckout({ sessionId: session.id });
      }
    } catch (error) {
      console.error("Error during submission:", error);
    }
  };

  return (
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
            <form onSubmit={handleSubmit} className="space-y-8">
              {page === 1 ? (
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
              ) : (
                <Review
                  formData={formData}
                  totalPrice={totalPrice}
                  regularPrice={regularPrice}
                  savings={savings}
                  distance={distance}
                  setPage={setPage}
                />
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
