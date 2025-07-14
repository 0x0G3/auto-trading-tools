import React from "react";
import ThirtyDayCard from "./ThirtyDayCard";
import Faq from "../UI/Faq";
import { FaPaypal } from "react-icons/fa";
import { FaCcAmazonPay } from "react-icons/fa";
import { FaApplePay } from "react-icons/fa";
import { FaCcMastercard } from "react-icons/fa";

export default function Securedcheckout() {
  return (
    <section className=" flex flex-col container mx-3 ">
      <div className="flex flex-row place-content-between  mx-24">
        <h2 className="flex flex-row text-5xl text-bold">safe and secured</h2>
        <ThirtyDayCard />
      </div>
      <div className="flex flex-row text-8xl">
        <FaApplePay />
        <FaPaypal />
        <FaCcAmazonPay />
        <FaCcMastercard />
      </div>
      <div>
        Cancel anytime in one click from within your account. A link to get
        instant access is prompted to you directly after signing up. Trade at
        your own risk.
      </div>
      {/* badges */}
      <Faq />
    </section>
  );
}
