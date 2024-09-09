"use client";
import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { createClient } from "@/utils/supabase/client";
import { updateDriverLocation } from "@/utils/supabase/supabaseQueries";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = {
  lat: 0,
  lng: 0,
};

export default function ShareLocationMap({ rideId }: { rideId: string }) {
  const supabase = createClient();
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [sharing, setSharing] = useState(false);
  const [mapCenter, setMapCenter] = useState(defaultCenter);

  useEffect(() => {
    if (sharing) {
      const locationWatcher = navigator.geolocation.watchPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const newLocation = { lat: latitude, lng: longitude };
          setLocation(newLocation);
          setMapCenter(newLocation);
          try {
            await updateDriverLocation(rideId, newLocation); // Send location to Supabase
          } catch (error) {
            console.error("Failed to update location:", error);
          }
        },
        (error) => {
          console.error("Error watching position:", error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );

      return () => {
        navigator.geolocation.clearWatch(locationWatcher);
      };
    }
  }, [sharing, rideId]);

  useEffect(() => {
    const channel = supabase
      .channel("ride_location_updates")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "ride_location",
          filter: `ride_id=eq.${rideId}`,
        },
        (payload) => {
          const updatedLocation = {
            lat: payload.new.driver_lat,
            lng: payload.new.driver_lng,
          };
          setLocation(updatedLocation);
          setMapCenter(updatedLocation);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [rideId, supabase]);

  const toggleSharing = () => {
    setSharing(!sharing);
  };

  return (
    <div className="relative">
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
      >
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={mapCenter}
          zoom={14}
        >
          {location && <Marker position={location} />}
        </GoogleMap>
      </LoadScript>
      <button
        onClick={toggleSharing}
        className={`absolute bottom-4 right-4 bg-${
          sharing ? "red" : "green"
        }-600 text-white py-2 px-4 rounded-lg hover:bg-${
          sharing ? "red" : "green"
        }-700 transition-colors duration-200`}
      >
        {sharing ? "Stop Sharing Location" : "Start Sharing Location"}
      </button>
    </div>
  );
}
