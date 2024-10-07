import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function POST(request: Request) {
  try {
    const { price, rideData } = await request.json();

    console.log("API: Received price:", price);
    console.log("API: Ride data:", JSON.stringify(rideData, null, 2));

    // Convert price to cents and ensure it's an integer
    const amount = Math.round(price * 100);

    console.log("API: Calculated amount in cents:", amount);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      metadata: {
        rideData: JSON.stringify(rideData),
      },
    });

    console.log(
      "API: Created PaymentIntent with amount:",
      paymentIntent.amount
    );

    // Create a response with no-cache headers
    const response = NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });

    // Set cache control headers
    response.headers.set("Cache-Control", "no-store, max-age=0");
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");

    return response;
  } catch (err) {
    console.error("API: Error creating Payment Intent:", err);

    // Create an error response with no-cache headers
    const errorResponse = new NextResponse("Error creating Payment Intent", {
      status: 500,
    });

    // Set cache control headers for error response
    errorResponse.headers.set("Cache-Control", "no-store, max-age=0");
    errorResponse.headers.set("Pragma", "no-cache");
    errorResponse.headers.set("Expires", "0");

    return errorResponse;
  }
}

export const config = {
  runtime: "edge",
};
