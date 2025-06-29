import React from "react";
import Hero from "../../Hero";
import { useNavigation } from "../../../context/navigation";

export default function Backtesting() {
  const { push } = useNavigation(); // Use the custom navigation context

  return (
    <div>
      <div>
        <Hero
          title="We hvave all types of screeners"
          description="Explore our screeners."
          buttonText="View Screeners"
          onButtonClick={() => push("/pricing")}
          bgClass="bg-gradient-to-r from-blue-500 to-purple-500"
          textColor="text-white"
          maxWidth="max-w-lg"
        />
      </div>
    </div>
  );
}
