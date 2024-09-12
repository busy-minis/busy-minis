import Link from "next/link";

// pages/access-expired.tsx
export default function AccessExpired() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold mb-4">Access Expired</h1>
        <p className="text-gray-600">
          Your access link has expired. Please contact support or request a new
          link.
        </p>
        <Link
          href="/"
          className="mt-4 inline-block px-6 py-3 bg-teal-600 text-white rounded-lg"
        >
          Go back to Home
        </Link>
      </div>
    </div>
  );
}
