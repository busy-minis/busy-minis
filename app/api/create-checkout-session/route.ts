// app/api/create-checkout-session/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(
  "sk_test_51Pq0V6AU6tLKej0RA5m9vg5o3CoGigKlumK9fg0vlQ60eduPnGM94YNGyJRt4QD9wiiTeCeqAqYUfC5oDDtewXM400EiV80CTU",
  {
    apiVersion: "2024-06-20",
  }
);

export async function POST(request: Request) {
  const { price, rideData } = await request.json();

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Ride Booking",
              description: `Pickup: ${rideData.pickupAddress}, Dropoff: ${rideData.dropoffAddress}`,
            },
            unit_amount: price * 100, // Stripe expects amount in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${request.headers.get("origin")}/success`,
      cancel_url: `${request.headers.get("origin")}/cancel`,
      metadata: {
        rideData: JSON.stringify(rideData), // Pass ride data as metadata
      },
    });

    return NextResponse.json({ id: session.id });
  } catch (err) {
    console.error("Error creating Stripe session:", err);
    return new NextResponse("Error creating session", { status: 500 });
  }
}
