import React from "react";

type MenuProps = {
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
};

export default function Menu({ activeTab, setActiveTab }: MenuProps) {
  const tabs = [
    { id: "Cex", label: "CEX Bot" },
    { id: "Dex", label: "DEX Bot" },
  ];

  return (
    <div className="flex items-center w-full">
      <div className="flex items-center space-x-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === tab.id
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-white hover:text-gray-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
