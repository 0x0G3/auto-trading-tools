import React from "react";
import Toolkits from "./Toolkits";
import Screeners from "./Screeners";
import Aibacktesting from "./Aibacktesting";

export default function InfoCards() {
  return (
    <div>
      <Toolkits />
      <Screeners />
      <Aibacktesting />
    </div>
  );
}
