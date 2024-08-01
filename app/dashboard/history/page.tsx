"use client";
import { useState } from "react";

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
    <div className=" ">
      <h1 className="text-3xl  mb-6">Ride History</h1>
      <div className="space-y-4">
        {rides.map((ride) => (
          <div key={ride.id} className="border border-gray-300 rounded-md">
            <div
              className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-100"
              onClick={() => toggleRideDetails(ride.id)}
            >
              <div>
                <p className="font-semibold">{ride.dropoffAddress}</p>
                <p>{ride.date}</p>
              </div>
              <button className="text-blue-500">
                {expandedRideId === ride.id ? "Hide Details" : "Show Details"}
              </button>
            </div>
            {expandedRideId === ride.id && (
              <div className="p-4 bg-gray-50">
                <p>
                  <strong>Pickup Address:</strong> {ride.pickupAddress}
                </p>

                <p>
                  <strong>Time:</strong> {ride.time}
                </p>
                <p>
                  <strong>Dropoff Address:</strong> {ride.dropoffAddress}
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
  );
};

export default RideHistory;
