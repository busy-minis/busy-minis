import React from "react";
import AddDriverForm from "./DriverForm";
import { Suspense } from "react";
export default function page() {
  return (
    <div className="h-screen ">
      <Suspense fallback={null}>
        <AddDriverForm />
      </Suspense>
    </div>
  );
}
