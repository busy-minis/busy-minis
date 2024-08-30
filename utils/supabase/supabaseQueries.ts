import { createClient } from "@supabase/supabase-js";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl as string, supabaseKey as string);

export const getTimeBlocks = async () => {
  try {
    let { data: drivers, error } = await supabase
      .from("time_blocks")
      .select("*");

    if (error) {
      throw error;
    }
    return drivers;
    //Return all Time Slots
  } catch (error) {
    // Handle error
    console.error("Error Getting Drivers :", error);
    throw error;
  }
};
export const createRide = async (rideData: {
  user_id: string;
  pickupDate: string;
  pickupTime: string;
  pickupAddress: string;
  pickupLat?: number;
  pickupLng?: number;
  dropoffAddress: string;
  dropoffLat?: number;
  dropoffLng?: number;
  riders: { name: string; age: string }[];
  status: string;
}) => {
  try {
    const { data, error } = await supabase.from("rides").insert([rideData]);

    if (error) {
      throw error;
    }
    return data; // Return the inserted ride data
  } catch (error) {
    console.error("Error creating ride:", error);
    throw error;
  }
};
export const makeTimeBlock = async () => {
  try {
    let { data: drivers, error } = await supabase
      .from("time_blocks")
      .insert("*");

    if (error) {
      throw error;
    }
    return drivers;
    //Return all Time Slots
  } catch (error) {
    // Handle error
    console.error("Error Getting Drivers :", error);
    throw error;
  }
};
export const cancelRideById = async (rideId: string) => {
  try {
    const { data, error } = await supabase
      .from("rides") // accessing the rides table
      .update({ status: "canceled" }) // updating the status to canceled
      .eq("id", rideId); // filtering by ride ID

    if (error) {
      throw error;
    }

    return data; // Return the canceled ride data
  } catch (error) {
    console.error("Error canceling ride:", error);
    throw error;
  }
};
export const getRidesByStatus = async (status: string) => {
  try {
    const { data, error } = await supabase
      .from("rides") // querying from rides table
      .select("*")
      .eq("status", status); // filter by 'pending', 'accepted', or 'ongoing' statuses

    if (error) {
      throw error;
    }

    return data; // Return the rides with the specified statuses
  } catch (error) {
    console.error("Error fetching rides:", error);
    throw error;
  }
};

export const getRidesForUser = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("rides") // querying from rides table
      .select("*")
      .in("status", ["pending", "accepted", "ongoing"]) // filter by 'pending', 'accepted', or 'ongoing' statuses
      .eq("user_id", userId); // filter by user ID

    if (error) {
      throw error;
    }

    return data; // Return the rides with the specified statuses
  } catch (error) {
    console.error("Error fetching rides:", error);
    throw error;
  }
};

export const getCompletedOrCanceledRides = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("rides") // querying from rides table
      .select("*")
      .in("status", ["completed", "canceled"]) // filter by status 'completed' or 'canceled'
      .eq("user_id", userId); // filter by user ID

    if (error) {
      throw error;
    }

    return data; // Return the completed or canceled rides
  } catch (error) {
    console.error("Error fetching completed or canceled rides:", error);
    throw error;
  }
};
export const acceptRide = async (rideId: string, userId: string) => {
  try {
    // Update the ride with the current user's ID and change status to accepted
    const { data, error } = await supabase
      .from("rides")
      .update({
        driver_id: userId,
        status: "accepted",
      })
      .eq("id", rideId);

    if (error) {
      throw error;
    }

    return data; // Return the updated ride data
  } catch (error) {
    console.error("Error accepting the ride:", error);
    throw error;
  }
};
export const startRide = async (rideId: string) => {
  try {
    const { data, error } = await supabase
      .from("rides")
      .update({ status: "ongoing" }) // Update the status to "ongoing"
      .eq("id", rideId);

    if (error) {
      throw error;
    }

    return data; // Return the updated ride data
  } catch (error) {
    console.error("Error starting the ride:", error);
    throw error;
  }
};

export const updateDriverLocation = async (
  rideId: string,
  location: { lat: number; lng: number }
) => {
  try {
    const { data, error } = await supabase
      .from("ride_location")
      .upsert(
        {
          ride_id: rideId,
          driver_lat: location.lat,
          driver_lng: location.lng,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "ride_id" }
      ) // onConflict should be a string, specifying the column name
      .eq("ride_id", rideId);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error updating driver location:", error);
    throw error;
  }
};
export const endRide = async (rideId: string) => {
  try {
    const { data, error } = await supabase
      .from("rides")
      .update({ status: "completed" }) // Update the status to "completed"
      .eq("id", rideId);

    if (error) {
      throw error;
    }

    return data; // Return the updated ride data
  } catch (error) {
    console.error("Error ending the ride:", error);
    throw error;
  }
};
export const getRideById = async (rideId: string) => {
  try {
    const { data, error } = await supabase
      .from("rides")
      .select("*")
      .eq("id", rideId)
      .single(); // Ensure we only get one ride

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error fetching ride by ID:", error);
    throw error;
  }
};

export const getAcceptedRidesByDriver = async (driverId: string) => {
  try {
    // Query to get all rides with the specified driver_id and status either 'accepted' or 'ongoing'
    const { data, error } = await supabase
      .from("rides")
      .select("*")
      .eq("driver_id", driverId)
      .in("status", ["accepted", "ongoing"]); // Use 'in' to filter by multiple statuses

    if (error) {
      throw error;
    }

    return data; // Return the filtered rides
  } catch (error) {
    console.error(
      "Error fetching accepted or ongoing rides for driver:",
      error
    );
    throw error;
  }
};

export const getDrivers = async () => {
  try {
    let { data: drivers, error } = await supabase.from("drivers").select("*");

    if (error) {
      throw error;
    }
    return drivers;
    //Return all drivers
  } catch (error) {
    // Handle error
    console.error("Error Getting Drivers :", error);
    throw error;
  }
};
export const getUnverifiedUsers = async () => {
  try {
    const { data: users, error } = await supabase
      .from("users") // Replace with your actual table name
      .select("*")
      .eq("verified", false);

    if (error) {
      throw error;
    }

    return users; // Return the unverified users
  } catch (error) {
    console.error("Error Getting Unverified Users:", error);
    throw error;
  }
};

export const createNewDriver = async (driverData: {
  first_name: string;
  last_name: string;
  email: string;
  license_plate: string;
  vehicle_brand: string;
  is_active: boolean;
  current_location: string | null;
  photo_url?: string; // This is optional if no photo is provided
}) => {
  try {
    const { data, error } = await supabase.from("drivers").insert([
      {
        first_name: driverData.first_name,
        last_name: driverData.last_name,
        email: driverData.email,
        license_plate: driverData.license_plate,
        vehicle_brand: driverData.vehicle_brand,
        is_active: driverData.is_active || false, // Defaults to false if not provided
        current_location: driverData.current_location || null,
        photo_url: driverData.photo_url || null, // Defaults to null if not provided
      },
    ]);

    if (error) {
      throw error;
    }

    return data; // Return the created driver data
  } catch (error) {
    console.error("Error Creating Driver:", error);
    throw error;
  }
};

export const deleteDriver = async (driverId: number) => {
  try {
    const { data, error } = await supabase
      .from("drivers")
      .delete()
      .eq("id", driverId);

    if (error) {
      throw error;
    }

    return data; // Return the deleted driver data
  } catch (error) {
    console.error("Error Deleting Driver:", error);
    throw error;
  }
};

export const updateDriver = async (
  driverId: number,
  updateData: {
    first_name?: string;
    last_name?: string;
    license_plate?: string;
  }
) => {
  try {
    const { data, error } = await supabase
      .from("drivers")
      .update({
        first_name: updateData.first_name,
        last_name: updateData.last_name,
        license_plate: updateData.license_plate,
      })
      .eq("id", driverId);

    if (error) {
      throw error;
    }

    return data; // Return the updated driver data
  } catch (error) {
    console.error("Error Updating Driver:", error);
    throw error;
  }
};

export const getDriverLocation = async (rideId: string) => {
  const { data, error } = await supabase
    .from("rides")
    .select("driver_location")
    .eq("id", rideId)
    .single();

  if (error) {
    console.error("Error fetching driver location:", error);
    throw error;
  }

  return data?.driver_location; // Return the driver's location
};

interface Ride {
  id: string; // assuming 'id' is a string
  // other properties can be added here
}

export const addChild = async (childData: {
  user_id: string;
  first_name: string;
  last_name: string;
  birthdate: string;
}) => {
  try {
    const { data, error } = await supabase.from("children").insert([
      {
        user_id: childData.user_id,
        first_name: childData.first_name,
        last_name: childData.last_name,
        birthdate: childData.birthdate,
      },
    ]);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error adding child:", error);
    throw error;
  }
};

export const deleteChild = async (childId: number) => {
  try {
    const { data, error } = await supabase
      .from("children")
      .delete()
      .eq("id", childId);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error deleting child:", error);
    throw error;
  }
};

export const getChildren = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("children")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error fetching children:", error);
    throw error;
  }
};

export const fetchTimeBlocks = async () => {
  const { data, error } = await supabase
    .from("time_blocks")
    .select("*")
    .order("date")
    .order("start_time");
  if (error) {
    console.error("Error fetching time blocks:", error);
    throw error;
  }
  return data;
};

// Example Supabase function
export async function createTimeBlock({
  date,
  startTime,
  endTime,
}: {
  date: string;
  startTime: string;
  endTime: string;
}) {
  // Supabase query to create a time block using the provided date, start time, and end time
  const { data, error } = await supabase
    .from("time_blocks")
    .insert([{ date, start_time: startTime, end_time: endTime }]);

  if (error) {
    console.error("Error creating time block:", error.message);
    return null;
  }

  return data?.[0]; // Assuming the response contains the newly created block
}

export const deleteTimeBlock = async (id: number) => {
  const { data, error } = await supabase
    .from("time_blocks")
    .delete()
    .eq("id", id);
  if (error) {
    console.error("Error deleting time block:", error);
    throw error;
  }
  return data;
};
