"use client";

import React, { useState, useEffect } from "react";
import {
  verifyUserOrientation,
  getUnverifiedUsers,
} from "@/utils/supabase/supabaseQueries";

const VerifyUsersPage = ({ users }: { users: any[] }) => {
  const [sortedUsers, setSortedUsers] = useState<any[]>(users);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Sort users by orientation date and time
  useEffect(() => {
    setSortedUsers(
      [...users].sort((a, b) => {
        const dateA = parseDateAndTime(a.orientation_date, a.orientation_time);
        const dateB = parseDateAndTime(b.orientation_date, b.orientation_time);
        return dateA.getTime() - dateB.getTime();
      })
    );
  }, [users]);

  const parseDateAndTime = (dateString: string, timeString: string) => {
    const dateParts = dateString.split("-");
    const timeParts = timeString.split(":");

    // Ensure that the parts are correctly parsed
    const year = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) - 1; // Months are 0-based in JavaScript
    const day = parseInt(dateParts[2], 10);

    const hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10);

    return new Date(year, month, day, hours, minutes);
  };

  const handleVerifyClick = (user: any) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  const handleConfirmVerification = async () => {
    if (selectedUser) {
      try {
        await verifyUserOrientation(selectedUser.id);
        setSortedUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === selectedUser.id
              ? { ...user, orientation_status: "verified" }
              : user
          )
        );
      } catch (error) {
        console.error("Failed to verify user:", error);
      } finally {
        setIsDialogOpen(false);
        setSelectedUser(null);
      }
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-4">
      <h1 className="text-2xl sm:text-3xl font-semibold text-gray-700">
        Verify Users
      </h1>
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
        {sortedUsers.length > 0 ? (
          <ul className="space-y-4">
            {sortedUsers.map((user, index) => (
              <li
                key={user.id}
                className={`flex flex-col sm:flex-row justify-between items-start sm:items-center ${
                  index < sortedUsers.length - 1
                    ? "border-b border-gray-200 pb-4"
                    : ""
                }`}
              >
                <div className="mb-2 sm:mb-0">
                  <p className="text-lg font-semibold">
                    {user.first_name} {user.last_name}
                  </p>
                  <p className="text-sm text-gray-600">Email: {user.email}</p>
                  <p className="text-sm text-gray-600">
                    Phone: {user.phone_number}
                  </p>
                  <p className="text-sm text-gray-500">
                    Orientation Date:{" "}
                    {user.orientation_date && user.orientation_time
                      ? parseDateAndTime(
                          user.orientation_date,
                          user.orientation_time
                        ).toLocaleDateString([], {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "N/A"}{" "}
                    at{" "}
                    {user.orientation_date && user.orientation_time
                      ? parseDateAndTime(
                          user.orientation_date,
                          user.orientation_time
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "N/A"}
                  </p>
                </div>
                <button
                  onClick={() => handleVerifyClick(user)}
                  className="bg-theme-orange text-white px-4 py-2 rounded-md w-full sm:w-auto"
                >
                  Verify Account
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No users need verification.</p>
        )}
      </div>

      {/* Confirmation Dialog */}
      {isDialogOpen && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 sm:p-0">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Confirm Verification</h2>
            <p>
              Are you sure you want to verify the account of{" "}
              {selectedUser.first_name} {selectedUser.last_name}?
            </p>
            <div className="mt-6 flex justify-end space-x-2">
              <button
                onClick={() => setIsDialogOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmVerification}
                className="bg-green-600 text-white px-4 py-2 rounded-md"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifyUsersPage;
