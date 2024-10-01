import { NextResponse } from "next/server";
import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const yourPhoneNumber = process.env.YOUR_PHONE_NUMBER!;

const client = twilio(accountSid, authToken);

export async function POST(request: Request) {
  const { rideInfo } = await request.json();

  try {
    const message = await client.messages.create({
      body: `New Ride Booked:\n${JSON.stringify(rideInfo, null, 2)}`,
      from: twilioPhoneNumber,
      to: yourPhoneNumber,
    });

    return NextResponse.json({ success: true, messageId: message.sid });
  } catch (error) {
    console.error("Error sending SMS:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send SMS" },
      { status: 500 }
    );
  }
}
