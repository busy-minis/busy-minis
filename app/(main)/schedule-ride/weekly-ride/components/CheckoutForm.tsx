"use client";

import React, { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { MapPin, User, Clock, Calendar, DollarSign } from "lucide-react";

interface CheckoutFormProps {
  clientSecret: string;
  onSuccess: (paymentIntent: any) => Promise<void>;
  totalPrice: number;
  formData: {
    pickupAddress: string;
    dropoffAddress: string;
    riders: { name: string; age: string }[];
    selectedTime: string;
    selectedDays: string[];
    pickupDate: string;
  };
}

export default function CheckoutForm({
  clientSecret,
  onSuccess,
  totalPrice,
  formData,
}: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      console.error("Stripe.js hasn't loaded yet.");
      return;
    }

    setIsLoading(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      });

      if (error) {
        console.error("Payment confirmation error:", error);
        toast({
          title: "Payment Error",
          description:
            error.message || "An error occurred during payment processing.",
          variant: "destructive",
        });
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        await onSuccess(paymentIntent);
        toast({
          title: "Payment Successful",
          description: "Your weekly ride has been booked successfully!",
        });
        router.push("/success");
      } else {
        console.error(
          "Unexpected payment intent status:",
          paymentIntent?.status
        );
        toast({
          title: "Payment Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error in payment confirmation:", error);
      toast({
        title: "Payment Error",
        description:
          "An error occurred during payment processing. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  function formatDateLocal(dateString: string): string {
    const [year, month, day] = dateString.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return format(date, "MMMM do, yyyy");
  }
  function formatTime(time24: string): string {
    const [hours, minutes] = time24.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const hours12 = hours % 12 || 12;
    return `${hours12}:${minutes < 10 ? `0${minutes}` : minutes} ${period}`;
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Booking Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <MapPin className="mr-2" />
              Trip Details
            </h3>
            <p className="text-sm">
              <Badge variant="outline" className="mr-2">
                Pickup
              </Badge>
              {formData.pickupAddress}
            </p>
            <p className="text-sm mt-1">
              <Badge variant="outline" className="mr-2">
                Dropoff
              </Badge>
              {formData.dropoffAddress}
            </p>
          </div>

          <Separator />

          <div>
            <p className="text-sm">
              Pickup Time: {formatTime(formData.selectedTime)}
            </p>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <User className="mr-2" />
              Riders
            </h3>
            {formData.riders.map((rider, index) => (
              <p key={index} className="text-sm">
                Rider {index + 1}: {rider.name} (Age: {rider.age})
              </p>
            ))}
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <DollarSign className="mr-2" />
              Total Price
            </h3>
            <p className="text-2xl font-bold text-green-600">
              ${totalPrice.toFixed(2)}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Payment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <PaymentElement />
            <Button className="mt-4 w-full" type="submit" disabled={isLoading}>
              {isLoading ? "Processing..." : `Pay $${totalPrice.toFixed(2)}`}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
