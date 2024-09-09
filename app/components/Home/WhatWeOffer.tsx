import React from "react";
import { ArrowRight, Star } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

export default function WhatWeOffer() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight leading-tight">
          What Do We Offer?
        </h2>
        <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
          Busy Minis Transportation offers services tailored to your familys
          needs. From safe school transportation to extracurricular activities,
          we ensure a reliable experience.
        </p>
      </div>

      {/* Offers Grid */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {offers.map((offer, index) => (
          <OfferItem key={index} title={offer.title} />
        ))}
      </div>

      {/* Call to Action */}
      <div className="flex justify-center mt-16">
        <Link
          href="/services"
          className="flex items-center bg-orange-600 hover:bg-orange-700 text-white transition-all px-8 py-4 gap-3 rounded-full shadow-lg text-lg font-semibold hover:shadow-xl transform hover:scale-105"
        >
          <span>Explore Our Services</span>
          <ArrowRight className="text-2xl" weight="bold" />
        </Link>
      </div>
    </section>
  );
}

// Offer Item Component
const OfferItem = ({ title }: any) => {
  return (
    <div className="flex flex-col text-center items-center p-6 bg-gray-100 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 hover:bg-white">
      <Star className="text-orange-600 text-4xl mb-4" weight="fill" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 text-center">
        We provide customized transportation solutions that prioritize safety,
        reliability, and comfort for all.
      </p>
    </div>
  );
};

// Offer Data
const offers = [
  { title: "Tutoring & After School Transportation" },
  { title: "Summer Camp Transportation" },
  { title: "Emergency Pickups & Sick Child Transport" },
  { title: "Transportation for Children with Special Needs" },
  { title: "Sports & Extracurricular Activities" },
  { title: "Religious Event Transportation" },
];
