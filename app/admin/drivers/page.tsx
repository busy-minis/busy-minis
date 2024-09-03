import React from "react";
import DriversPage from "./DriverCard";
import { getDrivers } from "@/utils/supabase/supabaseQueries";
import { revalidatePath } from "next/cache";

export default async function page() {
  revalidatePath("/admin/verify-users");

  const drivers = await getDrivers();
  console.log(drivers);

  if (!drivers) {
    return <div>No Drivers Found</div>;
  }

  return <div>{drivers && <DriversPage drivers={drivers} />}</div>;
}
