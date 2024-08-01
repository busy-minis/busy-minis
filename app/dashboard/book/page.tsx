"use client";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import MapboxAddressAutofill from "../MyAdressForm";

const ScheduleRide = () => {
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      date: "",
      time: "",
      pickupAddress: "",
      dropoffAddress: "",
      specialInstructions: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Required"),
      email: Yup.string().email("Invalid email address").required("Required"),
      phone: Yup.string().required("Required"),
      date: Yup.date().required("Required"),
      time: Yup.string().required("Required"),
      pickupAddress: Yup.string().required("Required"),
      dropoffAddress: Yup.string().required("Required"),
      specialInstructions: Yup.string(),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await fetch("/api/schedule-ride", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          throw new Error("Failed to schedule the ride");
        }

        setSubmitSuccess(true);
        resetForm();
      } catch (error) {
        console.error(error);
        setSubmitSuccess(false);
      }
    },
  });

  const handleAddressSelect = (pickupAddress: any, dropoffAddress: any) => {
    formik.setFieldValue("pickupAddress", pickupAddress);
    formik.setFieldValue("dropoffAddress", dropoffAddress);
  };

  return (
    <div className="">
      <h1 className="text-3xl mb-6">Schedule a Ride</h1>
      {submitSuccess && (
        <div
          className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4"
          role="alert"
        >
          <p className="font-bold">Success</p>
          <p>Your ride has been scheduled successfully.</p>
        </div>
      )}
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <Input
            id="name"
            name="name"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          />
          {formik.touched.name && formik.errors.name ? (
            <div className="text-red-600">{formik.errors.name}</div>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          />
          {formik.touched.email && formik.errors.email ? (
            <div className="text-red-600">{formik.errors.email}</div>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700"
          >
            Phone
          </label>
          <Input
            id="phone"
            name="phone"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.phone}
            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          />
          {formik.touched.phone && formik.errors.phone ? (
            <div className="text-red-600">{formik.errors.phone}</div>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700"
          >
            Date
          </label>
          <Input
            id="date"
            name="date"
            type="date"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.date}
            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          />
          {formik.touched.date && formik.errors.date ? (
            <div className="text-red-600">{formik.errors.date}</div>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="time"
            className="block text-sm font-medium text-gray-700"
          >
            Time
          </label>
          <Input
            id="time"
            name="time"
            type="time"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.time}
            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          />
          {formik.touched.time && formik.errors.time ? (
            <div className="text-red-600">{formik.errors.time}</div>
          ) : null}
        </div>

        <div>
          <MapboxAddressAutofill onAddressSelect={handleAddressSelect} />
          {formik.touched.pickupAddress && formik.errors.pickupAddress ? (
            <div className="text-red-600">{formik.errors.pickupAddress}</div>
          ) : null}
          {formik.touched.dropoffAddress && formik.errors.dropoffAddress ? (
            <div className="text-red-600">{formik.errors.dropoffAddress}</div>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="specialInstructions"
            className="block text-sm font-medium text-gray-700"
          >
            Special Instructions
          </label>
          <Textarea
            id="specialInstructions"
            name="specialInstructions"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.specialInstructions}
            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          />
          {formik.touched.specialInstructions &&
          formik.errors.specialInstructions ? (
            <div className="text-red-600">
              {formik.errors.specialInstructions}
            </div>
          ) : null}
        </div>

        <Button type="submit" className="w-full bg-theme-orange">
          Schedule Ride
        </Button>
      </form>
    </div>
  );
};

export default ScheduleRide;
