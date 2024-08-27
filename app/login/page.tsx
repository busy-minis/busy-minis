"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { login } from "./actions";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const result = await login(formData);

    if (result?.error) {
      setError(result.error); // Set error state if there's an error
    } else {
      setError(null); // Clear error state on success
      window.location.href = "/dashboard"; // Redirect manually
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row text-gray-900">
      {/* Left Section: Login Form */}
      <div className="flex w-full md:w-1/2 flex-col justify-center p-8 md:p-16">
        {/* Logo */}
        <div className="flex justify-center md:justify-start mb-12">
          <Link href="/">
            <Image
              src="/logo-large.png"
              alt="Company Logo"
              width={200}
              height={200}
              className="object-contain"
            />
          </Link>
        </div>

        {/* Welcome Text */}
        <div className="max-w-md mx-auto text-center md:text-left">
          <h2 className="text-4xl font-bold">Welcome Back</h2>
          <p className="mt-2 text-lg text-gray-600">
            Log in to access your account and manage your services.
          </p>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500 transition duration-200"
                  required
                />
              </div>

              <div className="relative">
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500 transition duration-200"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 mt-6 bg-orange-600 text-white font-semibold rounded-lg shadow-md hover:bg-orange-700 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              Log In
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-8">
            <p className="text-gray-600">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-orange-600 font-semibold hover:underline"
              >
                Sign up for free
              </Link>
              .
            </p>
          </div>
        </div>
      </div>

      {/* Right Section: Hero Image and Message */}
      <div className="hidden md:flex md:w-1/2 relative bg-orange-600 text-white p-8 md:p-16 items-center justify-center overflow-hidden">
        <div className="relative z-10 max-w-md text-center">
          <h3 className="text-3xl font-bold mb-4">
            Secure & Reliable Services
          </h3>
          <p className="text-lg leading-relaxed mb-6">
            We are committed to delivering secure and reliable services to
            ensure the safety and satisfaction of our customers.
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white opacity-10 rounded-full"></div>
        <div className="absolute top-10 left-10 w-32 h-32 bg-gray-200 opacity-20 rounded-full"></div>
      </div>
    </div>
  );
}
