"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { XCircle } from "@phosphor-icons/react";
import { cancelRideById } from "@/utils/supabase/supabaseQueries";
import { getRideById } from "@/utils/supabase/supabaseQueries";
import Passengers from "./components/Passengers";
import Driver from "./components/Driver";
import Map from "./components/Map";
import RideInfo from "./components/RideInfo";

export default function RideTrackingPage() {
  const [rideData, setRideData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id"); // Get the ride ID from the search params

  useEffect(() => {
    if (id) {
      const fetchRideData = async () => {
        try {
          const data = await getRideById(id as string);
          setRideData(data);
          setLoading(false);
        } catch (error) {
          setError("Failed to load ride data.");
          setLoading(false);
        }
      };
      fetchRideData();
    }
  }, [id]);

  const handleCancelRide = async () => {
    if (!id) {
      console.log("No Id Found Cannot cancel Id");
      return;
    }
    try {
      await cancelRideById(id);
    } catch (error) {
      console.error("Failed to cancel the ride:", error);
    }

    console.log("Ride canceled:", id);
    setIsModalOpen(false);
    router.push("/my-rides"); // Redirecting to my-rides page or wherever you want
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  if (!rideData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        No ride data found.
      </div>
    );
  }

  return (
    <section className="bg-zinc-200 min-h-screen">
      <div className="max-w-4xl mx-auto py-12 px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-teal-900 text-center mb-8">
          Ride Tracking
        </h1>

        <div className="bg-white shadow-lg rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-semibold text-teal-900 mb-4">
            Ride Details
          </h2>

          <div className="flex flex-col space-y-4">
            <RideInfo rideData={rideData} />
            <Driver rideData={rideData} />
          </div>
        </div>

        {/* Passengers Section */}
        <Passengers riders={rideData.riders} />

        {/* Google Maps Section */}
        <Map rideData={rideData} />

        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-6 bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition duration-300 inline-flex items-center"
        >
          <XCircle size={20} className="mr-2" />
          Cancel Ride
        </button>
      </div>

      {/* Cancel Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Confirm Cancellation
            </h2>
            <p className="text-gray-700 mb-6">
              Are you sure you want to cancel this ride? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition"
              >
                Close
              </button>
              <button
                onClick={handleCancelRide}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
