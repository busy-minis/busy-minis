import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/utils/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function POST(request: Request) {
  try {
    const { rideId } = await request.json();

    const supabase = createClient();

    // Fetch the ride details
    const { data: ride, error: rideError } = await supabase
      .from("rides")
      .select("payment_intent_id, total_cost")
      .eq("id", rideId)
      .single();

    if (rideError || !ride) {
      return NextResponse.json({ error: "Ride not found" }, { status: 404 });
    }

    // Convert total_cost to cents and round to the nearest integer
    const amountInCents = Math.round(ride.total_cost * 100);

    // Process the refund
    const refund = await stripe.refunds.create({
      payment_intent: ride.payment_intent_id,
      amount: amountInCents, // Use the converted amount in cents
    });

    // Update the ride status in the database
    const { error: updateError } = await supabase
      .from("rides")
      .update({ status: "refunded", refund_id: refund.id })
      .eq("id", rideId);

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to update ride status" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, refund });
  } catch (error) {
    console.error("Refund error:", error);
    return NextResponse.json({ error: "Refund failed" }, { status: 500 });
  }
}
