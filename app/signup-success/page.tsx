import Link from "next/link";
import React from "react";

export default function SignupSuccess() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-white px-6 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">Account Created!</h1>
        <p className="mt-4 text-lg text-gray-600">
          Your account has been successfully created. You can now log in and
          start using our services.
        </p>

        <Link
          href="/login"
          className="mt-8 inline-flex items-center px-6 py-3 bg-orange-600 text-white rounded-full shadow-lg hover:bg-orange-700 transition-colors duration-300"
        >
          Log In Now
        </Link>
      </div>
    </section>
  );
}
