// app/api/create-payment-intent/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function POST(request: Request) {
  try {
    const { price, rideData } = await request.json();

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(price * 100), // Stripe expects amount in cents
      currency: "usd",
      metadata: {
        rideData: JSON.stringify(rideData),
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error("Error creating Payment Intent:", err);
    return new NextResponse("Error creating Payment Intent", { status: 500 });
  }
}
