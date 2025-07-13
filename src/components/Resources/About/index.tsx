import React from "react";
import { useNavigation } from "../../../context/navigation";
import Hero from "../../Hero";

export default function About() {
  const { push } = useNavigation(); // Use the custom navigation context
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="flex flex-row ">
        <Hero
          title="We hvave all typesof backtesting tools"
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
