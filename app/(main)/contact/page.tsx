"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, XCircle } from "lucide-react";

export default function ContactPage() {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean | null>(null);
  const [submitCount, setSubmitCount] = useState(0);
  const [lastSubmitTime, setLastSubmitTime] = useState(0);

  useEffect(() => {
    const storedCount = localStorage.getItem("submitCount");
    const storedTime = localStorage.getItem("lastSubmitTime");
    if (storedCount) setSubmitCount(parseInt(storedCount, 10));
    if (storedTime) setLastSubmitTime(parseInt(storedTime, 10));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !subject || !message) {
      alert("Please fill in all fields.");
      return;
    }

    const now = Date.now();
    if (submitCount >= 5 && now - lastSubmitTime < 3600000) {
      alert("Please wait an hour before submitting again.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, subject, message }),
      });

      if (response.ok) {
        setSubmitSuccess(true);
        setEmail("");
        setSubject("");
        setMessage("");
        setSubmitCount((prevCount) => {
          const newCount = prevCount + 1;
          localStorage.setItem("submitCount", newCount.toString());
          return newCount;
        });
        setLastSubmitTime(now);
        localStorage.setItem("lastSubmitTime", now.toString());
      } else {
        setSubmitSuccess(false);
      }
    } catch (error) {
      setSubmitSuccess(false);
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-zinc-100  p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-zinc-700">
            Contact Us
          </CardTitle>
          <CardDescription className="text-center">
            Have questions? We&apos;d love to hear from you. Please send us a
            message below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                type="email"
                id="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                type="text"
                id="subject"
                placeholder="Your subject"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Write your message here..."
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[120px]"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
          </form>
          {submitSuccess === true && (
            <Alert
              variant="default"
              className="mt-6 bg-green-50 border-green-200"
            >
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>
                Your message has been sent successfully!
              </AlertDescription>
            </Alert>
          )}
          {submitSuccess === false && (
            <Alert variant="destructive" className="mt-6">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Failed to send message. Please try again.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
