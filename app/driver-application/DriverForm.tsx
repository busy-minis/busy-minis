"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createDriver } from "./actions";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

// Yup validation schema
const validationSchema = Yup.object({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
  licensePlate: Yup.string()
    .matches(/^[A-Za-z0-9]{1,10}$/, "Invalid license plate")
    .required("License plate is required"),
  vehicleBrand: Yup.string().required("Vehicle brand is required"),
  vehicleYear: Yup.number()
    .min(1900, "Year cannot be before 1900")
    .max(new Date().getFullYear(), "Invalid year")
    .required("Vehicle year is required"),
  vehicleColor: Yup.string().required("Vehicle color is required"),
  phoneNumber: Yup.string()
    .matches(
      /^(\+?\d{1,2})?(\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}$/,
      "Invalid phone number"
    )
    .required("Phone number is required"),
});

export default function AddDriverPage() {
  const [isAllowed, setIsAllowed] = useState<boolean>(false); // Token validation
  const [timeRemaining, setTimeRemaining] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      const expiryTime = parseInt(token);
      const currentTime = Date.now();

      if (currentTime > expiryTime) {
        router.push("/access-expired");
      } else {
        setIsAllowed(true);

        const timeLeft = expiryTime - currentTime;
        const minutesLeft = Math.floor(timeLeft / (60 * 1000));
        const secondsLeft = Math.floor((timeLeft % (60 * 1000)) / 1000);
        setTimeRemaining(`${minutesLeft} minutes and ${secondsLeft} seconds`);

        const countdown = setInterval(() => {
          const timeRemainingNow = expiryTime - Date.now();
          if (timeRemainingNow <= 0) {
            clearInterval(countdown);
            router.push("/access-expired");
          } else {
            const mins = Math.floor(timeRemainingNow / (60 * 1000));
            const secs = Math.floor((timeRemainingNow % (60 * 1000)) / 1000);
            setTimeRemaining(`${mins} minutes and ${secs} seconds`);
          }
        }, 1000);

        return () => clearInterval(countdown);
      }
    } else {
      router.push("/access-expired");
    }
  }, [router, searchParams]);

  const handleSubmit = async (values: any) => {
    // Create a new FormData object
    const formData = new FormData();

    // Append all the form values to FormData
    Object.keys(values).forEach((key) => {
      formData.append(key, values[key]);
    });

    // Call the server action using FormData
    await createDriver(formData);
  };

  if (!isAllowed) {
    return <p>Loading...</p>;
  }

  return (
    <section className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-100 to-gray-300 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-md p-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
          Register as a Driver
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Fill in the details below to create a new driver account.
        </p>

        {timeRemaining && (
          <p className="text-center text-sm text-red-500 mb-6">
            You have {timeRemaining} left to complete this form.
          </p>
        )}

        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
            licensePlate: "",
            vehicleBrand: "",
            vehicleYear: "",
            vehicleColor: "",
            phoneNumber: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form className="space-y-6">
            <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700"
                >
                  First Name
                </label>
                <Field
                  name="firstName"
                  className="block w-full px-4 py-2 mt-1 border rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 border-gray-300"
                  placeholder="John"
                />
                <ErrorMessage
                  name="firstName"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last Name
                </label>
                <Field
                  name="lastName"
                  className="block w-full px-4 py-2 mt-1 border rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 border-gray-300"
                  placeholder="Doe"
                />
                <ErrorMessage
                  name="lastName"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <Field
                  type="email"
                  name="email"
                  className="block w-full px-4 py-2 mt-1 border rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 border-gray-300"
                  placeholder="driver@example.com"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <Field
                  type="password"
                  name="password"
                  className="block w-full px-4 py-2 mt-1 border rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 border-gray-300"
                  placeholder="••••••••"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <Field
                  type="password"
                  name="confirmPassword"
                  className="block w-full px-4 py-2 mt-1 border rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 border-gray-300"
                  placeholder="••••••••"
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="licensePlate"
                  className="block text-sm font-medium text-gray-700"
                >
                  License Plate
                </label>
                <Field
                  name="licensePlate"
                  className="block w-full px-4 py-2 mt-1 border rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 border-gray-300"
                  placeholder="ABC1234"
                />
                <ErrorMessage
                  name="licensePlate"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="vehicleBrand"
                  className="block text-sm font-medium text-gray-700"
                >
                  Vehicle Brand
                </label>
                <Field
                  name="vehicleBrand"
                  className="block w-full px-4 py-2 mt-1 border rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 border-gray-300"
                  placeholder="Toyota"
                />
                <ErrorMessage
                  name="vehicleBrand"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="vehicleYear"
                  className="block text-sm font-medium text-gray-700"
                >
                  Vehicle Year
                </label>
                <Field
                  type="number"
                  name="vehicleYear"
                  className="block w-full px-4 py-2 mt-1 border rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 border-gray-300"
                  placeholder="2020"
                />
                <ErrorMessage
                  name="vehicleYear"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="vehicleColor"
                  className="block text-sm font-medium text-gray-700"
                >
                  Vehicle Color
                </label>
                <Field
                  name="vehicleColor"
                  className="block w-full px-4 py-2 mt-1 border rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 border-gray-300"
                  placeholder="Blue"
                />
                <ErrorMessage
                  name="vehicleColor"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone Number
                </label>
                <Field
                  name="phoneNumber"
                  className="block w-full px-4 py-2 mt-1 border rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 border-gray-300"
                  placeholder="(123) 456-7890"
                />
                <ErrorMessage
                  name="phoneNumber"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 text-sm font-medium text-white bg-teal-600 rounded-md shadow-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
            >
              Register Driver
            </button>
          </Form>
        </Formik>
      </div>
    </section>
  );
}
