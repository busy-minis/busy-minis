import React from "react";
import AvailableRidesFeed from "./AvailableRidesFeed";
import { getRides } from "@/utils/supabase/supabaseQueries";

const DriverDashboard = async () => {
  const rides = await getRides();
  return <AvailableRidesFeed rides={rides} />;
};

export default DriverDashboard;
