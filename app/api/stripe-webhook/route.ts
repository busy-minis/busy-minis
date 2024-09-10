import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

// Initialize Stripe and Supabase clients
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const endpointSecret = "whsec_hayoDar28G1OmT42CsGLGOWCx9QttDMP";

export async function POST(request: Request) {
  const payload = await request.text();
  const sig = request.headers.get("stripe-signature");

  let event;

  // Verify the webhook signature
  try {
    event = stripe.webhooks.constructEvent(payload, sig!, endpointSecret);
    console.log("✅ Webhook verified successfully");
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err);
    return new NextResponse("Webhook error", { status: 400 });
  }

  // Handle the checkout session completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log("🎉 Checkout session completed:", session);

    // Check if rideData was passed in the metadata
    const rideData = session.metadata?.rideData;
    if (!rideData) {
      console.error("❌ No ride data found in metadata");
      return new NextResponse("No ride data", { status: 400 });
    }

    console.log("🚗 Ride Data:", rideData);

    try {
      // Insert ride data into Supabase
      const { data, error } = await supabase
        .from("rides")
        .insert([JSON.parse(rideData)]);

      if (error) {
        console.error("❌ Error inserting ride into Supabase:", error);
        return new NextResponse("Supabase insertion error", { status: 500 });
      }

      console.log("✅ Ride successfully inserted into Supabase:", data);
    } catch (error) {
      console.error("❌ Unexpected error inserting ride into Supabase:", error);
      return new NextResponse("Supabase insert error", { status: 500 });
    }
  } else {
    console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
