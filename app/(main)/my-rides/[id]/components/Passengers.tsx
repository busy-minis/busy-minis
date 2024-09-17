import { User } from "@phosphor-icons/react";
import React from "react";

export default function Passengers({ riders }: any) {
  return (
    <div className="bg-white shadow-lg rounded-xl p-6 mb-6">
      <h2 className="text-xl font-semibold text-teal-900 mb-4">Passengers</h2>
      <div className="space-y-4">
        {riders && riders.length > 0 ? (
          riders.map((passenger: any, index: number) => (
            <div key={index} className="flex items-start space-x-4">
              <User size={24} className="text-teal-600" />
              <div>
                <p className="text-lg font-semibold text-gray-900">
                  {passenger.name}
                </p>
                <p className="text-gray-600">Age: {passenger.age}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-700">No passengers available.</p>
        )}
      </div>
    </div>
  );
}
