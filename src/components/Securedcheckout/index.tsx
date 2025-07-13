import React from "react";
import ThirtyDayCard from "./ThirtyDayCard";
import Faq from "../UI/Faq";

export default function Securedcheckout() {
  return (
    <section className=" container mx-3 ">
      <div>safe and secured</div>
      <div>
        Cancel anytime in one click from within your account. A link to get
        instant access is prompted to you directly after signing up. Trade at
        your own risk.
      </div>
      {/* badges */}
      <ThirtyDayCard />
      <Faq />
    </section>
  );
}
