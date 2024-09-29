import React from "react";
import { CheckCircle, Clock, XCircle } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { getCompletedOrCanceledRides } from "@/utils/supabase/supabaseQueries";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function RideHistory() {
  const supabase = createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  const rides = await getCompletedOrCanceledRides(user.id);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "completed":
        return {
          icon: <CheckCircle className="h-4 w-4 text-green-500" />,
          text: "Completed",
          color: "bg-green-100 text-green-800",
        };
      case "pending":
        return {
          icon: <Clock className="h-4 w-4 text-yellow-500" />,
          text: "Pending",
          color: "bg-yellow-100 text-yellow-800",
        };
      case "canceled":
        return {
          icon: <XCircle className="h-4 w-4 text-red-500" />,
          text: "Canceled",
          color: "bg-red-100 text-red-800",
        };
      default:
        return {
          icon: <Clock className="h-4 w-4 text-gray-500" />,
          text: status,
          color: "bg-gray-100 text-gray-800",
        };
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Ride History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Review your past rides with Busy Minis and check your ride status.
          </p>
        </CardContent>
      </Card>

      {/* Desktop Table */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Ride Type</TableHead>
              <TableHead>Pickup Location</TableHead>
              <TableHead>Drop-Off Location</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rides.map((ride, index) => (
              <TableRow key={index}>
                <TableCell>{ride.pickupDate}</TableCell>
                <TableCell>Single Ride</TableCell>
                <TableCell>{ride.pickupAddress}</TableCell>
                <TableCell>{ride.dropoffAddress}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={getStatusInfo(ride.status).color}
                  >
                    {getStatusInfo(ride.status).icon}
                    <span className="ml-2">
                      {getStatusInfo(ride.status).text}
                    </span>
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {rides.map((ride, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-lg">{ride.pickupDate}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Ride Type:</span>
                  <span>Single Ride</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Pickup:</span>
                  <span className="text-right">{ride.pickupAddress}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Drop-off:</span>
                  <span className="text-right">{ride.dropoffAddress}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Status:</span>
                  <Badge
                    variant="outline"
                    className={getStatusInfo(ride.status).color}
                  >
                    {getStatusInfo(ride.status).icon}
                    <span className="ml-2">
                      {getStatusInfo(ride.status).text}
                    </span>
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
