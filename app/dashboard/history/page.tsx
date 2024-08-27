"use client";
import { useState } from "react";
import { CaretLineDown, CaretLineUp } from "@phosphor-icons/react";

interface Ride {
  id: string;
  date: string;
  time: string;
  pickupAddress: string;
  driverName: string;
  dropoffAddress: string;
  specialInstructions: string;
}

const RideHistory = () => {
  const [expandedRideId, setExpandedRideId] = useState<string | null>(null);

  // Dummy data for demonstration purposes
  const rides: Ride[] = [
    {
      id: "1",
      date: "2024-07-01",
      time: "10:00 AM",
      pickupAddress: "123 Main St",
      dropoffAddress: "456 Elm St",
      driverName: "John Doe",
      specialInstructions: "Be careful with the traffic.",
    },
    {
      id: "2",
      date: "2024-07-02",
      time: "11:00 AM",
      pickupAddress: "789 Oak St",
      dropoffAddress: "101 Pine St",
      driverName: "Jane Smith",
      specialInstructions: "Pick up from the side entrance.",
    },
    {
      id: "3",
      date: "2024-07-03",
      time: "12:00 PM",
      pickupAddress: "202 Maple St",
      dropoffAddress: "303 Birch St",
      driverName: "Alice Johnson",
      specialInstructions: "Drop off at the back gate.",
    },
    {
      id: "4",
      date: "2024-07-04",
      time: "1:00 PM",
      pickupAddress: "404 Cedar St",
      dropoffAddress: "505 Spruce St",
      driverName: "Bob Brown",
      specialInstructions: "Ring the doorbell on arrival.",
    },
    {
      id: "5",
      date: "2024-07-05",
      time: "2:00 PM",
      pickupAddress: "606 Willow St",
      dropoffAddress: "707 Redwood St",
      driverName: "Charlie Green",
      specialInstructions: "Assist with luggage.",
    },
  ];

  const toggleRideDetails = (id: string) => {
    setExpandedRideId(expandedRideId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-10">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Ride History
        </h1>

        <div className="space-y-4">
          {rides.map((ride) => (
            <div key={ride.id} className="text-gray-700">
              <div
                className="flex justify-between items-center cursor-pointer p-4 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
                onClick={() => toggleRideDetails(ride.id)}
              >
                <div>
                  <p className="font-medium text-lg">{ride.dropoffAddress}</p>
                  <p className="text-sm text-gray-600">
                    {ride.date} at {ride.time}
                  </p>
                </div>
                <div className="flex items-center">
                  {expandedRideId === ride.id ? (
                    <CaretLineUp size={20} />
                  ) : (
                    <CaretLineDown size={20} />
                  )}
                </div>
              </div>

              {expandedRideId === ride.id && (
                <div className="mt-2 ml-2 border-l-2 border-teal-500 pl-4 text-sm text-gray-600 space-y-2">
                  <p>
                    <strong>Pickup Address:</strong> {ride.pickupAddress}
                  </p>
                  <p>
                    <strong>Driver:</strong> {ride.driverName}
                  </p>
                  <p>
                    <strong>Special Instructions:</strong>{" "}
                    {ride.specialInstructions}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RideHistory;
