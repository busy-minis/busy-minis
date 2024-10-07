"use client";

import { FormEvent, useState } from "react";
import { signup } from "./actions";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-theme-orange-light via-theme-teal-dark to-theme-yellow-light p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="bg-white shadow-xl border-none">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-6">
              <Link href="/">
                <Image
                  src="/logo-large.png"
                  alt="Logo"
                  width={240}
                  height={180}
                  priority
                  className="object-contain"
                />
              </Link>
            </div>
            <CardTitle className="text-2xl font-bold text-center text-theme-teal-dark">
              Create Your Account
            </CardTitle>
            <CardDescription className="text-center text-theme-teal-dark">
              Join us and enjoy our reliable transportation services!
            </CardDescription>
          </CardHeader>
          <CardContent>
            {formSuccess && (
              <Alert className="mb-4 bg-theme-teal text-white">
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>{formSuccess}</AlertDescription>
              </Alert>
            )}

            {errors.general && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.general}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-theme-teal-dark">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="John"
                    required
                    onChange={handleInputChange}
                    aria-describedby={
                      errors.firstName ? "firstName-error" : undefined
                    }
                    aria-invalid={!!errors.firstName}
                    className="border-theme-teal/30 text-theme-teal-dark  placeholder-theme-teal-dark/50"
                  />
                  {errors.firstName && (
                    <p
                      id="firstName-error"
                      className="text-sm text-theme-orange"
                    >
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-theme-teal-dark">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Doe"
                    required
                    onChange={handleInputChange}
                    aria-describedby={
                      errors.lastName ? "lastName-error" : undefined
                    }
                    aria-invalid={!!errors.lastName}
                    className="border-theme-teal/30 text-theme-teal-dark placeholder-theme-teal-dark/50"
                  />
                  {errors.lastName && (
                    <p
                      id="lastName-error"
                      className="text-sm text-theme-orange"
                    >
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-theme-teal-dark">
                  Email Address
                </Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="you@example.com"
                  required
                  onChange={handleInputChange}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  aria-invalid={!!errors.email}
                  className="border-theme-teal/30 text-theme-teal-dark placeholder-theme-teal-dark/50"
                />
                {errors.email && (
                  <p id="email-error" className="text-sm text-theme-orange">
                    {errors.email}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-theme-teal-dark">
                  Phone Number
                </Label>
                <Input
                  type="tel"
                  id="phoneNumber"
                  name="phone_number"
                  placeholder="+1 555 555 5555"
                  required
                  onChange={handleInputChange}
                  aria-describedby={
                    errors.phone_number ? "phone_number-error" : undefined
                  }
                  aria-invalid={!!errors.phone_number}
                  className="border-theme-teal/30 text-theme-teal-dark placeholder-theme-teal-dark/50"
                />
                {errors.phone_number && (
                  <p
                    id="phone_number-error"
                    className="text-sm text-theme-orange"
                  >
                    {errors.phone_number}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-theme-teal-dark">
                  Password
                </Label>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  onChange={handleInputChange}
                  aria-describedby={
                    errors.password ? "password-error" : undefined
                  }
                  aria-invalid={!!errors.password}
                  className="border-theme-teal/30 text-theme-teal-dark placeholder-theme-teal-dark/50"
                />
                {errors.password && (
                  <p id="password-error" className="text-sm text-theme-orange">
                    {errors.password}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="confirm-password"
                  className="text-theme-teal-dark"
                >
                  Confirm Password
                </Label>
                <Input
                  type="password"
                  id="confirm-password"
                  name="confirm-password"
                  placeholder="••••••••"
                  required
                  onChange={handleInputChange}
                  aria-describedby={
                    errors["confirm-password"]
                      ? "confirm-password-error"
                      : undefined
                  }
                  aria-invalid={!!errors["confirm-password"]}
                  className="border-theme-teal/30 text-theme-teal-dark placeholder-theme-teal-dark/50"
                />
                {errors["confirm-password"] && (
                  <p
                    id="confirm-password-error"
                    className="text-sm text-theme-orange"
                  >
                    {errors["confirm-password"]}
                  </p>
                )}
              </div>
              <Button
                className="w-full bg-theme-orange hover:bg-theme-orange-light text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 mr-3"
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
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <p className="text-center text-sm text-theme-teal-dark w-full">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-theme-orange hover:text-theme-orange-light transition-colors duration-300"
              >
                Login here
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
