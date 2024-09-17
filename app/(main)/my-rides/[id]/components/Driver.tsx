import { Car } from "@phosphor-icons/react";
import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client"; // Update this path if necessary

export default function Driver({ rideData }: any) {
  const [driverData, setDriverData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDriverData = async () => {
      if (rideData?.status === "accepted" && rideData?.driver_id) {
        const supabase = createClient();
        try {
          const { data, error } = await supabase
            .from("drivers")
            .select(
              "first_name, last_name, vehicle_brand, vehicle_color, vehicle_year, photo_url"
            )
            .eq("id", rideData.driver_id)
            .single();

          if (error) {
            setError("Failed to fetch driver information.");
            console.error(error);
          } else {
            setDriverData(data);
          }
        } catch (err) {
          setError("An error occurred while fetching driver data.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchDriverData();
  }, [rideData?.status, rideData?.driver_id]);

  const renderDriverInfo = () => {
    if (loading) {
      return <p className="text-gray-500">Loading driver information...</p>;
    }

    if (error) {
      return <p className="text-red-500">{error}</p>;
    }

    if (driverData) {
      const {
        first_name,
        last_name,
        vehicle_brand,
        vehicle_color,
        vehicle_year,
        photo_url,
      } = driverData;
      return (
        <div className="flex items-start space-x-4">
          {photo_url ? (
            <img
              src={photo_url}
              alt={`${first_name} ${last_name}`}
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <Car size={24} className="text-teal-600" />
            </div>
          )}
          <div>
            <p className="text-lg font-semibold text-gray-900">
              {first_name} {last_name}
            </p>
            <p className="text-gray-600">
              Vehicle: {vehicle_brand || "Not Available"}{" "}
              {vehicle_year ? `(${vehicle_year})` : ""} -{" "}
              {vehicle_color || "Unknown Color"}
            </p>
            <p className="text-green-600">Ride has been accepted.</p>
          </div>
        </div>
      );
    }

    return <p className="text-gray-900">Driver information not available.</p>;
  };

  return (
    <div className="flex items-start space-x-4">
      <Car size={24} className="text-teal-600" />
      <div>
        <p className="text-gray-700">Driver:</p>
        {rideData?.status === "pending" ? (
          <p className="text-gray-900">
            Driver not available. Please wait until a driver has accepted the
            ride.
          </p>
        ) : (
          renderDriverInfo()
        )}
      </div>
    </div>
  );
}
