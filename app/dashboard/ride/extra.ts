import { getDriverLocation } from "@/utils/supabase/supabaseQueries";
import React, { useEffect, useState } from "react";

// const rideId = "a45c8544-7587-42e1-9249-9e2a2de98164";
// const [driverLocation, setDriverLocation] = useState<{
//   latitude: number;
//   longitude: number;
// } | null>(null);

// const parseGeographyPoint = (geoPoint: string) => {
//   const match = geoPoint.match(/\(([^)]+)\)/);
//   if (!match) {
//     console.error("Invalid geography point format:", geoPoint);
//     return null;
//   }

//   const [longitude, latitude] = match[1].split(" ").map(Number);
//   console.log("Parsed location:", { latitude, longitude });
//   return { latitude, longitude };
// };

// useEffect(() => {
//   async function fetchLocation() {
//     try {
//       const geoPoint = await getDriverLocation(rideId);
//       console.log("Fetched location from Supabase:", geoPoint);
//       const location = parseGeographyPoint(geoPoint);
//       setDriverLocation(location);
//     } catch (error) {
//       console.error("Error fetching driver location:", error);
//     }
//   }

//   fetchLocation();
// }, [rideId]);

// if (!driverLocation) return <div>Loading...</div>;

// const center = {
//   lat: driverLocation.latitude,
//   lng: driverLocation.longitude,
// };
