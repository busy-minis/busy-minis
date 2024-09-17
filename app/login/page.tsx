// app/login/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { login } from "./actions";

export default function LoginPage() {
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newErrors: { email?: string; password?: string; general?: string } =
      {};

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Basic client-side validations (optional for login)
    if (!email) {
      newErrors.email = "Email is required.";
    }

    if (!password) {
      newErrors.password = "Password is required.";
    }

    // If there are errors, set them and abort submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const result = await login(formData);

      if (result?.error) {
        setErrors({ general: result.error });
      } else {
        setErrors({});
        window.location.href = "/my-rides";
      }
    } catch (error) {
      setErrors({ general: "An unexpected error occurred. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof typeof errors) => {
    setErrors((prev) => ({ ...prev, [field]: undefined, general: undefined }));
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

          {/* General Error Message */}
          {errors.general && (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4 flex items-center">
              <svg
                className="h-5 w-5 mr-2 text-red-700"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <span>{errors.general}</span>
            </div>
          )}

          {/* Login Form */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
            <div className="space-y-4">
              {/* Email Input */}
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email"
                  className={`w-full px-4 py-3 border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } rounded-lg shadow-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500 transition duration-200`}
                  required
                  onChange={() => handleInputChange("email")}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  aria-invalid={!!errors.email}
                />
                {errors.email && (
                  <p id="email-error" className="mt-1 text-sm text-red-600">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Password"
                  className={`w-full px-4 py-3 border ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  } rounded-lg shadow-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500 transition duration-200`}
                  required
                  onChange={() => handleInputChange("password")}
                  aria-describedby={
                    errors.password ? "password-error" : undefined
                  }
                  aria-invalid={!!errors.password}
                />
                {errors.password && (
                  <p id="password-error" className="mt-1 text-sm text-red-600">
                    {errors.password}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 mt-6 bg-orange-600 text-white font-semibold rounded-lg shadow-md hover:bg-orange-700 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 flex items-center justify-center ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 mr-3 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                  Logging In...
                </>
              ) : (
                "Log In"
              )}
            </button>
          </form>

          {/* Forgot Password Link */}
          <div className="mt-4 text-center">
            <Link
              href="/forgot-password"
              className="text-orange-600 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

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
