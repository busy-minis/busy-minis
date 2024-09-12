import React from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

export default function Map({
  pickupLat,
  pickupLng,
  dropoffLat,
  dropoffLng,
}: any) {
  const mapContainerStyle = {
    width: "100%",
    height: "400px",
  };

  const center = {
    lat: pickupLat,
    lng: pickupLng,
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-800">Route Map</h3>
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
      >
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={14}
        >
          <Marker position={center} />
          <Marker
            position={{
              lat: dropoffLat,
              lng: dropoffLng,
            }}
          />
        </GoogleMap>
      </LoadScript>
    </div>
  );
}
