import React, { useState, useEffect } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface CheckoutFormProps {
  clientSecret: string;
  onSuccess: (paymentIntent: any) => void;
  totalPrice: number;
}

export default function CheckoutForm({
  clientSecret,
  onSuccess,
  totalPrice,
}: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentIntentStatus, setPaymentIntentStatus] = useState<string | null>(
    null
  );
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (stripe) {
      stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
        setPaymentIntentStatus(paymentIntent?.status || null);
      });
    }
  }, [stripe, clientSecret]);

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
        confirmParams: {
          return_url: `${window.location.origin}/payment-confirmation`,
        },
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
          description: "Your ride has been booked successfully!",
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

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <Button className="mt-4 w-full" type="submit" disabled={isLoading}>
        {isLoading ? "Processing..." : `Pay $${totalPrice.toFixed(2)}`}
      </Button>
    </form>
  );
}
