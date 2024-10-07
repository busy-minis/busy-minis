import React from "react";
import SingleRides from "./singleRides";
import WeeklyRides from "./weeklyRides";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import {
  getRidesForUser,
  getUserOrientationStatus,
  getWeeklyRidesForUser,
} from "@/utils/supabase/supabaseQueries";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, CalendarRange } from "lucide-react";

export default async function MyRides() {
  revalidatePath("/my-rides");

  const supabase = createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }
  const currentUser = await getUserOrientationStatus(user.id);

  if (currentUser.status !== "verified") {
    redirect("/orientation");
  }

  const rides = await getRidesForUser(user.id);
  const weeklyRides = await getWeeklyRidesForUser(user.id);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-semibold text-gray-800">My Rides</h1>
          <p className="text-gray-600 text-sm mt-1">
            Manage your booked rides below.
          </p>
        </div>
      </header>
      <main className="py-6">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="single" className="w-full">
            <TabsList className="w-full mb-6 bg-white rounded-lg shadow-sm p-1">
              <TabsTrigger
                value="single"
                className="w-1/2 py-2 text-sm data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900"
              >
                <CalendarDays className="mr-2 h-4 w-4" />
                Single Rides
              </TabsTrigger>
              <TabsTrigger
                value="weekly"
                className="w-1/2 py-2 text-sm data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900"
              >
                <CalendarRange className="mr-2 h-4 w-4" />
                Weekly Rides
              </TabsTrigger>
            </TabsList>
            <TabsContent value="single">
              <SingleRides initialRides={rides} user_id={user.id} />
            </TabsContent>
            <TabsContent value="weekly">
              <WeeklyRides weekly_rides={weeklyRides} user_id={user.id} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
