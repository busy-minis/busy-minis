"use client";

import React, { useState, useEffect } from "react";

// Dummy data for users, including the orientation date, time, and phone number
const initialUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    phoneNumber: "123-456-7890",
    orientationDate: new Date("2024-08-20T10:30:00"),
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phoneNumber: "987-654-3210",
    orientationDate: new Date("2024-08-18T14:00:00"),
  },
  {
    id: 3,
    name: "Jack Johnson",
    email: "jack.johnson@example.com",
    phoneNumber: "555-123-4567",
    orientationDate: new Date("2024-08-22T09:00:00"),
  },
];

const VerifyUsersPage = () => {
  const [users, setUsers] = useState(initialUsers);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Sort users by orientation date
  useEffect(() => {
    setUsers((prevUsers) =>
      [...prevUsers].sort(
        (a, b) => a.orientationDate.getTime() - b.orientationDate.getTime()
      )
    );
  }, []);

  const handleVerifyClick = (user: any) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  const handleConfirmVerification = () => {
    if (selectedUser) {
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== selectedUser.id)
      );
      setIsDialogOpen(false);
      setSelectedUser(null);
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-4">
      <h1 className="text-2xl sm:text-3xl font-semibold text-gray-700">
        Verify Users
      </h1>
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
        {users.length > 0 ? (
          <ul className="space-y-4">
            {users.map((user, index) => (
              <li
                key={user.id}
                className={`flex flex-col sm:flex-row justify-between items-start sm:items-center ${
                  index < users.length - 1
                    ? "border-b border-gray-200 pb-4"
                    : ""
                }`}
              >
                <div className="mb-2 sm:mb-0">
                  <p className="text-lg font-semibold">{user.name}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <p className="text-sm text-gray-600">
                    Phone: {user.phoneNumber}
                  </p>
                  <p className="text-sm text-gray-500">
                    Orientation Date:{" "}
                    {user.orientationDate.toLocaleDateString()} at{" "}
                    {user.orientationDate.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
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
              <span className="font-bold">{selectedUser.name}</span>?
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
