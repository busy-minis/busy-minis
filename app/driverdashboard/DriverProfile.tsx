"use client";
import React, { useState } from "react";
import { User, Camera, SignOut } from "@phosphor-icons/react/dist/ssr";
import { useRouter } from "next/navigation";

export const DriverProfile = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const router = useRouter();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPhoto(null);
    setPreview(null);
  };

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      setSelectedPhoto(file);
      setPreview(URL.createObjectURL(file)); // Preview the selected image
    }
  };

  const handlePhotoUpload = () => {
    if (selectedPhoto) {
      // Perform the photo upload logic here (e.g., upload to Supabase storage)
      console.log("Uploading photo:", selectedPhoto);
      closeModal();
    }
  };

  const exitDashboard = () => {
    router.push("/");
  };

  return (
    <div className="p-6 space-y-8">
      {/* Exit Dashboard Button */}
      <div className="">
        <button
          onClick={exitDashboard}
          className="flex items-center space-x-2 bg-gray-950 px-4 py-1 rounded-md text-teal-600 hover:text-teal-800 transition duration-200"
        >
          <SignOut className="w-6 h-6" />
          <span className="text-lg font-semibold">Exit Dashboard</span>
        </button>
      </div>

      {/* Profile Section */}
      <h2 className="text-4xl text-center text-gray-200">Driver Profile</h2>
      <div className="bg-gray-100 p-10 rounded-xl shadow-lg flex flex-col items-center space-y-8">
        {/* Clickable Profile Picture */}
        <div onClick={openModal} className="relative cursor-pointer group">
          <div className="p-2 rounded-full bg-gray-300 text-white group-hover:bg-gray-400 transition-all duration-200">
            {preview ? (
              <img
                src={preview}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-teal-500"
              />
            ) : (
              <img
                src={"/assets/john.jpg"}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-teal-500"
              />
              // <User className="w-32 h-32 text-teal-500" />
            )}
          </div>

          {/* Camera Icon */}
          <div className="absolute bottom-0 right-0 bg-teal-600 p-2 rounded-full text-white hover:bg-teal-700 transition group-hover:scale-110 duration-200">
            <Camera className="w-6 h-6" />
          </div>
        </div>

        {/* Driver Name */}
        <div>
          <p className="text-3xl font-semibold text-gray-900">Jerone George</p>
        </div>
      </div>

      {/* Modal for Uploading Photo */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full space-y-6">
            <h3 className="text-2xl font-semibold text-gray-900">
              Upload New Profile Photo
            </h3>

            <div className="flex flex-col items-center space-y-4">
              {/* Image Preview */}
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-32 h-32 rounded-full object-cover border-4 border-teal-500"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="w-12 h-12 text-gray-400" />
                </div>
              )}

              {/* File Input */}
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
              />

              {/* Buttons */}
              <div className="mt-4 flex justify-end space-x-4">
                <button
                  onClick={closeModal}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePhotoUpload}
                  className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition"
                  disabled={!selectedPhoto}
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
