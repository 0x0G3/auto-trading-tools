import React from "react";
import Hero from "../../Hero";
import { useNavigation } from "../../../context/navigation";

export default function Aibacktesting() {
  const { push } = useNavigation(); // Use the custom navigation context

  return (
    <div>
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
  );
}
