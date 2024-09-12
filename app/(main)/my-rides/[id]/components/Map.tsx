import React from "react";
import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api";

export default function Map({ rideData }: any) {
  const mapContainerStyle = {
    width: "100%",
    height: "400px",
  };

  const center = {
    lat: (rideData.pickupLat + rideData.dropoffLat) / 2,
    lng: (rideData.pickupLng + rideData.dropoffLng) / 2,
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-8">
      <h2 className="text-2xl font-semibold text-teal-900 mb-4">Ride Map</h2>
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}
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
  );
}
