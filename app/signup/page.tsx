// app/signup/page.tsx

"use client";

import { FormEvent, useState } from "react";
import { signup } from "./actions"; // Import your updated signup function
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function SignupPage() {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const newErrors: { [key: string]: string } = {};

    // Extract form data
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const phoneNumber = formData.get("phone_number") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirm-password") as string;

    // Clear previous messages
    setErrors({});
    setFormSuccess(null);

    // Validate first name
    const namePattern = /^[A-Za-z\s'-]+$/;
    if (!namePattern.test(firstName)) {
      newErrors.firstName =
        "First name can only contain letters, spaces, apostrophes, and hyphens.";
    }

    // Validate last name
    if (!namePattern.test(lastName)) {
      newErrors.lastName =
        "Last name can only contain letters, spaces, apostrophes, and hyphens.";
    }

    // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    // Validate phone number format
    const phonePattern = /^\+?[1-9]\d{1,14}$/; // E.164 format
    if (!phonePattern.test(phoneNumber)) {
      newErrors.phone_number = "Please enter a valid phone number.";
    }

    // Validate password match
    if (password !== confirmPassword) {
      newErrors["confirm-password"] = "Passwords do not match.";
    }

    // Validate password strength
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      newErrors.password =
        "Password must be at least 8 characters long and include letters, numbers, and special characters.";
    }

    // If there are errors, set them and abort submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await signup(formData);

      if (response.error) {
        setErrors({ general: response.error });
      } else if (response.success) {
        setFormSuccess("Account created successfully! Redirecting to login...");
        // Redirect after a short delay
        setTimeout(() => {
          window.location.href = "/login";
        }, 3000);
      }
    } catch (error) {
      setErrors({ general: "An unexpected error occurred. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6">
        {/* Logo */}
        <div className="flex justify-center">
          <Link href="/">
            {/* Removed <a> tag */}
            <Image
              src="/logo-small.png"
              alt="Logo"
              width={100}
              height={100}
              priority
              className="object-contain"
            />
          </Link>
        </div>

        {/* Signup Form */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-2">
            Create Your Account
          </h2>
          <p className="text-center text-gray-600 mb-6">
            Join us and enjoy our reliable transportation services!
          </p>

          {/* Success Message */}
          {formSuccess && (
            <div className="mb-4 p-4 text-green-700 bg-green-100 rounded flex items-center">
              <svg
                className="h-5 w-5 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>{formSuccess}</span>
            </div>
          )}

          {/* General Error Message */}
          {errors.general && (
            <div className="mb-4 p-4 text-red-700 bg-red-100 rounded">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* First Name */}
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                className={`w-full px-3 py-2 border ${
                  errors.firstName ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                placeholder="John"
                required
                onChange={handleInputChange}
                aria-describedby={
                  errors.firstName ? "firstName-error" : undefined
                }
                aria-invalid={!!errors.firstName}
              />
              {errors.firstName && (
                <p id="firstName-error" className="mt-1 text-sm text-red-600">
                  {errors.firstName}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                className={`w-full px-3 py-2 border ${
                  errors.lastName ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                placeholder="Doe"
                required
                onChange={handleInputChange}
                aria-describedby={
                  errors.lastName ? "lastName-error" : undefined
                }
                aria-invalid={!!errors.lastName}
              />
              {errors.lastName && (
                <p id="lastName-error" className="mt-1 text-sm text-red-600">
                  {errors.lastName}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className={`w-full px-3 py-2 border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                placeholder="you@example.com"
                required
                onChange={handleInputChange}
                aria-describedby={errors.email ? "email-error" : undefined}
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <p id="email-error" className="mt-1 text-sm text-red-600">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phone_number"
                className={`w-full px-3 py-2 border ${
                  errors.phone_number ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                placeholder="+1 555 555 5555"
                required
                onChange={handleInputChange}
                aria-describedby={
                  errors.phone_number ? "phone_number-error" : undefined
                }
                aria-invalid={!!errors.phone_number}
              />
              {errors.phone_number && (
                <p
                  id="phone_number-error"
                  className="mt-1 text-sm text-red-600"
                >
                  {errors.phone_number}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className={`w-full px-3 py-2 border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                placeholder="••••••••"
                required
                onChange={handleInputChange}
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

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirm-password"
                name="confirm-password"
                className={`w-full px-3 py-2 border ${
                  errors["confirm-password"]
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                placeholder="••••••••"
                required
                onChange={handleInputChange}
                aria-describedby={
                  errors["confirm-password"]
                    ? "confirm-password-error"
                    : undefined
                }
                aria-invalid={!!errors["confirm-password"]}
              />
              {errors["confirm-password"] && (
                <p
                  id="confirm-password-error"
                  className="mt-1 text-sm text-red-600"
                >
                  {errors["confirm-password"]}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 bg-orange-600 text-white rounded-md shadow-md hover:bg-orange-700 transition-colors duration-300 flex items-center justify-center ${
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
                  Signing Up...
                </>
              ) : (
                "Sign Up"
              )}
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

  // Logo Component (if still needed)
  const Logo = () => (
    <div className="flex items-center justify-center mb-6">
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
}
