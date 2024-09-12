import { NextRequest, NextResponse } from "next/server";
import { EmailTemplate } from "@/app/(main)/components/email-template";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { email, subject, message } = await req.json();

    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: ["delivered@resend.dev"], // Replace with your desired recipient
      subject: subject,
      react: EmailTemplate({ firstName: email, message: message }), // Update your EmailTemplate to handle message
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
