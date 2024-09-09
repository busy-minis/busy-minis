"use client";
import React from "react";
import { loadStripe } from "@stripe/stripe-js";

// Move stripePromise outside of the component to avoid re-initialization
const stripePromise = loadStripe(
  "pk_test_51Pq0V6AU6tLKej0RgL8EyqnGLr2FSrqtraFvpHgSi6R5jGL2J2BhRJJmumdajy3WgzuNlnZK6drMlrLAtw5cixYP00kozGoK19"
);

export default function Page() {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const stripe = await stripePromise;

    if (!stripe) {
      console.error("Stripe not loaded");
      return;
    }

    try {
      // Call the backend to create a checkout session
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          price: 10, // Add a price (in USD)
          rideData: {
            name: "Jerone", // Replace with actual ride data
            pickupAddress: "123 Main St",
            dropoffAddress: "456 Park Ave",
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const session = await response.json();
      const result = await stripe.redirectToCheckout({ sessionId: session.id });

      if (result.error) {
        console.error("Stripe Checkout error:", result.error.message);
      }
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="p-24">
        <button type="submit" className="bg-black text-white px-8 py-4">
          Test Stripe
        </button>
      </form>
    </div>
  );
}
