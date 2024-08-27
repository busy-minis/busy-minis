"use client";

import { FormEvent } from "react";
import { signup } from "./actions"; // Import your signup function
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function SignupPage() {
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    await signup(formData);
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-800">
      <div className="flex flex-col items-center w-full p-8 space-y-8 bg-gray-100 rounded-xl shadow-lg max-w-4xl">
        {/* Logo */}
        <Logo />

        {/* Sign Up Form */}
        <div className="w-full">
          <h1 className="text-4xl font-bold text-center text-gray-900">
            Create Your Account
          </h1>
          <p className="text-center text-lg text-gray-600">
            Join us and enjoy our reliable transportation services!
          </p>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {/* First Name */}
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                className="block w-full px-4 py-3 mt-1 border border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500"
                placeholder="John"
                required
              />
            </div>

            {/* Last Name */}
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                className="block w-full px-4 py-3 mt-1 border border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500"
                placeholder="Doe"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="block w-full px-4 py-3 mt-1 border border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500"
                placeholder="you@example.com"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="block w-full px-4 py-3 mt-1 border border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirm-password"
                name="confirm-password"
                className="block w-full px-4 py-3 mt-1 border border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                required
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                I agree to the{" "}
                <Link href="#" className="text-orange-600 hover:underline">
                  Terms and Conditions
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 text-white bg-orange-600 rounded-lg shadow-lg hover:bg-orange-700 transition-colors duration-300"
            >
              Sign Up
            </button>
          </form>

          {/* Already have an account? */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-orange-600 font-medium hover:underline"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

// Logo Component
const Logo = () => (
  <div className="flex items-center justify-center">
    <Image
      src="/logo-small.png"
      alt="Logo"
      width={100}
      height={100}
      priority
      className="object-contain"
    />
  </div>
);
