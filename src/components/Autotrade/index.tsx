import React, { useState } from "react";
import Menu from "./Menu";
import Cex from "./tabs/Cex";
import Dex from "./tabs/Dex";
import CexMenu from "./Menu/CexMenu";

export default function AutoTrade() {
  const [activeTab, setActiveTab] = useState<string>("Cex"); // Default to "Cex"

  const renderContent = () => {
    switch (activeTab) {
      case "Cex":
        return <Cex />;
      case "Dex":
        return <Dex />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="navbar bg-base-100 px-6 shadow-md">
        <div className="flex-1">
          <Menu activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        <div className="flex-none">
          <CexMenu /> {/* Always show CexMenu for now */}
        </div>
      </div>
      <div className="p-6 flex-1">{renderContent()}</div>
    </div>
  );
}
