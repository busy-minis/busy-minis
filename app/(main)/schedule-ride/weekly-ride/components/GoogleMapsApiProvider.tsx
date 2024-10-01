"use client";

import React, { useState, useEffect } from "react";
import { useLoadScript } from "@react-google-maps/api";

interface GoogleMapsApiProviderProps {
  children: React.ReactNode;
}

export const GoogleMapsApiProvider: React.FC<GoogleMapsApiProviderProps> = ({
  children,
}) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ["places"],
  });

  if (loadError) {
    return <div>Error loading Google Maps API</div>;
  }

  if (!isLoaded) {
    return <div>Loading Google Maps API...</div>;
  }

  return <>{children}</>;
};
