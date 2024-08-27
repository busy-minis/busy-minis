"use client";
import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  DirectionsService,
  DirectionsRenderer,
} from "@react-google-maps/api";

export default function Map() {
  const [directionsResponse, setDirectionsResponse] =
    useState<google.maps.DirectionsResult | null>(null);
  const [eta, setEta] = useState<string | null>(null);
  const [driverPosition, setDriverPosition] = useState({
    lat: 33.958,
    lng: -83.992,
  });

  const pickupLocation = {
    lat: 33.958,
    lng: -83.992,
  };

  const dropoffLocation = {
    lat: 33.953,
    lng: -83.982,
  };

  const center = {
    lat: 33.9562,
    lng: -83.9879,
  };

  const mapOptions = {
    styles: [
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }],
      },
      {
        featureType: "transit",
        elementType: "labels",
        stylers: [{ visibility: "off" }],
      },
      {
        featureType: "road",
        elementType: "labels.icon",
        stylers: [{ visibility: "off" }],
      },
      {
        featureType: "administrative",
        elementType: "labels",
        stylers: [{ visibility: "off" }],
      },
      {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ lightness: 100 }],
      },
      {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ color: "#808080" }],
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#c9c9c9" }],
      },
      {
        featureType: "landscape",
        elementType: "geometry",
        stylers: [{ color: "#efefef" }],
      },
    ],
    disableDefaultUI: true,
  };

  const driverIcon = {
    path: "M12 2C8.68629 2 6 4.68629 6 8C6 11.3137 8.68629 14 12 14C15.3137 14 18 11.3137 18 8C18 4.68629 15.3137 2 12 2ZM12 18C7.58172 18 4 20.6863 4 24V26H20V24C20 20.6863 16.4183 18 12 18Z",
    fillColor: "#FF5722",
    fillOpacity: 1,
    strokeWeight: 2,
    scale: 1.5,
  };

  const pickupIcon = {
    path: "M12 2C8.68629 2 6 4.68629 6 8C6 11.3137 8.68629 14 12 14C15.3137 14 18 11.3137 18 8C18 4.68629 15.3137 2 12 2ZM12 18C7.58172 18 4 20.6863 4 24V26H20V24C20 20.6863 16.4183 18 12 18Z",
    fillColor: "#4CAF50",
    fillOpacity: 1,
    strokeWeight: 2,
    scale: 1.5,
  };

  const dropoffIcon = {
    path: "M12 2C8.68629 2 6 4.68629 6 8C6 11.3137 8.68629 14 12 14C15.3137 14 18 11.3137 18 8C18 4.68629 15.3137 2 12 2ZM12 18C7.58172 18 4 20.6863 4 24V26H20V24C20 20.6863 16.4183 18 12 18Z",
    fillColor: "#F44336",
    fillOpacity: 1,
    strokeWeight: 2,
    scale: 1.5,
  };

  const calculateRoute = () => {
    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin: pickupLocation,
        destination: dropoffLocation,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          setDirectionsResponse(result);
          if (
            result.routes &&
            result.routes[0].legs &&
            result.routes[0].legs[0]
          ) {
            const duration = result.routes[0].legs[0].duration?.text;
            setEta(duration || "N/A");
          }
        } else {
          console.error(`Error fetching directions ${result}`);
        }
      }
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setDriverPosition((prevPosition) => {
        return {
          lat: prevPosition.lat - 0.0001,
          lng: prevPosition.lng + 0.0001,
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {eta && (
        <div className="bg-green-100 mb-4 text-green-800 text-sm font-semibold px-3 py-1 rounded-full">
          Estimated Time of Arrival: {eta}
        </div>
      )}
      <LoadScript
        googleMapsApiKey={"AIzaSyCUa2HZ94Us1drPt-7bdpWaEB-Eaa4lzlg"}
        onLoad={calculateRoute} // Ensure this runs after the API is loaded
      >
        <GoogleMap
          mapContainerStyle={{ height: "400px", width: "100%" }}
          zoom={14}
          center={center}
          options={mapOptions}
        >
          {directionsResponse && (
            <DirectionsRenderer
              directions={directionsResponse}
              options={{
                suppressMarkers: true,
                polylineOptions: {
                  strokeColor: "#000000",
                  strokeOpacity: 1,
                  strokeWeight: 4,
                },
              }}
            />
          )}
          <Marker position={driverPosition} icon={driverIcon} title="Driver" />
          <Marker position={pickupLocation} icon={pickupIcon} title="Pickup" />
          <Marker
            position={dropoffLocation}
            icon={dropoffIcon}
            title="Drop-off"
          />
        </GoogleMap>
      </LoadScript>
    </div>
  );
}
