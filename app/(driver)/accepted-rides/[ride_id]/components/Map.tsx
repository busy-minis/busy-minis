"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
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
  isPickupComplete: boolean;
  onArrival: () => void;
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
  isPickupComplete,
  onArrival,
}) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
  });

  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);
  const [nextInstruction, setNextInstruction] = useState<string>("");
  const [estimatedTime, setEstimatedTime] = useState<string>("");
  const [remainingDistance, setRemainingDistance] = useState<string>("");

  const mapRef = useRef<google.maps.Map | null>(null);
  const previousDestinationRef = useRef<string>("");

  // Ref and state for throttling panTo
  const isPanningRef = useRef<boolean>(false);
  const panDelay = 1000; // 1 second delay

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const directionsCallback = useCallback(
    (
      result: google.maps.DirectionsResult | null,
      status: google.maps.DirectionsStatus
    ) => {
      if (status === google.maps.DirectionsStatus.OK && result) {
        setDirections(result);
        updateNavigationInfo(result);
      } else {
        console.error("Directions request failed due to " + status);
      }
    },
    []
  );

  const updateNavigationInfo = (result: google.maps.DirectionsResult) => {
    if (result.routes[0] && result.routes[0].legs[0]) {
      const leg = result.routes[0].legs[0];
      const nextStep = leg.steps[0];
      setNextInstruction(nextStep.instructions);
      setEstimatedTime(leg.duration?.text || "");
      setRemainingDistance(leg.distance?.text || "");

      // Text-to-speech for the next instruction
      const utterance = new SpeechSynthesisUtterance(nextStep.instructions);
      window.speechSynthesis.speak(utterance);

      // Check for arrival
      if (leg.distance?.value && leg.distance.value < 50) {
        // Within 50 meters
        onArrival();
      }
    }
  };

  // Custom throttle function using refs and setTimeout
  const throttlePan = useCallback((lat: number, lng: number) => {
    if (isPanningRef.current) {
      return;
    }

    isPanningRef.current = true;

    if (mapRef.current) {
      mapRef.current.panTo({ lat, lng });
    }

    setTimeout(() => {
      isPanningRef.current = false;
    }, panDelay);
  }, []);

  useEffect(() => {
    if (isLoaded && driverLat && driverLng) {
      const destination = isPickupComplete
        ? `${dropoffLat},${dropoffLng}`
        : `${pickupLat},${pickupLng}`;

      // Request directions only if destination has changed
      if (previousDestinationRef.current !== destination) {
        const directionsService = new google.maps.DirectionsService();
        directionsService.route(
          {
            origin: { lat: driverLat, lng: driverLng },
            destination: isPickupComplete
              ? { lat: dropoffLat, lng: dropoffLng }
              : { lat: pickupLat, lng: pickupLng },
            travelMode: google.maps.TravelMode.DRIVING,
          },
          directionsCallback
        );

        previousDestinationRef.current = destination;
      }

      // Throttled panning to the driver's new location
      throttlePan(driverLat, driverLng);
    }
  }, [
    isLoaded,
    driverLat,
    driverLng,
    pickupLat,
    pickupLng,
    dropoffLat,
    dropoffLng,
    isPickupComplete,
    directionsCallback,
    throttlePan,
  ]);

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  return isLoaded ? (
    <div>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={{ lat: driverLat || pickupLat, lng: driverLng || pickupLng }}
        zoom={14}
        onLoad={onLoad}
        options={{
          disableDefaultUI: false,
          gestureHandling: "greedy",
        }}
      >
        <Marker
          position={{ lat: pickupLat, lng: pickupLng }}
          label="Pickup"
          icon={{
            url: "/pickup-icon.png",
            scaledSize: new google.maps.Size(30, 30),
          }}
        />
        <Marker
          position={{ lat: dropoffLat, lng: dropoffLng }}
          label="Dropoff"
          icon={{
            url: "/dropoff-icon.png",
            scaledSize: new google.maps.Size(30, 30),
          }}
        />
        {driverLat && driverLng && (
          <Marker
            position={{ lat: driverLat, lng: driverLng }}
            label="Driver"
            icon={{
              path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
              scale: 5,
              rotation: driverHeading,
            }}
          />
        )}
        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              preserveViewport: true, // Prevents automatic viewport change
              suppressMarkers: true, // Suppress default markers
            }}
          />
        )}
      </GoogleMap>
      <div className="mt-4 p-4 bg-blue-100 rounded">
        <h3 className="font-bold">Navigation Info:</h3>
        <p>{nextInstruction}</p>
        <p>Estimated Time: {estimatedTime}</p>
        <p>Remaining Distance: {remainingDistance}</p>
      </div>
    </div>
  ) : (
    <div>Loading Map...</div>
  );
};

export default React.memo(Map);
