"use client";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import MapboxAddressAutofill from "../MapboxAddressAutofill";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ScheduleRide() {
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const formik = useFormik({
    initialValues: {
      rider: "",
      pickupDate: "",
      pickupTime: "",
      pickupAddress: "",
      dropoffAddress: "",
      specialInstructions: "",
    },
    validationSchema: Yup.object({
      rider: Yup.string().required("Required"),
      pickupDate: Yup.date().required("Required"),
      pickupTime: Yup.string().required("Required"),
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
      <h1 className="text-3xl mb-6 tracking-tighter text-gray-700">
        Schedule a Ride
      </h1>
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
            htmlFor="rider"
            className="block text-sm font-medium text-gray-700"
          >
            Rider
          </label>
          <Select>
            <SelectTrigger
              id="rider"
              name="rider"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.rider}
              className="bg-white"
            >
              <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Jane Doe">Jane Doe</SelectItem>
              <SelectItem value="Jack Doek">Jane Doe</SelectItem>
              <SelectItem value="Jill Doe">Jill Doe</SelectItem>
            </SelectContent>
          </Select>
          {formik.touched.rider && formik.errors.rider ? (
            <div className="text-red-600">{formik.errors.rider}</div>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="pickupDate"
            className="block text-sm font-medium text-gray-700"
          >
            Pickup Date
          </label>
          <Input
            id="pickupDate"
            name="pickupDate"
            type="date"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.pickupDate}
            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-white"
          />
          {formik.touched.pickupDate && formik.errors.pickupDate ? (
            <div className="text-red-600">{formik.errors.pickupDate}</div>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="pickupTime"
            className="block text-sm font-medium text-gray-700"
          >
            Pickup Time
          </label>
          <Input
            id="pickupTime"
            name="pickupTime"
            type="time"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.pickupTime}
            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-white"
          />
          {formik.touched.pickupTime && formik.errors.pickupTime ? (
            <div className="text-red-600">{formik.errors.pickupTime}</div>
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
            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-white"
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
}
