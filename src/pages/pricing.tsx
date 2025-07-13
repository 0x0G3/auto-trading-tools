import React from "react";
import Pricing from "../components/Pricing";
import FreeTierCta from "../components/Pricing/FreeTierCta";
import TimeToggle from "../components/Pricing/TimeToggle";
import { PricingProvider } from "../context/pricingContext";
import Securedcheckout from "../components/Securedcheckout";
// import { PricingProvider } from "../components/Pricing/PricingContext";

export default function PricingPage() {
  return (
    <PricingProvider>
      <FreeTierCta />
      <div className="flex flex-row items-center justify-center my-2">
        <TimeToggle />
      </div>
      <div className="flex flex-row items-center justify-center space-x-5 m-3 p-6 bg-gray-100">
        <Pricing badge="Most Popular" tier="basic" />
        <Pricing tier="advance" />
      </div>
      <Securedcheckout />
    </PricingProvider>
  );
}
