import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function POST(request: Request) {
  try {
    const { price, rideData } = await request.json();

    if (!price || !rideData) {
      return new NextResponse("Invalid request data", { status: 400 });
    }

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
            unit_amount: price * 100, // Convert to cents
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
