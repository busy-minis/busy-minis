// pages/api/cancel-ride.ts
import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@/utils/supabase/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { rideId, isWeekly } = req.body;

  try {
    const supabase = createClient();

    // Fetch the ride details
    const { data: ride, error: rideError } = await supabase
      .from("rides")
      .select("payment_intent_id, total_cost")
      .eq("id", rideId)
      .single();

    if (rideError || !ride) {
      return res.status(404).json({ error: "Ride not found" });
    }

    let refund;
    if (!isWeekly) {
      // Process the refund for non-weekly rides
      refund = await stripe.refunds.create({
        payment_intent: ride.payment_intent_id,
        amount: ride.total_cost, // Refund the full amount
      });
    }

    // Update the ride status in the database
    const updateData = isWeekly
      ? { status: "cancelled" }
      : {
          status: "cancelled",
          payment_status: "refunded",
          refund_id: refund?.id,
        };

    const { error: updateError } = await supabase
      .from("rides")
      .update(updateData)
      .eq("id", rideId);

    if (updateError) {
      throw updateError;
    }

    res.status(200).json({ success: true, refund: refund || null });
  } catch (error) {
    console.error("Error cancelling ride:", error);
    res.status(500).json({ error: "Failed to cancel ride" });
  }
}
