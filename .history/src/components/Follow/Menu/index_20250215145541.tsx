import React from "react";
import { FaTelegramPlane, FaDiscord } from "react-icons/fa"; // Import Telegram and Discord icons
import ExportImportButton from "../../UI/ExportImportButton";
import FollowMenu from "./FollowMenu";
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

  const renderRightContent = () => {
    switch (activeTab) {
      case "watchlist":
        return (
          <div className="flex items-center justify-between w-full">
            {/* Content next to tabs */}
            <div className="flex items-center space-x-4 ml-8">
              <select className="select select-bordered w-24">
                <option value="1m">1m</option>
                <option value="5m">5m</option>
                <option value="1h">1h</option>
                <option value="6h">6h</option>
                <option value="24h">24h</option>
              </select>
              <input
                type="text"
                placeholder="Search Token"
                className="input input-bordered w-36"
              />
              <input
                type="number"
                placeholder="Amount to Purchase"
                className="input input-bordered w-36"
              />
            </div>

            {/* Export/Import Button */}
            {/* <div className="flex items-center ml-auto">
              <button className="btn btn-outline">Export/Import</button>
            </div> */}
            <ExportImportButton />
          </div>
        );

      case "follow":
        return <FollowMenu />;

      case "activity":
        return <ActivityMenu />;

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
