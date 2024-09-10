import React from "react";

export default function ReviewSection({ formData, totalPrice, setStep }: any) {
  return (
    <>
      <div className="flex items-center mb-8">
        <div className="bg-orange-500 grid place-content-center text-sm w-8 h-8 rounded-full text-white">
          2
        </div>
        <p className="font-semibold text-lg ml-2">Review Your Ride Details</p>
      </div>

      <section className="mb-6 p-6 bg-white shadow-lg rounded-lg">
        <h4 className="font-semibold text-xl text-teal-700 mb-4">
          Riders Information:
        </h4>
        <ul className="list-disc list-inside mb-6">
          {formData.riders.map((rider: any, index: any) => (
            <li key={index} className="text-gray-700">
              <span className="font-medium text-gray-900">{rider.name}</span>,{" "}
              {rider.age} years old
            </li>
          ))}
        </ul>

        <h4 className="font-semibold text-xl text-teal-700 mb-4">
          Ride Details:
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="flex-1 bg-gray-100 p-4 rounded-lg shadow-sm">
            <p className="text-gray-600">
              <span className="font-medium text-teal-700">Pickup Date:</span>{" "}
              {formData.pickupDate}
            </p>
            <p className="text-gray-600 mt-2">
              <span className="font-medium text-teal-700">Pickup Time:</span>{" "}
              {formData.pickupTime}
            </p>
          </div>

          <div className="flex-1 bg-gray-100 p-4 rounded-lg shadow-sm">
            <p className="text-gray-600 mt-2">
              <span className="font-medium text-teal-700">Pickup Address:</span>{" "}
              {formData.pickupAddress}
            </p>
            <p className="text-gray-600">
              <span className="font-medium text-teal-700">
                Dropoff Address:
              </span>{" "}
              {formData.dropoffAddress}
            </p>
          </div>
        </div>

        <div className="bg-teal-100 p-4 rounded-lg shadow-md">
          <h4 className="font-semibold text-lg text-teal-700 mb-2">
            Final Cost: ${totalPrice}
          </h4>
        </div>
        <div className="flex justify-between mt-6">
          <button
            type="button"
            className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg shadow-md hover:shadow-lg transition-transform duration-200 ease-in-out transform hover:-translate-y-1 mr-2 flex justify-center items-center"
            onClick={() => setStep(2)}
          >
            Back
          </button>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-gradient-to-r from-theme-orange to-theme-yellow text-white rounded-lg shadow-md hover:shadow-lg transition-transform duration-200 ease-in-out transform hover:-translate-y-1 ml-2 flex justify-center items-center"
          >
            Continue to Payment
          </button>
        </div>
      </section>
    </>
  );
}
