"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    initGoogleMaps: () => void;
  }
}

const LoadGoogleMapsScript = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window.google !== "undefined") {
      setIsLoaded(true);
      return;
    }

    window.initGoogleMaps = () => {
      setIsLoaded(true);
    };

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&callback=initGoogleMaps`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return isLoaded;
};

export default LoadGoogleMapsScript;
