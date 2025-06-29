import React from "react";
import Paconcepts from "./Paconcepts";
import Signalsandoverlay from "./Signalsandoverlay";
import Benefitcard from "./Benefitcard";
import Hero from "../../Hero";
// import { useRouter } from "next/navigation";
import { useNavigation } from "../../../context/navigation";
export default function Toolkits() {
  // const router = useRouter();
  const { push } = useNavigation(); // Use the custom navigation context
  return (
    <div>
      <div>
        <Hero
          title="Choose Your Plan"
          description="Explore our flexible pricing options for traders of all levels."
          buttonText="View Plans"
          onButtonClick={() => push("")}
          bgClass="bg-gradient-to-r from-blue-500 to-purple-500"
          textColor="text-white"
          maxWidth="max-w-lg"
        />
      </div>
      <div>
        <Paconcepts />
      </div>
      <div>
        <Signalsandoverlay />
      </div>
      <div>
        <Benefitcard />
      </div>
    </div>
  );
}
