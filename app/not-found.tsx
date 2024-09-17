// app/not-found.tsx

import Link from "next/link";
import Image from "next/image";
import React from "react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md text-center">
        {/* Optional Logo */}
        <Link href="/">
          <div>
            <Image
              src="/logo-large.png" // Replace with your logo path
              alt="Company Logo"
              width={150}
              height={150}
              className="mx-auto mb-6"
            />
          </div>
        </Link>

        {/* 404 Illustration */}
        <div className="flex justify-center mb-6">
          <Image
            src="/logo.png" // Replace with your 404 illustration path
            alt="Page Not Found"
            width={300}
            height={300}
            className="object-contain"
          />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
          Oops! Page Not Found
        </h1>

        {/* Description */}
        <p className="text-gray-600 mb-6">
          The page you&lsquo;re looking for doesn&lsquo;t exist or has been
          moved.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row sm:justify-center gap-4">
          <Link href="/">
            <div className="px-6 py-3 bg-orange-600 text-white rounded-lg shadow hover:bg-orange-700 transition duration-300">
              Go to Home
            </div>
          </Link>
          <Link href="/contact">
            <div className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg shadow hover:bg-gray-300 transition duration-300">
              Contact Support
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
