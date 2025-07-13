import React, { useContext } from "react";
import { PricingContext } from "../../context/pricingContext";
// import { PricingContext } from "./PricingContext";

export default function TimeToggle() {
  const { billingCycle, toggleBillingCycle } = useContext(PricingContext);

  return (
    <div>
      <h2 className="text-white text-bold my-4 text-6xl  md:text-4xl sm:text-xl">
        Plans for every style of trading
      </h2>
      <div className=" flex text-center justify-center">
        Pay yearly and get up to 45% off!
      </div>
      <div className="flex items-center justify-center">
        <div className="relative inline-flex rounded-full bg-gray-200 p-1 m-5">
          <div>
            <div
              className={`absolute top-1 bottom-1 w-1/2 rounded-full bg-primary transition-transform duration-300 ${
                billingCycle === "monthly"
                  ? "translate-x-0"
                  : "translate-x-full"
              }`}
            />
            <button
              type="button"
              onClick={() => toggleBillingCycle()}
              className="relative z-10 px-4 py-2 text-sm font-medium text-gray-700"
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => toggleBillingCycle()}
              className="relative z-10 px-4 py-2 text-sm font-medium text-gray-700"
            >
              Annual
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
