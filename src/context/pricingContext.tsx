import React, { createContext, useState } from "react";

type PricingDataType = {
  monthly: {
    basic: { price: string };
    advance: { price: string };
  };
  forwho: {
    basic: string;
    advance: string;
  };
  annual: {
    basic: { price: string };
    advance: { price: string };
  };
  features: {
    basic: string[];
    advance: string[];
  };
};

type PricingContextType = {
  billingCycle: string;
  toggleBillingCycle: () => void;
  pricingData: PricingDataType;
};

export const PricingContext = createContext<PricingContextType>({
  billingCycle: "monthly",
  toggleBillingCycle: () => {},
  pricingData: {
    monthly: {
      basic: { price: "" },
      advance: { price: "" },
    },
    forwho: {
      basic: "",
      advance: "",
    },
    annual: {
      basic: { price: "" },
      advance: { price: "" },
    },
    features: {
      basic: [],
      advance: [],
    },
  },
});

export const PricingProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [billingCycle, setBillingCycle] = useState("monthly");

  const toggleBillingCycle = () => {
    setBillingCycle((prev) => (prev === "monthly" ? "annual" : "monthly"));
  };

  const pricingData = {
    monthly: {
      basic: { price: "$10/month" },
      advance: { price: "$20/month" },
    },
    forwho: {
      basic: "For active traders, the best set of indicators & signals.",
      advance: "For data-driven traders, advanced backtesting with AI.",
    },
    annual: {
      basic: { price: "$100/year" },
      advance: { price: "$200/year" },
    },
    features: {
      basic: [
        "Feature 1",
        "Feature 2",
        "Feature 3",
        "Feature 5",
        "Feature 6",
        "Feature 7",
      ],
      advance: [
        "All Basic Features",
        "Advanced Analytics",
        "Priority Support",
        "Custom Reports",
        "Feature 6",
        "Feature 7",
      ],
    },
  };

  return (
    <PricingContext.Provider
      value={{ billingCycle, toggleBillingCycle, pricingData }}
    >
      {children}
    </PricingContext.Provider>
  );
};
