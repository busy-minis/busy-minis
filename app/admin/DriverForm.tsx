"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";

const AddDriverForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    licensePlate: "",
    vehicleType: "",
    vehicleBrand: "",
    photo: null,
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: any) => {
    setFormData({ ...formData, photo: e.target.files[0] });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Handle form submission logic here, e.g., sending data to a backend server
    console.log(formData);
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Add Driver</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Label htmlFor="name" className="block text-gray-700 font-bold mb-2">
            Name
          </Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="email" className="block text-gray-700 font-bold mb-2">
            Email
          </Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <Label
            htmlFor="licensePlate"
            className="block text-gray-700 font-bold mb-2"
          >
            License Plate
          </Label>
          <Input
            type="text"
            id="licensePlate"
            name="licensePlate"
            value={formData.licensePlate}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <Label
            htmlFor="vehicleType"
            className="block text-gray-700 font-bold mb-2"
          >
            Vehicle Type
          </Label>
          <Input
            type="text"
            id="vehicleType"
            name="vehicleType"
            value={formData.vehicleType}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <Label
            htmlFor="vehicleBrand"
            className="block text-gray-700 font-bold mb-2"
          >
            Vehicle Brand
          </Label>
          <Input
            type="text"
            id="vehicleBrand"
            name="vehicleBrand"
            value={formData.vehicleBrand}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="photo" className="block text-gray-700 font-bold mb-2">
            Photo
          </Label>
          <Input
            type="file"
            id="photo"
            name="photo"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border rounded-lg"
            accept="image/*"
            required
          />
        </div>
        <Button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full"
        >
          Submit
        </Button>
      </form>
    </div>
  );
};

export default AddDriverForm;
