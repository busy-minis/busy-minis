"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MapPin, Car, User, XCircle } from "@phosphor-icons/react";
import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api";
import Footer from "@/app/components/ui/Footer";
import { getRideById } from "@/utils/supabase/supabaseQueries";

// Utility function to format date and time
const formatDateTime = (date: string, time: string) => {
  const dateTime = new Date(`${date}T${time}`);
  return dateTime.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

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
    // Add your logic to cancel the ride here (e.g., update the database)
    console.log("Ride canceled:", id);
    setIsModalOpen(false);
    // Redirect or show a message after cancellation
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

  const mapContainerStyle = {
    width: "100%",
    height: "400px",
  };

  const center = {
    lat: (rideData.pickupLat + rideData.dropoffLat) / 2,
    lng: (rideData.pickupLng + rideData.dropoffLng) / 2,
  };

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
            <div className="flex items-center space-x-4">
              <MapPin size={24} className="text-teal-600" />
              <div>
                <p className="text-gray-700">Pickup:</p>
                <p className="text-lg font-semibold text-gray-900">
                  {rideData.pickupAddress}
                </p>
                <p className="text-gray-600">
                  Pickup Time:{" "}
                  {formatDateTime(rideData.pickupDate, rideData.pickupTime)}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <MapPin size={24} className="text-teal-600" />
              <div>
                <p className="text-gray-700">Dropoff:</p>
                <p className="text-lg font-semibold text-gray-900">
                  {rideData.dropoffAddress}
                </p>
                <p className="text-gray-600">
                  Estimated Dropoff Time: {rideData.dropoffTime}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Car size={24} className="text-teal-600" />
              <div>
                <p className="text-gray-700">Driver:</p>
                {rideData.driverName ? (
                  <>
                    <p className="text-lg font-semibold text-gray-900">
                      {rideData.driverName}
                    </p>
                    <p className="text-gray-600">
                      Vehicle: {rideData.driverVehicle || "Not Available"}
                    </p>
                  </>
                ) : (
                  <p className="text-gray-900">
                    Driver not yet available. Please wait until a driver has
                    accepted the ride.
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-6 bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition duration-300 inline-flex items-center"
            >
              <XCircle size={20} className="mr-2" />
              Cancel Ride
            </button>
          </div>
        </div>

        {/* Passengers Section */}
        <div className="bg-white shadow-lg rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-semibold text-teal-900 mb-4">
            Passengers
          </h2>
          <div className="space-y-4">
            {rideData.riders && rideData.riders.length > 0 ? (
              rideData.riders.map((passenger: any, index: number) => (
                <div key={index} className="flex items-center space-x-4">
                  <User size={24} className="text-teal-600" />
                  <div>
                    <p className="text-lg font-semibold text-gray-900">
                      {passenger.name}
                    </p>
                    <p className="text-gray-600">Age: {passenger.age}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-700">No passengers available.</p>
            )}
          </div>
        </div>

        {/* Google Maps Section */}
        <div className="bg-white shadow-lg rounded-xl p-8">
          <h2 className="text-2xl font-semibold text-teal-900 mb-4">
            Ride Map
          </h2>
          <LoadScript
            googleMapsApiKey={
              process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string
            }
          >
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={center}
              zoom={12}
            >
              <Marker
                position={{ lat: rideData.pickupLat, lng: rideData.pickupLng }}
                label="Pickup"
                icon="http://maps.google.com/mapfiles/ms/icons/green-dot.png"
              />
              <Marker
                position={{
                  lat: rideData.dropoffLat,
                  lng: rideData.dropoffLng,
                }}
                label="Dropoff"
                icon="http://maps.google.com/mapfiles/ms/icons/red-dot.png"
              />
            </GoogleMap>
          </LoadScript>
        </div>
      </div>

      <Footer />

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
