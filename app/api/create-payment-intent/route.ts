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

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error("API: Error creating Payment Intent:", err);
    return new NextResponse("Error creating Payment Intent", { status: 500 });
  }
}
