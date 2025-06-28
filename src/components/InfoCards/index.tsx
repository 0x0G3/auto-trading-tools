import React from "react";
import Toolkits from "./Toolkits";
import Screeners from "./Screeners";
import Aibacktesting from "./Aibacktesting";

export default function InfoCards() {
  return (
    <div className="flex flex-col gap-4">
      <Toolkits />
      <Screeners />
      <Aibacktesting />
    </div>
  );
}
