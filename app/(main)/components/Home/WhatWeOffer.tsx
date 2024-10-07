"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Book,
  Tent,
  Phone,
  Church,
  Ticket,
  Gift,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Football, Wheelchair } from "@phosphor-icons/react/dist/ssr";

const services = [
  {
    name: "Tutoring/After School Transport",
    description:
      "Safe, reliable rides to and from tutoring sessions and after-school activities.",
    icon: Book,
  },
  {
    name: "Summer Camp Transport",
    description:
      "Secure and dependable transportation tailored to your summer camp schedule.",
    icon: Tent,
  },
  {
    name: "Last-Minute or Sick Child Pick-Up",
    description:
      "Prompt and safe pick-up services for last-minute or sick child situations.",
    icon: Phone,
  },
  {
    name: "Special Needs Transport",
    description:
      "Tailored, compassionate, and secure transportation solutions for children with special needs.",
    icon: Wheelchair,
  },
  {
    name: "Sports/Extracurricular Transport",
    description:
      "Reliable transportation to sports practices and extracurricular activities.",
    icon: Football,
  },
  {
    name: "Religious Activity Transport",
    description: "Dependable transportation to and from religious events.",
    icon: Church,
  },
  {
    name: "Six Flags Season Pass Transport",
    description:
      "Secure transportation to and from Six Flags for season pass holders.",
    icon: Ticket,
  },
  {
    name: "Birthday Party Transport",
    description: "Safe and reliable transportation to and from party venues.",
    icon: Gift,
  },
  {
    name: "Customized Routes",
    description:
      "Personalized and flexible transportation routes designed just for you.",
    icon: MapPin,
  },
];

export default function WhatWeOffer() {
  return (
    <section className="py-20 px-6 bg-gradient-to-b from-orange-50 to-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            What Do We Offer?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Busy Minis Transportation offers services tailored to your
            family&apos;s needs. From safe school transportation to
            extracurricular activities, we ensure a reliable experience.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.5 }}
            >
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                    <service.icon className="w-6 h-6 text-orange-600" />
                  </div>
                  <CardTitle>{service.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{service.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="flex justify-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Button
            asChild
            size="lg"
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            <Link href="/pricing" className="flex items-center gap-2">
              Get A Quote
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
