"use client";
import { FormEvent, useState } from "react";
import { createDriver } from "./actions";
import React from "react";

export default function AddDriverPage() {
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);

    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    // Check if passwords match
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    // Reset error state if passwords match
    setPasswordError(null);

    await createDriver(formData);
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-100 to-gray-300 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-md p-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
          Register as a Driver
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Fill in the details below to create a new driver account.
        </p>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700"
              >
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                id="firstName"
                className="block w-full px-4 py-2 mt-1 border rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 border-gray-300"
                placeholder="John"
                required
              />
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700"
              >
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                className="block w-full px-4 py-2 mt-1 border rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 border-gray-300"
                placeholder="Doe"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className="block w-full px-4 py-2 mt-1 border rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 border-gray-300"
                placeholder="driver@example.com"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                className="block w-full px-4 py-2 mt-1 border rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 border-gray-300"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Confirm Password Field */}
            <div className="sm:col-span-2">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                className="block w-full px-4 py-2 mt-1 border rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 border-gray-300"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Display password mismatch error */}
            {passwordError && (
              <div className="sm:col-span-2">
                <p className="text-sm text-red-500">{passwordError}</p>
              </div>
            )}

            <div>
              <label
                htmlFor="licensePlate"
                className="block text-sm font-medium text-gray-700"
              >
                License Plate
              </label>
              <input
                type="text"
                name="licensePlate"
                id="licensePlate"
                className="block w-full px-4 py-2 mt-1 border rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 border-gray-300"
                placeholder="ABC1234"
                required
              />
            </div>

            <div>
              <label
                htmlFor="vehicleBrand"
                className="block text-sm font-medium text-gray-700"
              >
                Vehicle Brand
              </label>
              <input
                type="text"
                name="vehicleBrand"
                id="vehicleBrand"
                className="block w-full px-4 py-2 mt-1 border rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 border-gray-300"
                placeholder="Toyota"
                required
              />
            </div>

            <div>
              <label
                htmlFor="vehicleYear"
                className="block text-sm font-medium text-gray-700"
              >
                Vehicle Year
              </label>
              <input
                type="number"
                name="vehicleYear"
                id="vehicleYear"
                className="block w-full px-4 py-2 mt-1 border rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 border-gray-300"
                placeholder="2020"
                required
              />
            </div>

            <div>
              <label
                htmlFor="vehicleColor"
                className="block text-sm font-medium text-gray-700"
              >
                Vehicle Color
              </label>
              <input
                type="text"
                name="vehicleColor"
                id="vehicleColor"
                className="block w-full px-4 py-2 mt-1 border rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 border-gray-300"
                placeholder="Blue"
                required
              />
            </div>

            {/* New Phone Number Field */}
            <div className="sm:col-span-2">
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                id="phoneNumber"
                className="block w-full px-4 py-2 mt-1 border rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 border-gray-300"
                placeholder="(123) 456-7890"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 text-sm font-medium text-white bg-teal-600 rounded-md shadow-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          >
            Register Driver
          </button>
        </form>
      </div>
    </section>
  );
}
