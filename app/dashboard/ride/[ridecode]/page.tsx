import React from "react";
import Map from "./map";
import Image from "next/image";

export default function Page() {
  const ride = {
    id: "AB123456",
    driverInfo: {
      name: "John Doe",
      photoUrl: "/assets/john.jpg", // Make sure you have a photo in the public directory
      licensePlate: "XYZ-1234",
      vehicleType: "Toyota Prius",
      vehicleColor: "Blue",
    },
    pickupLocation: "1234 Elm Street, City, State",
    dropoffLocation: "5678 Oak Avenue, City, State",
    time: "2:00 PM", // Time of the ride
    eta: "15 mins", // This should be dynamically set based on the Map component
    status: "awaiting_driver_confirmation", // Or 'accepted'
    paymentStatus: "awaiting_payment", // Or 'paid'
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-6 ">Your Ride Details</h1>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6 w-full max-w-5xl flex flex-col lg:flex-row lg:space-x-8">
        {/* Driver Info or Awaiting Confirmation */}
        <div className="lg:w-1/3 mb-6 lg:mb-0">
          <DriverInfo driverInfo={ride.driverInfo} />
        </div>

        {/* Ride and Payment Details */}
        <div className="lg:w-2/3 flex flex-col space-y-6">
          <RideDetails
            pickupLocation={ride.pickupLocation}
            dropoffLocation={ride.dropoffLocation}
            time={ride.time}
            rideId={ride.id}
          />
          <PaymentAndETA eta={ride.eta} paymentStatus={ride.paymentStatus} />
          <Map />
          <CancelRideButton />
        </div>
      </div>
    </div>
  );
}

// Driver Information Component
const DriverInfo = ({ driverInfo }: { driverInfo: any }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center lg:items-start">
      <div className="mb-4">
        <Image
          src={driverInfo.photoUrl}
          alt="Driver Photo"
          width={80}
          height={80}
          className="rounded-full h-24 w-24 object-cover"
        />
      </div>
      <div className="text-center lg:text-left">
        <h2 className="text-xl font-semibold">{driverInfo.name}</h2>
        <p className="text-gray-600">
          {driverInfo.vehicleColor} {driverInfo.vehicleType}
        </p>
        <p className="text-gray-600">
          License Plate: {driverInfo.licensePlate}
        </p>
      </div>
    </div>
  );
};

// Component for Ride Details
const RideDetails = ({
  pickupLocation,
  dropoffLocation,
  time,
  rideId,
}: {
  pickupLocation: string;
  dropoffLocation: string;
  time: string;
  rideId: string;
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-2">Ride ID</h3>
      <p className="text-gray-600 mb-4">{rideId}</p>

      <h3 className="text-lg font-semibold mb-2">Pickup Location</h3>
      <p className="text-gray-600">{pickupLocation}</p>

      <h3 className="text-lg font-semibold mb-2 mt-4">Dropoff Location</h3>
      <p className="text-gray-600">{dropoffLocation}</p>

      <h3 className="text-lg font-semibold mb-2 mt-4">Ride Time</h3>
      <p className="text-gray-600">{time}</p>
    </div>
  );
};

// Component for Payment Status and ETA
const PaymentAndETA = ({
  eta,
  paymentStatus,
}: {
  eta: string;
  paymentStatus: string;
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 flex justify-between items-center">
      <div>
        <h3 className="text-lg font-semibold mb-2">ETA</h3>
        <p className="text-gray-600">{eta}</p>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Payment Status</h3>
        <p
          className={`${
            paymentStatus === "awaiting_payment"
              ? "text-red-500"
              : "text-green-500"
          }`}
        >
          {paymentStatus === "awaiting_payment" ? "Awaiting Payment" : "Paid"}
        </p>
      </div>
    </div>
  );
};

// Awaiting Driver Confirmation Component
const AwaitingDriver = () => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center lg:items-start">
      <div className="flex items-center justify-center h-24 w-24 rounded-full bg-yellow-400 text-white text-3xl font-bold mb-4">
        ...
      </div>
      <p className="text-center lg:text-left text-lg font-semibold text-gray-800">
        Awaiting Driver Confirmation
      </p>
      <p className="text-center lg:text-left text-gray-600 mt-2">
        Your driver is on the way! Please be patient while the driver confirms
        your ride.
      </p>
    </div>
  );
};

// Cancel Ride Button Component
const CancelRideButton = () => {
  return (
    <button className="bg-red-500 text-white font-semibold rounded-lg w-full py-3 shadow hover:bg-red-600 transition-colors">
      Cancel Ride
    </button>
  );
};
