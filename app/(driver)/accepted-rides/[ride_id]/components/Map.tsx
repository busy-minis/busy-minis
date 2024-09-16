import React, { useEffect, useState, useRef } from "react";
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  useLoadScript,
  Libraries,
} from "@react-google-maps/api";

const libraries: Libraries = ["places"];

interface MapProps {
  dropoffLat: number;
  dropoffLng: number;
  driverLat: number | null; // Allow for null values
  driverLng: number | null;
  driverHeading: number;
}

export default function Map({
  dropoffLat,
  dropoffLng,
  driverLat,
  driverLng,
  driverHeading,
}: MapProps) {
  const mapContainerStyle = {
    width: "100%",
    height: "100vh",
  };

  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);
  const [currentStep, setCurrentStep] = useState<string | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  // Load the Google Maps API
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries,
  });

  // Get directions from driver to dropoff location
  useEffect(() => {
    if (
      isLoaded &&
      driverLat != null &&
      driverLng != null &&
      dropoffLat != null &&
      dropoffLng != null
    ) {
      const directionsService = new google.maps.DirectionsService();
      directionsService.route(
        {
          origin: { lat: driverLat, lng: driverLng },
          destination: { lat: dropoffLat, lng: dropoffLng },
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK && result) {
            setDirections(result);
            if (result.routes[0]?.legs[0]?.steps.length > 0) {
              setCurrentStep(result.routes[0].legs[0].steps[0].instructions);
            }
          } else {
            console.error(`Error fetching directions: ${status}`);
          }
        }
      );
    }
  }, [isLoaded, driverLat, driverLng, dropoffLat, dropoffLng]);

  // Center the map on the driver’s position as they move and rotate it based on heading
  useEffect(() => {
    if (
      mapRef.current &&
      driverLat != null &&
      driverLng != null &&
      driverHeading != null
    ) {
      const driverPosition = { lat: driverLat, lng: driverLng };

      // Pan the map to the driver's current position
      mapRef.current.panTo(driverPosition);

      // Rotate the map based on driver's heading
      mapRef.current.setHeading(driverHeading);
    }
  }, [driverLat, driverLng, driverHeading]);

  if (!isLoaded || driverLat == null || driverLng == null) {
    return <div>Loading Map...</div>;
  }

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={{ lat: driverLat, lng: driverLng }}
        zoom={16}
        tilt={45}
        options={{
          zoomControl: false,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
        onLoad={(map) => {
          mapRef.current = map;
        }}
      >
        {/* Directions Renderer */}
        {directions && <DirectionsRenderer directions={directions} />}

        {/* Driver's Marker with Rotation */}
        {driverLat != null && driverLng != null && (
          <Marker
            position={{ lat: driverLat, lng: driverLng }}
            icon={{
              path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
              scale: 5,
              rotation: driverHeading || 0,
              fillColor: "blue",
              fillOpacity: 1,
              strokeWeight: 1,
            }}
          />
        )}
      </GoogleMap>

      {/* Current step for turn-by-turn instructions */}
      <div className="mt-4">
        <h4>Next Turn:</h4>
        <p
          dangerouslySetInnerHTML={{ __html: currentStep || "No next turn." }}
        />
      </div>
    </div>
  );
}
