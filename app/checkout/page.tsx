"use client";

import React, { useState, FormEvent } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(
  "pk_test_51Pq0V6AU6tLKej0RgL8EyqnGLr2FSrqtraFvpHgSi6R5jGL2J2BhRJJmumdajy3WgzuNlnZK6drMlrLAtw5cixYP00kozGoK19"
);

export default function CheckoutPage() {
  return (
    <Elements stripe={stripePromise}>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
          <CheckoutForm />
        </div>
      </div>
    </Elements>
  );
}

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentSucceeded, setPaymentSucceeded] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const response = await fetch("/api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: 2500 }), // Amount in cents (e.g. $25.00)
    });

    const { clientSecret } = await response.json();

    if (!stripe || !elements) {
      setIsLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setError("Card details are not complete");
      setIsLoading(false);
      return;
    }

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: "Test User", // Replace with actual user's name
        },
      },
    });

    if (result.error) {
      setError(result.error.message || "Payment failed");
      setIsLoading(false);
    } else if (
      result.paymentIntent &&
      result.paymentIntent.status === "succeeded"
    ) {
      setPaymentSucceeded(true);
      setIsLoading(false);
    }
  };

  return paymentSucceeded ? (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-green-600 mb-4">
        Payment Successful!
      </h2>
      <p className="text-lg text-gray-700">
        Your ride has been successfully paid for.
      </p>
    </div>
  ) : (
    <form onSubmit={handleSubmit}>
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-8">
        Complete Your Payment
      </h1>

      {/* Trip Summary Section */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Trip Summary
        </h2>
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm text-gray-700">
          <p className="mb-1">
            <strong>Pickup Location:</strong> 1234 Elm Street, Springfield, IL
          </p>
          <p className="mb-1">
            <strong>Dropoff Location:</strong> 5678 Oak Avenue, Chicago, IL
          </p>
          <p className="mb-1">
            <strong>Pickup Time:</strong> 10:00 AM, August 24, 2024
          </p>
          <p className="mb-1">
            <strong>Passengers:</strong> John Doe, Jane Doe
          </p>
          <p>
            <strong>Special Instructions:</strong> Please ensure the car seat is
            installed.
          </p>
        </div>
      </div>

      {/* Payment Summary Section */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Payment Summary
        </h2>
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm text-gray-700">
          <p className="mb-1">
            <strong>Base Fare:</strong> $20.00
          </p>
          <p className="mb-1">
            <strong>Additional Passenger Fee:</strong> $5.00
          </p>
          <p className="mb-1">
            <strong>Total:</strong> $25.00
          </p>
        </div>
      </div>

      {/* Card Details Form */}
      <div className="mb-6">
        <label
          htmlFor="card-element"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Card Details
        </label>
        <div className="border border-gray-300 rounded-lg p-3 bg-white">
          <CardElement id="card-element" className="p-2" />
        </div>
        {error && <div className="text-red-600 mt-2">{error}</div>}
      </div>

      <Button
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md transition-colors duration-200"
      >
        {isLoading ? "Processing..." : "Pay $25.00"}
      </Button>
    </form>
  );
}
