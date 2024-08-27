"use client";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const rideId = searchParams.get("rideId");

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
        <h1 className="text-3xl font-semibold text-green-600 mb-4">Success!</h1>
        <p className="text-lg text-gray-700 mb-6">
          Your ride has been scheduled successfully.
        </p>

        {rideId && (
          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-2">Your Ride ID:</p>
            <p className="text-xl font-bold text-gray-800 mb-4">{rideId}</p>
            <Link href={`/dashboard/rides/${rideId}`}>
              <Button className="w-full bg-theme-orange hover:bg-theme-orange-dark text-white">
                View Ride Details
              </Button>
            </Link>
          </div>
        )}

        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Your Next Steps
          </h2>
          <ul className="list-disc list-inside text-left text-gray-600 space-y-2">
            <li>Wait for driver confirmation.</li>
            <li>Prepare for your ride.</li>
            <li>Enjoy your journey with us!</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
