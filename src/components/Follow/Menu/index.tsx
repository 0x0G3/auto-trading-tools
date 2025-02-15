import React from "react";
import { FaTelegramPlane, FaDiscord } from "react-icons/fa"; // Import Telegram and Discord icons
import ExportImportButton from "../../UI/ExportImportButton";

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
        return (
          <div className="flex items-center justify-between w-full">
            {/* Content next to tabs */}
            <div className="flex items-center space-x-4 ml-8">
              <div className="relative w-48">
                <input
                  type="text"
                  placeholder="Search Wallet"
                  className="input input-bordered w-full rounded-full px-4 py-1.5 pl-12 text-sm bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <div className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.213 1.988a7.14 7.14 0 017.135 7.234c-.035 3.922-3.28 7.111-7.203 7.082-3.985-.03-7.181-3.276-7.14-7.25.042-3.933 3.253-7.081 7.208-7.066zm-.058 12.61a5.473 5.473 0 005.508-5.412c.04-3.025-2.465-5.536-5.51-5.524-3.007.012-5.45 2.467-5.45 5.476a5.455 5.455 0 005.452 5.46z"
                    />
                    <path d="M16.666 17.795l-1.24-1.24a.75.75 0 010-1.056l.055-.055a.749.749 0 011.056 0l1.24 1.24a.75.75 0 010 1.057l-.054.054a.75.75 0 01-1.057 0z" />
                  </svg>
                </div>
              </div>
              {/* Telegram Button */}
              <button className="btn btn-primary flex items-center space-x-2">
                <FaTelegramPlane className="w-5 h-5" />
                <span>Bot</span>
              </button>
              {/* Discord Button */}
              <button className="btn btn-secondary flex items-center space-x-2">
                <FaDiscord className="w-5 h-5" />
                <span>Bot</span>
              </button>
            </div>

            {/* Export/Import Button */}
            {/* <div className="flex items-center ml-auto">
              <button className="btn btn-outline">Export/Import</button>
            </div> */}
            <ExportImportButton />
          </div>
        );

      case "activity":
        return (
          <div className="flex items-center justify-center space-x-4 w-full">
            <button className="btn btn-outline">Filter</button>
            <select className="select select-bordered w-36">
              <option value="1-10">$1 - $10</option>
              <option value="10-50">$10 - $50</option>
              <option value="50-100">$50 - $100</option>
            </select>
            <button className="btn btn-primary">Buy</button>
          </div>
        );

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
