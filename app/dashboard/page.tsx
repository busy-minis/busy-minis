"use client";

import { User } from "@phosphor-icons/react";
import React, { useEffect, useState } from "react";
import {
  addChild,
  deleteChild,
  getChildren,
} from "@/utils/supabase/supabaseQueries";
import Image from "next/image";
import Link from "next/link";

interface Child {
  id: number;
  first_name: string;
  last_name: string;
  birthdate: string;
}

interface Rider {
  name: string;
  children: Child[];
}

const RiderProfile = () => {
  const [rider, setRider] = useState<Rider>({
    name: "Johnathan Alexander Doe",
    children: [],
  });

  const [newChild, setNewChild] = useState({
    first_name: "",
    last_name: "",
    birthdate: "",
  });
  const [isAddingChild, setIsAddingChild] = useState(false);
  const userId = "dea16759-3066-48bc-b88e-cff23de57d6a"; // Replace with actual user ID

  useEffect(() => {
    const fetchChildren = async () => {
      const children = await getChildren(userId);
      setRider((prevRider) => ({ ...prevRider, children }));
    };

    fetchChildren();
  }, []);

  const handleAddChild = async () => {
    if (newChild.first_name && newChild.last_name && newChild.birthdate) {
      await addChild({ user_id: userId, ...newChild });
      const children = await getChildren(userId);
      setRider((prevRider) => ({ ...prevRider, children }));
      setNewChild({ first_name: "", last_name: "", birthdate: "" });
      setIsAddingChild(false);
    }
  };

  const handleDeleteChild = async (id: number) => {
    await deleteChild(id);
    const children = await getChildren(userId);
    setRider((prevRider) => ({ ...prevRider, children }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewChild((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    setIsAddingChild(false);
    setNewChild({ first_name: "", last_name: "", birthdate: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-white to-orange-100 py-8 sm:py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Notice Section */}
        <div className="bg-gradient-to-r from-yellow-100 via-yellow-200 to-yellow-300 border-l-4 border-yellow-600 text-yellow-800 p-4 sm:p-6 rounded-lg mb-8 sm:mb-12 shadow-lg">
          <h3 className="text-base sm:text-lg font-bold">Important Notice</h3>
          <p className="mt-2 text-sm sm:text-base">
            You have not scheduled an orientation yet. Please schedule one to
            enable ride booking.
          </p>
          <Link href="/dashboard/orientation">
            <button className="mt-4 px-4 py-2 sm:px-6 sm:py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-transform duration-200 transform hover:scale-105 shadow-md text-sm sm:text-base">
              Schedule Orientation
            </button>
          </Link>
        </div>

        {/* Rider Profile Section */}
        <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-lg border border-teal-50">
          <div className="flex flex-col items-center">
            <Image
              src="/logo.png"
              width={100}
              height={100}
              alt="Rider Profile"
              className="rounded-full border-4 border-teal-500 shadow-xl"
            />
            <h2 className="text-2xl sm:text-3xl font-bold mt-4 sm:mt-6 text-gray-800">
              {rider.name}
            </h2>
          </div>

          <div className="mt-8 sm:mt-12">
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">
              Children
            </h3>
            <div className="space-y-4 sm:space-y-6">
              {rider.children.length > 0 ? (
                rider.children.map((child) => (
                  <div
                    key={child.id}
                    className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 bg-teal-50 border border-teal-200 rounded-xl shadow-md hover:shadow-xl transition-all"
                  >
                    <div className="flex items-center">
                      <User
                        size={32}
                        weight="fill"
                        className="text-teal-500 mr-4"
                      />
                      <div>
                        <p className="text-base sm:text-lg font-semibold text-gray-700">
                          {child.first_name} {child.last_name}
                        </p>
                        <p className="text-sm sm:text-base text-gray-500">
                          DOB: {child.birthdate}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteChild(child.id)}
                      className="mt-4 sm:mt-0 px-4 py-2 sm:px-5 sm:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-transform duration-200 transform hover:scale-105 shadow-md text-sm sm:text-base"
                    >
                      Delete
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-sm sm:text-base text-gray-600">
                  No children added yet.
                </p>
              )}
            </div>

            {/* Add Child Form */}
            {isAddingChild ? (
              <div className="mt-8 p-4 sm:p-6 bg-teal-50 border border-teal-100 rounded-xl shadow-lg">
                <h4 className="text-base sm:text-lg font-semibold mb-4">
                  Add New Child
                </h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="first_name"
                      placeholder="First Name"
                      value={newChild.first_name}
                      onChange={handleInputChange}
                      className="p-3 sm:p-4 border border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm sm:text-base"
                    />
                    <input
                      type="text"
                      name="last_name"
                      placeholder="Last Name"
                      value={newChild.last_name}
                      onChange={handleInputChange}
                      className="p-3 sm:p-4 border border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm sm:text-base"
                    />
                  </div>
                  <input
                    type="date"
                    name="birthdate"
                    value={newChild.birthdate}
                    onChange={handleInputChange}
                    className="w-full p-3 sm:p-4 border border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm sm:text-base"
                  />
                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={handleAddChild}
                      className="px-4 py-2 sm:px-5 sm:py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-transform duration-200 transform hover:scale-105 shadow-md text-sm sm:text-base"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 sm:px-5 sm:py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-transform duration-200 transform hover:scale-105 shadow-md text-sm sm:text-base"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsAddingChild(true)}
                className="mt-8 w-full px-4 py-2 sm:px-6 sm:py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-transform duration-200 transform hover:scale-105 shadow-md text-sm sm:text-base"
              >
                Add Child
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiderProfile;
