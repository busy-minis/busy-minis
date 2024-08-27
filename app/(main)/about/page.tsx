"use client";
import React, { useState } from "react";
import Footer from "@/app/components/ui/Footer";
import { driverSafetyData, faqData } from "./data";
import Image from "next/image";
import {
  ArrowDown,
  CheckCircle,
  ShieldCheck,
  Question,
} from "@phosphor-icons/react";
import Link from "next/link";

export default function Page() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <AboutSection />
      <MissionSection />
      <DriverSafetySection />
      <FAQSection />
      <Footer />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative flex flex-col items-center justify-center text-center bg-gradient-to-r from-teal-600 to-teal-800 py-32 sm:py-48 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/background-pattern.png"
          alt=""
          layout="fill"
          objectFit="cover"
          quality={100}
          className="opacity-10"
        />
      </div>
      <div className="relative z-10 flex flex-col items-center">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white drop-shadow-lg leading-tight">
          About Us
        </h1>
        <p className="mt-4 text-base sm:text-lg text-gray-200 max-w-lg sm:max-w-2xl">
          Safe, reliable, and joyful transportation for your children. Focus on
          what matters most while we take care of the rest.
        </p>
        <Link
          href={"/pricing"}
          className="mt-6 sm:mt-8 bg-teal-500 text-white font-semibold rounded-full px-6 sm:px-8 py-2 sm:py-3 hover:bg-teal-400 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          Get a Quote
        </Link>
      </div>
      <div className="absolute bottom-6 sm:bottom-8">
        <ArrowDown size={28} className="text-gray-100 animate-bounce" />
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section className="py-12 sm:py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <ImageGallery />
          <AboutContent />
        </div>
      </div>
    </section>
  );
}

function ImageGallery() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-4">
      <ImageItem src="/assets/09.png" alt="Children smiling" />
      <ImageItem src="/assets/laugh.png" alt="Children laughing" />
      <ImageItem src="/assets/pexel.jpg" alt="Children playing" />
    </div>
  );
}

function ImageItem({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="w-full h-48 sm:h-64 relative overflow-hidden rounded-lg shadow-md">
      <Image
        src={src}
        alt={alt}
        layout="fill"
        objectFit="cover"
        className="transition-transform duration-300 hover:scale-105"
      />
    </div>
  );
}

function AboutContent() {
  return (
    <div>
      <span className="text-lg sm:text-xl font-semibold text-teal-600">
        Who We Are
      </span>
      <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3 sm:mt-4">
        Joyful Rides for Your Minis
      </h2>
      <p className="text-base sm:text-lg text-gray-600 mt-4 sm:mt-6 leading-relaxed">
        Busy Minis was founded by Lia, a working mother who recognized the need
        for joyful, safe, and convenient transportation for children. With the
        desire to help parents balance their busy lives, Busy Minis was born to
        provide peace of mind with safe and reliable rides for kids.
      </p>
      <Link
        href="/about"
        className="inline-block mt-4 sm:mt-6 text-teal-600 font-semibold text-base sm:text-lg hover:underline"
      >
        Learn more
      </Link>
    </div>
  );
}

function MissionSection() {
  return (
    <section className="py-12 sm:py-20 bg-teal-800">
      <div className="max-w-6xl mx-auto text-center px-4 sm:px-6">
        <h2 className="text-3xl sm:text-4xl font-bold text-teal-400">
          Our Mission
        </h2>
        <p className="text-lg sm:text-xl text-gray-200 mt-4 sm:mt-6 leading-relaxed max-w-2xl mx-auto">
          At Busy Minis, our mission is to offer safe, reliable, and joyful
          transportation for children. Our focus is on providing peace of mind
          to parents by ensuring their children’s safety and punctuality, so
          they can focus on what matters most.
        </p>
      </div>
    </section>
  );
}

function DriverSafetySection() {
  return (
    <section className="py-12 sm:py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-teal-700">
          Drivers & Safety
        </h2>
        <p className="text-base sm:text-lg text-gray-600 mt-4">
          Our drivers undergo rigorous background checks and extensive training
          to ensure the safety of your children at all times.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-10 sm:mt-12">
          {driverSafetyData.map((item, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <ShieldCheck size={40} className="text-teal-600 mb-4 mx-auto" />
              <h3 className="text-lg sm:text-xl font-bold text-teal-700 mb-2">
                {item.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  return (
    <section className="py-12 sm:py-20 bg-teal-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-teal-300">
          Frequently Asked Questions
        </h2>
        <p className="text-base sm:text-lg text-gray-200 mt-4">
          Got questions? We have answers.
        </p>
        <div className="mt-10 sm:mt-12">
          {faqData.map((item, index) => (
            <FAQItem
              key={index}
              question={item.question}
              answer={item.answer}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`bg-teal-800 hover:bg-teal-700 p-5 sm:p-6 rounded-lg shadow-md my-4 transition-all duration-300 ${
        open ? "max-h-max" : "max-h-24 overflow-hidden"
      }`}
    >
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <Question size={24} className="text-teal-300 mr-4" />
        <h3 className="text-base sm:text-lg font-semibold text-teal-400">
          {question}
        </h3>
        <ArrowDown
          size={24}
          className={`text-teal-600 transform transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </div>
      {open && <p className="mt-4 text-gray-200">{answer}</p>}
    </div>
  );
}
