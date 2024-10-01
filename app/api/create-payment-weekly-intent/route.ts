import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function POST(req: Request) {
  try {
    const { price, rideData } = await req.json();

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(price * 100), // Stripe expects amount in cents
      currency: "usd",
      metadata: {
        rideType: "weekly",
        userId: rideData.user_id,
        pickupDate: rideData.pickupDate,
        selectedDays: rideData.selectedDays.join(","),
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error creating PaymentIntent:", error);
    return NextResponse.json(
      {
        message: "Error creating PaymentIntent",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
