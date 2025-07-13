import React, { useContext } from "react";
import { PricingContext } from "../../context/pricingContext";
// import { PricingContext } from "./PricingContext";

interface PricingProps {
  badge?: string;
  tier: "basic" | "advance";
}

export default function Pricing({
  badge = "Most Popular",
  tier = "basic",
}: PricingProps) {
  const { billingCycle, pricingData } = useContext(PricingContext);
  const tierData = pricingData[billingCycle as keyof typeof pricingData][tier];
  const price =
    typeof tierData === "object" && "price" in tierData ? tierData.price : "";
  const features = pricingData.features[tier];
  const forwho = pricingData.forwho;

  return (
    <div>
      <div className="card w-96 bg-base-100 shadow-sm">
        <div className="card-body">
          <span className="badge badge-xs badge-warning">{badge}</span>
          <div className="flex justify-between">
            <h2 className="text-3xl font-bold">{tier}</h2>
            <span className="text-xl">{price}</span>
          </div>
          <ul className="mt-6 flex flex-col gap-2 text-xs">
            {features.map((feature, index) => (
              <li key={index}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-4 me-2 inline-block text-success"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <button className="btn btn-primary btn-block">Subscribe</button>
          </div>
        </div>
      </div>
    </div>
  );
}
