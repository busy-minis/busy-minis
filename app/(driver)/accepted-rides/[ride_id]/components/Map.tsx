// components/Map.tsx
"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  useJsApiLoader,
} from "@react-google-maps/api";

interface MapProps {
  pickupLat: number;
  pickupLng: number;
  dropoffLat: number;
  dropoffLng: number;
  driverLat: number | null;
  driverLng: number | null;
  driverHeading: number;
}

const containerStyle = {
  width: "100%",
  height: "400px",
};

const Map: React.FC<MapProps> = ({
  pickupLat,
  pickupLng,
  dropoffLat,
  dropoffLng,
  driverLat,
  driverLng,
  driverHeading,
}) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
  });

  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);

  const center = {
    lat: driverLat || pickupLat,
    lng: driverLng || pickupLng,
  };

  const directionsCallback = useCallback(
    (
      result: google.maps.DirectionsResult | null,
      status: google.maps.DirectionsStatus
    ) => {
      if (status === google.maps.DirectionsStatus.OK && result) {
        setDirections(result);
        console.log("Directions fetched successfully"); // Debug log
      } else {
        console.error("Directions request failed due to " + status);
      }
    },
    []
  );

  useEffect(() => {
    if (isLoaded && driverLat && driverLng) {
      console.log("Requesting directions from driver to pickup"); // Debug log
      const directionsService = new google.maps.DirectionsService();
      directionsService.route(
        {
          origin: { lat: driverLat, lng: driverLng },
          destination: { lat: pickupLat, lng: pickupLng },
          travelMode: google.maps.TravelMode.DRIVING,
        },
        directionsCallback
      );
    }
  }, [
    isLoaded,
    driverLat,
    driverLng,
    pickupLat,
    pickupLng,
    directionsCallback,
  ]);

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  return isLoaded ? (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={14}>
      {/* Pickup Marker */}
      <Marker
        position={{ lat: pickupLat, lng: pickupLng }}
        label="Pickup"
        icon={{
          url: "/pickup-icon.png",
          scaledSize: new google.maps.Size(30, 30),
        }}
      />

      {/* Dropoff Marker */}
      <Marker
        position={{ lat: dropoffLat, lng: dropoffLng }}
        label="Dropoff"
        icon={{
          url: "/dropoff-icon.png",
          scaledSize: new google.maps.Size(30, 30),
        }}
      />

      {/* Driver Marker */}
      {driverLat && driverLng && (
        <Marker
          position={{ lat: driverLat, lng: driverLng }}
          label="Driver"
          icon={{
            url: "/driver-icon.png",
            scaledSize: new google.maps.Size(40, 40),
            // Note: Rotation not directly supported; consider using symbols for rotation
          }}
        />
      )}

      {/* Directions Renderer */}
      {directions && <DirectionsRenderer directions={directions} />}
    </GoogleMap>
  ) : (
    <div>Loading Map...</div>
  );
};

export default React.memo(Map);
