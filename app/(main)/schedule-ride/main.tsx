"use client";

import React from "react";
import Link from "next/link";
import { Car, CalendarCheck } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function RideOptions() {
  const rideOptions = [
    {
      name: "Single Ride",
      description:
        "Perfect for one-time needs like emergencies, last-minute plans, or special events. Ensure a safe and reliable ride for your child when you need it most.",
      icon: <Car className="h-6 w-6" />,
      link: "/schedule-ride/single-ride",
    },
    {
      name: "Weekly Ride",
      description:
        "Ideal for recurring trips to school, after-school activities, or other regular engagements. Save time and gain peace of mind with a weekly ride plan tailored to your schedule.",
      icon: <CalendarCheck className="h-6 w-6" />,
      link: "/schedule-ride/weekly-ride",
      discount: "Save up to 15%",
    },
  ];

  return (
    <section className="bg-gradient-to-b from-white to-gray-100 py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
            Choose Your Ride Plan
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Whether it&apos;s a one-time trip or a weekly service, choose the
            ride plan that best fits your family&apos;s needs, with safety and
            reliability guaranteed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {rideOptions.map((option, index) => (
            <Card
              key={index}
              className="relative overflow-hidden transition-all duration-300 hover:shadow-lg"
            >
              <Link
                href={option.link}
                className="absolute inset-0 z-10"
                aria-label={`Select ${option.name}`}
              >
                <span className="sr-only">Select {option.name}</span>
              </Link>
              <CardHeader className="pb-2">
                <div className="w-12 h-12 rounded-full bg-zinc-900  flex items-center justify-center mb-4">
                  {React.cloneElement(option.icon, {
                    className: "text-zinc-100",
                  })}
                </div>
                <CardTitle className="text-2xl font-bold">
                  {option.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {option.description}
                </CardDescription>
                {option.discount && (
                  <Badge
                    variant="secondary"
                    className="mt-4 text-sm font-medium"
                  >
                    {option.discount}
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
