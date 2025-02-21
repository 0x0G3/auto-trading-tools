import React, { useState } from "react";
import Watchlist from "./tabs/Watchlist";
import Activity from "./tabs/Activity";
import FollowTab from "./tabs/FollowTab";
import Menu from "./Menu";

export default function Follow() {
  const [activeTab, setActiveTab] = useState<string>("watchlist");

  const renderContent = () => {
    switch (activeTab) {
      case "watchlist":
        return <Watchlist />;
      case "follow":
        return <FollowTab />;
      case "activity":
        return <Activity />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col">
      {/* Menu */}
      <div className="navbar bg-base-100 px-6 shadow-md">
        <Menu activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Main Content */}
      <div className="p-6">{renderContent()}</div>
    </div>
  );
}
