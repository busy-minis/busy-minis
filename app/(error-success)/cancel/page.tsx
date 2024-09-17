"use client";
import { XCircle, ArrowCircleLeft, Headset } from "@phosphor-icons/react";
import Link from "next/link";

export default function CancelPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-teal-50 to-orange-100">
      <XCircle size={72} className="text-teal-600 mb-6" />
      <h1 className="text-4xl font-bold text-orange-600 mb-4">
        Payment Cancelled
      </h1>
      <p className="text-lg text-black mb-8 max-w-md text-center">
        Unfortunately, your payment could not be completed. If you experienced
        an issue, please try again or contact our support team for further
        assistance.
      </p>

      <div className="flex space-x-6">
        {/* Go Back Home Link */}
        <Link href="/">
          <div className="flex items-center bg-white text-teal-600 px-6 py-3 rounded-full shadow-lg hover:bg-gray-100 transition-transform duration-200 ease-in-out cursor-pointer">
            <ArrowCircleLeft size={24} className="mr-2" />
            Go Back Home
          </div>
        </Link>

        {/* Contact Us Link */}
        <Link href="/contact-us">
          <div className="flex items-center bg-orange-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-orange-700 transition-transform duration-200 ease-in-out cursor-pointer">
            <Headset size={24} className="mr-2" />
            Contact Support
          </div>
        </Link>
      </div>
    </div>
  );
}
