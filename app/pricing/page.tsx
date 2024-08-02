import React from "react";
import { NavBar } from "../components/ui/NavBar";
import PricingPage from "./pricingpage";

export default function page() {
  return (
    <div>
      <NavBar page="pricing" />
      <PricingPage />
    </div>
  );
}
