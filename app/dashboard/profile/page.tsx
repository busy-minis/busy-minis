"use client";

import { User } from "@phosphor-icons/react/dist/ssr";
import React from "react";

const RiderProfile = () => {
  const rider = {
    name: "John Doe",
    children: [
      { id: 1, name: "Jane Doe" },
      { id: 2, name: "Jack Doe" },
    ],
  };

  const handleAddChild = () => {
    // Logic for adding a child rider
    console.log("Add child");
  };

  const handleEditChild = (id: number) => {
    // Logic for editing a child rider
    console.log("Edit child", id);
  };

  const handleDeleteChild = (id: number) => {
    // Logic for deleting a child rider
    console.log("Delete child", id);
  };

  return (
    <section className="text-zinc-700 ">
      <h3 className="text-2xl ">Rider Profile</h3>
      <div className=" mt-8  ">
        <section className="text-center mb-6 bg-zinc-900 text-white py-8 rounded-md">
          <div className="w-32 h-32 rounded-full mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-full h-full text-white"
            >
              <path
                fillRule="evenodd"
                d="M12 2a5 5 0 100 10 5 5 0 000-10zM2 20a8 8 0 1116 0H2z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold">{rider.name}</h2>
        </section>
        <div className="bg-white border rounded-md p-8">
          <h3 className="text-xl font-semibold mb-4">Riders</h3>
          <div className="space-y-4">
            {rider.children.map((child) => (
              <div
                key={child.id}
                className="flex items-center justify-between bg-gray-50 p-4 rounded-lg shadow-md"
              >
                <div className="flex items-center">
                  <User weight="fill" className=" mx-2 mt-1" />
                  <span className="text-lg font-medium">{child.name}</span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditChild(child.id)}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteChild(child.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={handleAddChild}
            className="mt-6 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Add Child
          </button>
        </div>
      </div>
    </section>
  );
};

export default RiderProfile;
