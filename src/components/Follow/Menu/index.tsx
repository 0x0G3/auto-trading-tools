import React from "react";
import FollowMenu from "./FollowMenu";
import WatchListMenu from "./WatchListMenu";
import ActivityMenu from "./ActivityMenu";

type MenuProps = {
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
};

export default function Menu({ activeTab, setActiveTab }: MenuProps) {
  const tabs = [
    { id: "watchlist", label: "Watchlist" },
    { id: "follow", label: "Follow" },
    { id: "activity", label: "Activity" },
  ];

  const handleFilter = (range: string) => {
    console.log("Filter range selected in Menu:", range);
    // Add filtering logic here if Menu manages Activity state
  };

  const handleBuy = () => {
    console.log("Buy action triggered in Menu");
    // Add buy logic here if needed
  };

  const renderRightContent = () => {
    switch (activeTab) {
      case "watchlist":
        return <WatchListMenu />;
      case "follow":
        return <FollowMenu />;
      case "activity":
        return <ActivityMenu onFilter={handleFilter} onBuy={handleBuy} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center w-full">
      {/* Tabs Section */}
      <div className="flex items-center space-x-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === tab.id
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Right-Side Content Section */}
      {renderRightContent()}
    </div>
  );
}
