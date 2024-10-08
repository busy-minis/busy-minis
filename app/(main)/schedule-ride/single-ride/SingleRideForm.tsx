"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  format,
  parseISO,
  isBefore,
  addHours,
  differenceInMinutes,
} from "date-fns";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./components/CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";
import {
  Calendar,
  Clock,
  User,
  Plus,
  Trash2,
  AlertCircle,
  MapPin,
  ArrowLeft,
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
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import LoadGoogleMapsScript from "./LoadGoogleMapsScript";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);
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
  const isGoogleMapsLoaded = LoadGoogleMapsScript();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showReview, setShowReview] = useState(false);
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
  const [clientSecret, setClientSecret] = useState("");
  const { toast } = useToast();

  const calculateTotalPrice = useCallback(() => {
    console.log("Starting price calculation");
    console.log("Initial distance:", distance);

    const calculateCost = () => {
      const miles = distance;
      const baseRate = 16; // Set base rate to $16
      let totalCost = baseRate;

      console.log("Base rate:", baseRate);

      if (miles !== null && miles > 5) {
        const additionalMiles = miles - 5;
        totalCost += additionalMiles * 2;
        console.log("Additional miles cost:", additionalMiles * 2);
      }

      return Math.round(totalCost * 100) / 100;
    };

    let price = calculateCost();
    console.log("Price after distance calculation:", price);

    if (isSameDay) {
      price += 25;
      console.log("Added same-day fee. New price:", price);
    }
    if (formData.stops && formData.stops.length > 0) {
      const stopsCost = formData.stops.length * 5;
      price += stopsCost;
      console.log(
        `Added ${formData.stops.length} stops cost. New price:`,
        price
      );
    }
    if (isOffPeak) {
      price += 15;
      console.log("Added off-peak fee. New price:", price);
    }
    if (formData.riders.length > 1) {
      const additionalRidersCost = (formData.riders.length - 1) * 5;
      price += additionalRidersCost;
      console.log(
        `Added cost for ${
          formData.riders.length - 1
        } additional riders. New price:`,
        price
      );
    }

    const finalPrice = Math.round(price * 100) / 100;
    console.log("Final calculated price:", finalPrice);

    setTotalPrice(finalPrice);
  }, [isSameDay, isOffPeak, formData.riders, distance, formData.stops]);

  useEffect(() => {
    calculateTotalPrice();
  }, [calculateTotalPrice]);

  const validateForm = () => {
    const errors: string[] = [];

    if (!formData.pickupDate) {
      errors.push("Pickup Date is required.");
    }
    if (!formData.pickupTime) {
      errors.push("Pickup Time is required.");
    }

    formData.riders.forEach((rider, index) => {
      if (!rider.name) errors.push(`Rider ${index + 1} Name is required.`);
      if (!rider.age || parseInt(rider.age) <= 0) {
        errors.push(`Rider ${index + 1} Age must be a positive number.`);
      }
    });

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

    if (isWithin30Minutes) {
      errors.push("Pickup time must be at least 30 minutes from now.");
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const createPaymentIntent = async () => {
    try {
      console.log("Creating payment intent with total price:", totalPrice);

      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          price: totalPrice,
          rideData: formData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create payment intent");
      }

      const data = await response.json();
      console.log("Received client secret:", data.clientSecret);
      setClientSecret(data.clientSecret);

      // Log the payment intent details
      const paymentIntentResponse = await fetch(
        `/api/get-payment-intent?client_secret=${data.clientSecret}`,
        {
          method: "GET",
        }
      );
      const paymentIntentData = await paymentIntentResponse.json();
      console.log("Payment Intent details:", paymentIntentData);
    } catch (error) {
      console.error("Error creating Payment Intent:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to create payment intent. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  const handlePaymentIntentUpdate = async () => {
    try {
      const response = await fetch("/api/update-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentIntentId: clientSecret.split("_secret_")[0],
          amount: totalPrice,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to update payment intent");
      }
      const data = await response.json();
      setClientSecret(data.clientSecret);
    } catch (error) {
      console.error("Error updating Payment Intent:", error);
      toast({
        title: "Error",
        description: "Failed to update payment intent. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePaymentSuccess = async (paymentIntent: any) => {
    try {
      const rideData = {
        ...formData,
        total_cost: totalPrice.toString(),
        payment_status: "paid",
        payment_intent_id: paymentIntent.id,
      };
      const createdRide = await createRide(rideData);
      console.log("Ride created:", createdRide);
      toast({
        title: "Success",
        description: "Your ride has been booked successfully!",
        variant: "default",
      });
      router.push("/success");
    } catch (error) {
      console.error("Failed to create ride:", error);
      toast({
        title: "Error",
        description: "Failed to create ride. Please contact support.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
    const pickupDateTime = parseISO(`${pickupDate}T${pickupTime}`);
    const now = new Date();
    const withinOneHour = isBefore(pickupDateTime, addHours(now, 1));
    const diffMinutes = differenceInMinutes(pickupDateTime, now);
    const within30Minutes = diffMinutes < 30;

    setIsSameDay(isSame);
    setIsOffPeak(Boolean(isOffPeakTime));
    setIsWithinOneHour(Boolean(withinOneHour));
    setIsWithin30Minutes(within30Minutes);
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

  const calculateDistance = () => {
    return new Promise<void>((resolve, reject) => {
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
              resolve();
            }
          } else {
            console.error("Error calculating route:", status);
            reject(new Error("Failed to calculate route"));
          }
        });
      } else {
        console.error(
          "Google Maps is not available or coordinates are missing."
        );
        reject(
          new Error("Google Maps is not available or coordinates are missing")
        );
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      try {
        // Calculate distance
        await calculateDistance();

        // Recalculate total price after distance is updated
        calculateTotalPrice();

        // Create payment intent with updated total price
        await createPaymentIntent();

        setShowReview(true);
      } catch (error) {
        console.error("Error during form submission:", error);
        toast({
          title: "Error",
          description: "An error occurred. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  if (!isGoogleMapsLoaded) {
    return <div>Loading Google Maps...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-zinc-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-center text-zinc-800 mb-8">
          Book a Single Ride
        </h1>
        <p>{totalPrice}</p>

        {!showReview ? (
          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle>Ride Booking</CardTitle>
              <CardDescription>
                Fill in the details for your ride
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  {/* Pickup Date and Time */}
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
                          required
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
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Alerts for Pickup Time Constraints */}
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
                        Off-peak hours (before 6 AM or after 6 PM) will incur an
                        additional fee.
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

                  {/* Riders Information */}
                  <div className="space-y-4">
                    {formData.riders.map((rider: Rider, index: number) => (
                      <div key={index} className="space-y-4">
                        <h3 className="text-lg font-semibold">
                          Rider {index + 1}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`rider-${index}-name`}>Name</Label>
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
                                required
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
                              required
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
                  </div>

                  <Separator className="my-4" />

                  {/* Addresses */}
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

                  {/* Stops */}
                  {formData.stops.map((stop: Stop, index: number) => (
                    <div key={index} className="space-y-2">
                      <AddressAutocomplete
                        label={`Stop ${index + 1} Address`}
                        onAddressSelect={(address, lat, lng) =>
                          handleAddressSelect("stop", address, lat, lng, index)
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

                  {/* Validation Errors */}
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

                <CardFooter className="flex justify-end mt-8">
                  <Button type="submit" disabled={loading}>
                    {loading ? "Processing..." : "Continue to Payment"}
                  </Button>
                </CardFooter>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Review & Payment</span>
                <Button variant="outline" onClick={() => setShowReview(false)}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              </CardTitle>
              <CardDescription>
                Review your ride details and proceed to payment.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Ride Summary */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">
                    Ride Summary
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-5 w-5 text-gray-500" />
                      <div>
                        <p className="font-medium text-gray-700">Pickup Date</p>
                        <p className="text-gray-600">{formData.pickupDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-5 w-5 text-gray-500" />
                      <div>
                        <p className="font-medium text-gray-700">Pickup Time</p>
                        <p className="text-gray-600">
                          {format(
                            parseISO(`1970-01-01T${formData.pickupTime}`),
                            "hh:mm a"
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-700 mb-2">Riders:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {formData.riders.map((rider, index) => (
                        <li key={index} className="text-gray-600">
                          {rider.name}, {rider.age} years old
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Route Summary */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h4 className="text-xl font-semibold mb-4 text-gray-800">
                    Route
                  </h4>
                  <ol className="space-y-4">
                    <li className="flex items-start">
                      <MapPin className="mr-2 h-5 w-5 text-green-500 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-medium text-gray-700">Pickup</p>
                        <p className="text-gray-600">
                          {formData.pickupAddress}
                        </p>
                      </div>
                    </li>
                    {formData.stops.map((stop, index) => (
                      <li key={index} className="flex items-start">
                        <MapPin className="mr-2 h-5 w-5 text-yellow-500 flex-shrink-0 mt-1" />
                        <div>
                          <p className="font-medium text-gray-700">
                            Stop {index + 1}
                          </p>
                          <p className="text-gray-600">{stop.address}</p>
                        </div>
                      </li>
                    ))}
                    <li className="flex items-start">
                      <MapPin className="mr-2 h-5 w-5 text-red-500 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-medium text-gray-700">Dropoff</p>
                        <p className="text-gray-600">
                          {formData.dropoffAddress}
                        </p>
                      </div>
                    </li>
                  </ol>
                </div>

                {/* Distance */}
                {distance !== null && (
                  <div className="bg-green-50 p-4 rounded-lg shadow-md">
                    <p className="text-green-800 font-medium">
                      Total Distance: {distance.toFixed(2)} miles
                    </p>
                  </div>
                )}

                {/* Total Cost */}
                <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                  <h4 className="text-2xl font-semibold text-gray-800 mb-2">
                    Total Cost: ${totalPrice.toFixed(2)}
                  </h4>
                  <p className="text-gray-600">
                    This includes all fees and additional charges.
                  </p>
                </div>

                {/* Payment Form */}
                {clientSecret && (
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h4 className="text-xl font-semibold mb-4 text-gray-800">
                      Payment
                    </h4>
                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                      <CheckoutForm
                        clientSecret={clientSecret}
                        onSuccess={handlePaymentSuccess}
                        totalPrice={totalPrice}
                      />
                    </Elements>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
