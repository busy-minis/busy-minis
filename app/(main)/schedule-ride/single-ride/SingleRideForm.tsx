"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  format,
  parseISO,
  isBefore,
  addHours,
  differenceInMinutes,
} from "date-fns";
import { loadStripe } from "@stripe/stripe-js";
import {
  Calendar,
  Clock,
  User,
  Plus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import { createRide } from "@/utils/supabase/supabaseQueries";
import AddressAutocomplete from "./AddressAutocompleteProps";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import LoadGoogleMapsScript from "./LoadGoogleMapsScript";
const stripePromise = loadStripe("YOUR_STRIPE_PUBLIC_KEY");

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
  user_id: string;
  status: string;
  pickupDate: string;
  pickupTime: string;
  weekly: boolean;
  pickupAddress: string;
  pickupLat?: number;
  pickupLng?: number;
  dropoffAddress: string;
  dropoffLat?: number;
  dropoffLng?: number;
  riders: Rider[];
  stops: Stop[];
  distance: number;
}

export default function SingleRideBooking({ userId }: { userId: string }) {
  LoadGoogleMapsScript();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    user_id: userId,
    status: "pending",
    pickupDate: "",
    pickupTime: "",
    weekly: false,
    pickupAddress: "",
    pickupLat: undefined,
    pickupLng: undefined,
    dropoffAddress: "",
    dropoffLat: undefined,
    dropoffLng: undefined,
    riders: [{ name: "", age: "" }],
    stops: [],
    distance: 0,
  });

  const [isSameDay, setIsSameDay] = useState(false);
  const [isOffPeak, setIsOffPeak] = useState(false);
  const [isMoreRiders, setIsMoreRiders] = useState(false);
  const [isWithinOneHour, setIsWithinOneHour] = useState(false);
  const [isWithin30Minutes, setIsWithin30Minutes] = useState<boolean>(false);
  const [totalPrice, setTotalPrice] = useState(16);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [distance, setDistance] = useState<number | null>(null);

  const calculateTotalPrice = useCallback(() => {
    const calculateCost = () => {
      const miles = distance;
      const baseRate = 0;
      let totalCost = baseRate;

      if (miles !== null && miles > 5) {
        const additionalMiles = miles - 5;
        totalCost += additionalMiles * 2;
      }

      return Math.round(totalCost * 100) / 100;
    };

    let price = 16;
    if (isSameDay) price += 25;
    if (formData.stops && formData.stops.length > 0) {
      price += formData.stops.length * 5;
    }
    if (isOffPeak) price += 15;
    if (formData.riders.length > 1) {
      price += (formData.riders.length - 1) * 5;
    }
    if (distance) {
      price += calculateCost();
    }
    setTotalPrice(price);
  }, [isSameDay, isOffPeak, formData.riders, distance, formData.stops]);

  useEffect(() => {
    calculateTotalPrice();
  }, [calculateTotalPrice]);

  const validateStep1 = () => {
    const errors: string[] = [];
    if (!formData.pickupDate) {
      errors.push("Pickup Date is required.");
    }
    if (!formData.pickupTime) errors.push("Pickup Time is required.");
    formData.riders.forEach((rider, index) => {
      if (!rider.name) errors.push(`Rider ${index + 1} Name is required.`);
      if (!rider.age || parseInt(rider.age) <= 0) {
        errors.push(`Rider ${index + 1} Age must be a positive number.`);
      }
    });
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createRide(formData);
    // Stripe integration code here
  };

  const today = format(new Date(), "yyyy-MM-dd");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof FormData | keyof Rider,
    index?: number
  ) => {
    const { value } = e.target;

    if (typeof index === "number" && (field === "name" || field === "age")) {
      const updatedRiders = [...formData.riders];
      updatedRiders[index][field] = value;
      setFormData({ ...formData, riders: updatedRiders });
    } else {
      setFormData({ ...formData, [field]: value });
      if (field === "pickupDate")
        checkSameDayAndTime(value, formData.pickupTime);
      if (field === "pickupTime")
        checkSameDayAndTime(formData.pickupDate, value);
    }
  };

  const checkSameDayAndTime = (pickupDate: string, pickupTime: string) => {
    const isSame = pickupDate === today;
    const isOffPeakTime =
      pickupTime &&
      (parseInt(pickupTime.split(":")[0]) < 6 ||
        parseInt(pickupTime.split(":")[0]) >= 18);
    const withinOneHour =
      pickupDate &&
      pickupTime &&
      isBefore(
        parseISO(`${pickupDate}T${pickupTime}`),
        addHours(new Date(), 1)
      );

    const pickupDateTime = parseISO(`${pickupDate}T${pickupTime}`);
    const now = new Date();
    const diffMinutes = differenceInMinutes(pickupDateTime, now);
    const within30Minutes = diffMinutes < 30;

    setIsSameDay(isSame);
    setIsOffPeak(Boolean(isOffPeakTime));
    setIsWithinOneHour(Boolean(withinOneHour));
    setIsWithin30Minutes(within30Minutes);

    if (within30Minutes) {
      if (
        !validationErrors.includes(
          "Pickup time must be at least 30 minutes from now."
        )
      ) {
        setValidationErrors([
          ...validationErrors,
          "Pickup time must be at least 30 minutes from now.",
        ]);
      }
    } else {
      setValidationErrors(
        validationErrors.filter(
          (error) =>
            error !== "Pickup time must be at least 30 minutes from now."
        )
      );
    }
  };

  const handleAddRider = () => {
    setFormData({
      ...formData,
      riders: [...formData.riders, { name: "", age: "" }],
    });
    setIsMoreRiders(formData.riders.length + 1 > 1);
  };

  const handleRemoveRider = (index: number) => {
    const updatedRiders = formData.riders.filter((_, i) => i !== index);
    setFormData({ ...formData, riders: updatedRiders });
    setIsMoreRiders(updatedRiders.length > 1);
  };

  const handleAddressSelect = (
    type: "pickup" | "dropoff" | "stop",
    address: string,
    lat?: number,
    lng?: number,
    stopIndex?: number
  ) => {
    if (type === "pickup") {
      setFormData({
        ...formData,
        pickupAddress: address,
        pickupLat: lat,
        pickupLng: lng,
      });
    } else if (type === "dropoff") {
      setFormData({
        ...formData,
        dropoffAddress: address,
        dropoffLat: lat,
        dropoffLng: lng,
      });
    } else if (type === "stop" && stopIndex !== undefined) {
      const updatedStops = [...formData.stops];
      updatedStops[stopIndex] = { address, lat, lng };
      setFormData({ ...formData, stops: updatedStops });
    }
  };

  const validateStep2 = () => {
    const errors: string[] = [];

    if (!formData.pickupAddress || !formData.pickupLat || !formData.pickupLng) {
      errors.push("Pickup address is required.");
    }

    if (
      !formData.dropoffAddress ||
      !formData.dropoffLat ||
      !formData.dropoffLng
    ) {
      errors.push("Dropoff address is required.");
    }

    formData.stops.forEach((stop: Stop, index: number) => {
      if (!stop.address || !stop.lat || !stop.lng) {
        errors.push(`Stop ${index + 1} address is incomplete.`);
      }
    });

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const calculateDistance = () => {
    if (
      window.google &&
      formData.pickupLat !== undefined &&
      formData.pickupLng !== undefined &&
      formData.dropoffLat !== undefined &&
      formData.dropoffLng !== undefined
    ) {
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
            setFormData({
              ...formData,
              distance: distanceInMiles,
            });
          }
        } else {
          console.error("Error calculating route:", status);
        }
      });
    } else {
      console.error("Google Maps is not available or coordinates are missing.");
    }
  };

  const handleNextStepWithDistance = () => {
    if (validateStep2()) {
      calculateDistance();
      setStep(3);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-zinc-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-center text-zinc-800 mb-8">
          Book a Single Ride
        </h1>

        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Ride Booking</CardTitle>
            <CardDescription>Fill in the details for your ride</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="pickupDate">Pickup Date</Label>
                        <div className="relative">
                          <Calendar
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            size={18}
                          />
                          <Input
                            id="pickupDate"
                            type="date"
                            value={formData.pickupDate}
                            min={today}
                            onChange={(e) => handleInputChange(e, "pickupDate")}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pickupTime">Pickup Time</Label>
                        <div className="relative">
                          <Clock
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            size={18}
                          />
                          <Input
                            id="pickupTime"
                            type="time"
                            value={formData.pickupTime}
                            onChange={(e) => handleInputChange(e, "pickupTime")}
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </div>

                    {isSameDay && (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Same-day pickups will incur an additional fee.
                        </AlertDescription>
                      </Alert>
                    )}

                    {isOffPeak && (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Off-peak hours (before 6 AM or after 6 PM) will incur
                          an additional fee.
                        </AlertDescription>
                      </Alert>
                    )}

                    {isWithinOneHour && (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Rides within one hour will incur an additional fee.
                        </AlertDescription>
                      </Alert>
                    )}

                    {isWithin30Minutes && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Pickup time must be at least 30 minutes from now.
                        </AlertDescription>
                      </Alert>
                    )}

                    <Separator className="my-4" />

                    <div className="space-y-4">
                      {formData.riders.map((rider: Rider, index: number) => (
                        <div key={index} className="space-y-4">
                          <h3 className="text-lg font-semibold">
                            Rider {index + 1}
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`rider-${index}-name`}>
                                Name
                              </Label>
                              <div className="relative">
                                <User
                                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                  size={18}
                                />
                                <Input
                                  id={`rider-${index}-name`}
                                  value={rider.name}
                                  onChange={(e) =>
                                    handleInputChange(e, "name", index)
                                  }
                                  className="pl-10"
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`rider-${index}-age`}>Age</Label>
                              <Input
                                id={`rider-${index}-age`}
                                type="number"
                                min="0"
                                value={rider.age}
                                onChange={(e) =>
                                  handleInputChange(e, "age", index)
                                }
                              />
                            </div>
                          </div>
                          {index > 0 && (
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => handleRemoveRider(index)}
                              className="mt-2"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Remove Rider
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>

                    {isMoreRiders && (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Adding more riders will incur an additional fee.
                        </AlertDescription>
                      </Alert>
                    )}

                    {formData.riders.length < 4 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleAddRider}
                        className="w-full"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Another Rider
                      </Button>
                    )}

                    {validationErrors.length > 0 && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          {validationErrors.map(
                            (error: string, index: number) => (
                              <p key={index}>{error}</p>
                            )
                          )}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="space-y-4">
                    <div className="bg-zinc-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold mb-2">
                        Ride Summary
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <p>
                          <span className="font-medium">Pickup Date:</span>{" "}
                          {formData.pickupDate}
                        </p>
                        <p>
                          <span className="font-medium">Pickup Time:</span>{" "}
                          {format(
                            parseISO(`1970-01-01T${formData.pickupTime}`),
                            "hh:mm a"
                          )}
                        </p>
                      </div>
                      <div className="mt-2">
                        <h4 className="font-medium">Riders:</h4>
                        <ul className="list-disc list-inside">
                          {formData.riders.map(
                            (rider: Rider, index: number) => (
                              <li key={index}>
                                {rider.name}, {rider.age} years old
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    </div>

                    <AddressAutocomplete
                      label="Pickup Address"
                      onAddressSelect={(address, lat, lng) =>
                        handleAddressSelect("pickup", address, lat, lng)
                      }
                    />
                    <AddressAutocomplete
                      label="Dropoff Address"
                      onAddressSelect={(address, lat, lng) =>
                        handleAddressSelect("dropoff", address, lat, lng)
                      }
                    />

                    {formData.stops.map((stop: Stop, index: number) => (
                      <div key={index} className="space-y-2">
                        <AddressAutocomplete
                          label={`Stop ${index + 1} Address`}
                          onAddressSelect={(address, lat, lng) =>
                            handleAddressSelect(
                              "stop",
                              address,
                              lat,
                              lng,
                              index
                            )
                          }
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            const updatedStops = formData.stops.filter(
                              (_, i) => i !== index
                            );
                            setFormData({ ...formData, stops: updatedStops });
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Remove Stop
                        </Button>
                      </div>
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          stops: [
                            ...formData.stops,
                            { address: "", lat: undefined, lng: undefined },
                          ],
                        });
                      }}
                      className="w-full"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Stop
                    </Button>

                    {validationErrors.length > 0 && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          {validationErrors.map(
                            (error: string, index: number) => (
                              <p key={index}>{error}</p>
                            )
                          )}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <div className="space-y-4">
                    <div className="bg-zinc-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold mb-2">
                        Ride Summary
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <p>
                          <span className="font-medium">Pickup Date:</span>{" "}
                          {formData.pickupDate}
                        </p>
                        <p>
                          <span className="font-medium">Pickup Time:</span>{" "}
                          {format(
                            parseISO(`1970-01-01T${formData.pickupTime}`),
                            "hh:mm a"
                          )}
                        </p>
                      </div>
                      <div className="mt-2">
                        <h4 className="font-medium">Riders:</h4>
                        <ul className="list-disc list-inside">
                          {formData.riders.map((rider, index) => (
                            <li key={index}>
                              {rider.name}, {rider.age} years old
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="bg-zinc-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-lg mb-2">Route</h4>
                      <ol className="list-decimal list-inside space-y-2">
                        <li>
                          <span className="font-medium">Pickup:</span>{" "}
                          {formData.pickupAddress}
                        </li>
                        {formData.stops.map((stop, index) => (
                          <li key={index}>
                            <span className="font-medium">
                              Stop {index + 1}:
                            </span>{" "}
                            {stop.address}
                          </li>
                        ))}
                        <li>
                          <span className="font-medium">Dropoff:</span>{" "}
                          {formData.dropoffAddress}
                        </li>
                      </ol>
                    </div>

                    {distance !== null && (
                      <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-green-800">
                          <span className="font-medium">Total Distance:</span>{" "}
                          {distance.toFixed(2)} miles
                        </p>
                      </div>
                    )}

                    <div className="bg-zinc-100 p-4 rounded-lg">
                      <h4 className="font-semibold text-lg text-zinc-800 mb-2">
                        Total Cost: ${totalPrice.toFixed(2)}
                      </h4>
                    </div>
                  </div>
                </>
              )}
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(step - 1)}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            )}
            {step < 3 ? (
              <Button
                type="button"
                onClick={
                  step === 1 ? handleNextStep : handleNextStepWithDistance
                }
                disabled={validationErrors.length > 0}
              >
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit">Continue to Payment</Button>
            )}
          </CardFooter>
        </Card>
      </div>
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg">Loading...</div>
        </div>
      )}
    </div>
  );
}
