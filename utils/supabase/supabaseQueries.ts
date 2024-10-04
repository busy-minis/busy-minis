import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl as string, supabaseKey as string);

export async function getWeeklyRideById(id: string) {
  try {
    // Fetch the weekly ride details
    const { data: weeklyRide, error: rideError } = await supabase
      .from("weekly_rides")
      .select("*")
      .eq("id", id)
      .single();

    if (rideError) throw rideError;

    // Fetch the associated ride sessions for this weekly ride
    const { data: rideSessions, error: sessionError } = await supabase
      .from("ride_sessions")
      .select("*")
      .eq("user_id", weeklyRide.user_id)
      .eq("status", "scheduled")
      .eq("start_date", weeklyRide.start_date)
      .eq("end_date", weeklyRide.end_date);

    if (sessionError) throw sessionError;

    return { weeklyRide, rideSessions };
  } catch (error) {
    console.error("Error fetching ride data:", error);
    throw error;
  }
}
export async function updateWeeklyRide(rideId: string, canceledDay: string) {
  try {
    // Fetch the current `selectedDays` from the weekly ride
    const { data: weeklyRide, error: rideError } = await supabase
      .from("weekly_rides")
      .select("selectedDays")
      .eq("id", rideId)
      .single();

    if (rideError) throw rideError;

    // Remove the canceled day from the `selectedDays` array in JavaScript
    const updatedSelectedDays = weeklyRide.selectedDays.filter(
      (day: string) => day !== canceledDay
    );

    // Update the weekly ride with the new `selectedDays`
    const { error: updateError } = await supabase
      .from("weekly_rides")
      .update({ selectedDays: updatedSelectedDays })
      .eq("id", rideId);

    if (updateError) throw updateError;

    // Delete the ride session for the canceled day
    const { error: deleteError } = await supabase
      .from("ride_sessions")
      .delete()
      .eq("start_date", canceledDay)
      .eq("status", "scheduled")
      .eq("id", rideId);

    if (deleteError) throw deleteError;

    return {
      success: true,
      message:
        "Day successfully canceled. Note: No refunds will be processed for this day.",
    };
  } catch (error) {
    console.error("Error updating ride:", error);
    throw error;
  }
}
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
  status: string;
  driver_id?: string;
  payment_status?: string;
  total_cost?: string;
  pickupAddress: string;
  dropoffAddress: string;
  pickupLat?: number;
  pickupLng?: number;
  dropoffLat?: number;
  dropoffLng?: number;
  riders: { name: string; age: string }[];
  pickupTime: string;
  pickupDate: string;
  distance?: number;
  stops?: { address: string; lat?: number; lng?: number }[];
  ride_link?: string;
  weekly_ride_id?: string;
  weekly: boolean;
  payment_intent_id: string;
}) => {
  try {
    const { data, error } = await supabase.from("rides").insert([rideData]);

    if (error) {
      console.error("Supabase error:", error);
      throw new Error(`Failed to create ride: ${error.message}`);
    }
  } catch (error) {
    console.error("Error creating ride:", error);
    throw error;
  }
};
// Helper functions (ensure these are part of your actual codebase)

// Define the shape of formData
const daysOfWeekMap: { [key: string]: number } = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

function getNextOccurrence(dayOfWeek: number, startDate: Date): Date {
  const result = new Date(startDate);
  result.setDate(result.getDate() + ((7 + dayOfWeek - startDate.getDay()) % 7));
  if (result.toDateString() === startDate.toDateString()) {
    result.setDate(result.getDate() + 7);
  }
  return result;
}

function createRideSessions(
  formData: WeeklyFormData,
  weeklyRideId: string
): {
  rideSessions: any[];
  endDate: string;
} {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const rideDates = formData.selectedDays
    .map((day) => {
      const dayIndex = daysOfWeekMap[day];
      return getNextOccurrence(dayIndex, today);
    })
    .sort((a, b) => a.getTime() - b.getTime());

  const endDate = new Date(Math.max(...rideDates.map((d) => d.getTime())));

  const rideSessions = rideDates.map((date) => ({
    pickupLat: formData.pickupLat,
    pickupLng: formData.pickupLng,
    dropoffLat: formData.dropoffLat,
    dropoffLng: formData.dropoffLng,
    weekly_ride_id: weeklyRideId,
    user_id: formData.user_id,
    payment_status: "paid",
    distance: formData.distance, // Ensure this is correctly passed from formData
    pickupDate: date.toISOString().split("T")[0],
    pickupTime: formData.selectedTime,
    pickupAddress: formData.pickupAddress,
    dropoffAddress: formData.dropoffAddress,
    riders: formData.riders,
    status: "pending",
    weekly: true,
  }));

  return {
    rideSessions,
    endDate: endDate.toISOString().split("T")[0],
  };
}

export async function createWeeklyRide({
  formData,
}: {
  formData: WeeklyFormData;
}) {
  try {
    // Insert the weekly ride
    const { data: weeklyRideData, error: weeklyRideError } = await supabase
      .from("weekly_rides")
      .insert({
        start_date: formData.pickupDate,
        renewal_date: formData.renewal_date,
        total_cost: formData.total_cost,
        user_id: formData.user_id,
        status: formData.status,
        pickupAddress: formData.pickupAddress,
        dropoffAddress: formData.dropoffAddress,
        pickupTime: formData.selectedTime,
        riders: formData.riders,
        selectedDays: formData.selectedDays,
        end_date: formData.end_date,
        payment_intent_id: formData.payment_intent_id,
        payment_status: formData.payment_status,
      })
      .select();

    if (weeklyRideError) {
      console.error("Error creating weekly ride:", weeklyRideError);
      return { success: false, error: weeklyRideError };
    }

    if (!weeklyRideData || weeklyRideData.length === 0) {
      console.error("No data returned after creating weekly ride");
      return {
        success: false,
        error: new Error("No data returned after creating weekly ride"),
      };
    }

    const weeklyRideId = weeklyRideData[0].id;

    // Create individual ride sessions
    const { rideSessions, endDate } = createRideSessions(
      formData,
      weeklyRideId
    );

    const { error: sessionsError } = await supabase
      .from("rides")
      .insert(rideSessions);

    if (sessionsError) {
      console.error("Error creating ride sessions:", sessionsError);
      // If ride sessions fail, we should delete the weekly ride to maintain consistency
      await supabase.from("weekly_rides").delete().eq("id", weeklyRideId);
      return { success: false, error: sessionsError };
    }

    // Update the weekly ride with the correct end date
    const { error: updateError } = await supabase
      .from("weekly_rides")
      .update({ end_date: endDate })
      .eq("id", weeklyRideId);

    if (updateError) {
      console.error("Error updating weekly ride end date:", updateError);
      // This is not a critical error, so we don't return here
    }

    return {
      success: true,
      data: {
        weeklyRide: { ...weeklyRideData[0], end_date: endDate },
        rideSessions: rideSessions,
      },
    };
  } catch (error) {
    console.error("Error in createWeeklyRide:", error);
    return { success: false, error };
  }
}

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
    // Get today's date in 'YYYY-MM-DD' format
    const today = new Date().toISOString().split("T")[0];

    const { data, error } = await supabase
      .from("rides") // querying from rides table
      .select("*")
      .in("status", ["pending", "accepted", "ongoing"]) // filter by 'pending', 'accepted', or 'ongoing' statuses
      .eq("user_id", userId) // filter by user ID
      .eq("weekly", false) // filter rides where weekly is false
      .gte("pickupDate", today); // only rides where pickupDate is today or in the future

    if (error) {
      throw error;
    }

    return data; // Return the rides with the specified statuses and future dates
  } catch (error) {
    console.error("Error fetching rides:", error);
    throw error;
  }
};

export const getWeeklyRidesForUser = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("weekly_rides") // querying from the weekly_rides table
      .select("*") // selecting all fields
      .in("status", ["active"]) // filter by 'pending', 'accepted', or 'ongoing' statuses
      .eq("user_id", userId); // filter by user ID

    if (error) {
      throw error;
    }

    return data; // Return the weekly rides data
  } catch (error) {
    console.error("Error fetching weekly rides:", error);
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

export const updateRideLink = async (rideId: string, link: string) => {
  const { data, error } = await supabase
    .from("rides")
    .update({ ride_link: link })
    .eq("id", rideId);

  if (error) {
    console.error("Error updating ride link:", error);
    throw error;
  }

  console.log("Ride link updated successfully:", data);
};

export async function updateDriverLocation(
  rideId: string,
  driverId: string,
  driverLat: number,
  driverLng: number
) {
  const { error } = await supabase.from("ride_location").insert({
    ride_id: rideId,
    driver_id: driverId,
    driverLat,
    driverLng,
  });

  if (error) {
    console.error("Failed to update driver's location:", error);
  }
}
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
export const getUserRole = async (userId: string) => {
  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("role") // Select only the role field
      .eq("id", userId); // Use the userId to find the specific user

    if (error) {
      throw error;
    }

    if (user && user.length > 0) {
      return user[0].role; // Return the user's role
    } else {
      redirect("/403");
    }
  } catch (error) {
    console.error("Error Getting User Role:", error);
    throw error;
  }
};
export const getUnverifiedUsers = async () => {
  try {
    const { data: users, error } = await supabase
      .from("users")
      .select("*")
      .eq("orientation_status", "scheduled");

    if (error) {
      throw error;
    }

    return users; // Return the unverified users
  } catch (error) {
    console.error("Error Getting Unverified Users:", error);
    throw error;
  }
};
export const saveTimeSlotsToSupabase = async (
  date: string,
  timeSlots: string[]
) => {
  try {
    const { data, error } = await supabase.from("time_blocks").insert(
      timeSlots.map((slot) => ({
        date: date,
        time_slot: slot,
      }))
    );

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error saving time slots:", error);
    throw error;
  }
};

export const bookOrientation = async (
  user_id: string,
  date: string,
  time: string
) => {
  try {
    // Start a transaction by first booking the time slot
    const { error: bookingError } = await supabase
      .from("time_blocks")
      .update({ booked: true, user_id })
      .match({ date, time_slot: time });

    if (bookingError) {
      throw bookingError;
    }

    // Update the orientation status, date, and time in the users table
    const { error: statusError } = await supabase
      .from("users")
      .update({
        orientation_status: "scheduled",
        orientation_date: date,
        orientation_time: time,
      })
      .eq("id", user_id);

    if (statusError) {
      throw statusError;
    }

    return true;
  } catch (error) {
    console.error("Error booking orientation and updating status:", error);
    return false;
  }
};
export const cancelOrientation = async (
  user_id: string,
  date: string,
  time: string
) => {
  try {
    // Start by un-booking the time slot in time_blocks
    const { error: unbookError } = await supabase
      .from("time_blocks")
      .update({ booked: false, user_id: null })
      .match({ date, time_slot: time });

    if (unbookError) {
      throw unbookError;
    }

    // Reset the orientation status, date, and time in the users table
    const { error: statusError } = await supabase
      .from("users")
      .update({
        orientation_status: "not_scheduled",
        orientation_date: null,
        orientation_time: null,
      })
      .eq("id", user_id);

    if (statusError) {
      throw statusError;
    }

    return true;
  } catch (error) {
    console.error("Error canceling orientation:", error);
    return false;
  }
};

export const getUserOrientationStatus = async (user_id: string) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("orientation_status, orientation_date, orientation_time")
      .eq("id", user_id)
      .single();

    if (error) {
      throw error;
    }

    return {
      status: data.orientation_status,
      date: data.orientation_date,
      time: data.orientation_time,
    };
  } catch (error) {
    console.error("Error fetching user orientation status:", error);
    return { status: null, date: null, time: null };
  }
};
type TimeSlot = {
  id: number;
  slot: string;
  booked: boolean;
};

type TimeSlotsByDate = {
  [key: string]: TimeSlot[];
};

export const getAllTimeSlots = async () => {
  try {
    const { data, error } = await supabase
      .from("time_blocks")
      .select("id, date, time_slot, booked");

    if (error) {
      throw error;
    }

    const slotsByDate = data.reduce((acc: TimeSlotsByDate, item) => {
      const dateKey = item.date;
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push({
        id: item.id,
        slot: item.time_slot,
        booked: item.booked,
      });
      return acc;
    }, {} as TimeSlotsByDate);

    return slotsByDate;
  } catch (error) {
    console.error("Error fetching time slots:", error);
    throw error;
  }
};
import { format, isAfter, startOfDay } from "date-fns";
import { WeeklyFormData } from "@/app/types/types";

export const getAvailableTimeSlots = async () => {
  try {
    const today = startOfDay(new Date());

    const { data, error } = await supabase
      .from("time_blocks")
      .select("date, time_slot")
      .eq("booked", false)
      .gte("date", format(today, "yyyy-MM-dd")) // Only fetch dates from today onwards
      .order("date", { ascending: true });

    if (error) {
      throw error;
    }

    const slotsByDate: { [key: string]: string[] } = {};
    data.forEach((entry) => {
      const date = entry.date;
      const timeSlot = entry.time_slot;

      if (!slotsByDate[date]) {
        slotsByDate[date] = [];
      }

      slotsByDate[date].push(timeSlot);
    });

    // Sort the time slots correctly (AM before PM)
    Object.keys(slotsByDate).forEach((date) => {
      slotsByDate[date].sort((a, b) => {
        const timeA = convertTo24HourTimestamp(a);
        const timeB = convertTo24HourTimestamp(b);
        return timeA - timeB;
      });
    });

    return slotsByDate;
  } catch (error) {
    console.error("Error fetching time slots:", error);
    return {};
  }
};

// Helper function to convert 12-hour time format to a timestamp for comparison
function convertTo24HourTimestamp(time12h: any) {
  const [time, modifier] = time12h.split(" ");
  let [hours, minutes] = time.split(":");
  if (hours === "12") {
    hours = "00";
  }
  if (modifier === "PM") {
    hours = parseInt(hours, 10) + 12;
  }
  // Return a timestamp representing the time portion
  return new Date(`1970-01-01T${hours}:${minutes}:00Z`).getTime();
}
export const removeTimeSlotFromSupabase = async (id: number) => {
  try {
    const { data, error } = await supabase
      .from("time_blocks")
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error deleting time slot:", error);
    throw error;
  }
};
export const verifyUserOrientation = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("users") // Replace with your actual table name
      .update({ orientation_status: "verified" })
      .eq("id", userId);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error Verifying User Orientation:", error);
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
