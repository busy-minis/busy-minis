import Link from "next/link";
import React from "react";

export default function Redirect() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center  p-4">
      <h1 className="text-4xl font-bold text-red-500 mb-4">403 - Forbidden</h1>
      <p className="text-lg text-center text-black mb-4">
        You do not have permissions to view this page.
      </p>
      <Link href="/">
        <p className="px-4 py-2 bg-theme-orange text-white rounded hover:bg-theme-teal transition-colors">
          Go Back Home
        </p>
      </Link>
    </div>
  );
}
