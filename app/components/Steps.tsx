import React from "react";
import Image from "next/image";

import { Globe } from "@phosphor-icons/react/dist/ssr";
export default function Steps() {
  return (
    <>
      <div className=""></div>
      <div className="h-screen"></div>
    </>
  );
}

const Step = () => {
  return (
    <div className="py-8 px-4 border-2 border-neutral-800 bg-gradient-to-r from-neutral-700 to-neutral-600 rounded-xl flex flex-col items-center text-neutral-50">
      <Globe size={100} />
      <h2 className="text-2xl"> Register with us</h2>
      <p className="mt-24 ">
        Fill out the registration form , upload the necessary documents and
        photos, and receive an email confirmation.
      </p>
    </div>
  );
};
