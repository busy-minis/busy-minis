"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { login } from "./actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

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

    if (!email) {
      newErrors.email = "Email is required.";
    }

    if (!password) {
      newErrors.password = "Password is required.";
    }

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
    <div className="min-h-screen flex flex-col md:flex-row bg-white ">
      <div className="flex w-full md:w-1/2 flex-col justify-center p-8 md:p-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mx-auto"
        >
          <Card className="bg-white border  ">
            <CardHeader className="space-y-1">
              <div className="flex justify-center mb-6">
                <Link href="/">
                  <Image
                    src="/logo-large.png"
                    alt="Company Logo"
                    width={240}
                    height={180}
                    className="object-contain"
                  />
                </Link>
              </div>
              <CardTitle className="text-2xl font-bold text-center text-theme-teal-dark">
                Welcome back
              </CardTitle>
            </CardHeader>
            <CardContent>
              {errors.general && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.general}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-theme-teal-dark">
                    Email
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="you@example.com"
                    required
                    className="border-theme-teal/30 text-theme-teal-dark placeholder-theme-teal-dark/50"
                    onChange={() => handleInputChange("email")}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && (
                    <p id="email-error" className="text-sm text-theme-orange">
                      {errors.email}
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
                    className="border-theme-teal/30 text-theme-teal-dark placeholder-theme-teal-dark/50"
                    onChange={() => handleInputChange("password")}
                    aria-describedby={
                      errors.password ? "password-error" : undefined
                    }
                    aria-invalid={!!errors.password}
                  />
                  {errors.password && (
                    <p
                      id="password-error"
                      className="text-sm text-theme-orange"
                    >
                      {errors.password}
                    </p>
                  )}
                </div>

                <Button
                  className="w-full bg-theme-orange hover:bg-theme-orange-light text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
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
                    </div>
                  ) : (
                    "Log In"
                  )}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Link
                href="/forgot-password"
                className="text-sm text-theme-teal-dark hover:text-theme-teal transition-colors duration-300"
              >
                Forgot your password?
              </Link>
              <div className="text-center">
                <p className="text-sm text-theme-teal-dark">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/signup"
                    className="font-medium text-theme-orange hover:text-theme-orange-light transition-colors duration-300"
                  >
                    Sign up for free
                  </Link>
                </p>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>

      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-theme-orange-light via-theme-teal-dark to-theme-yellow-light text-white p-8 md:p-16 items-center justify-center">
        <div className="max-w-md text-center">
          <h3 className="text-3xl font-bold mb-4">Empowering Your Journey</h3>
          <p className="text-lg leading-relaxed mb-6">
            &quot;At the heart of every ride is a story waiting to unfold.
            We&quot;re not just connecting destinations; we&quot;re crafting
            experiences, one journey at a time. With us, every mile is a step
            towards a greener, more connected world.&quot;
          </p>
          <p className="text-sm italic">
            Join us in redefining transportation for a sustainable future.
          </p>
        </div>
      </div>
    </div>
  );
}
