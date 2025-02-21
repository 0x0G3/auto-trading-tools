import React from "react";
import ExportImportButton from "../../../UI/ExportImportButton";
import TelegramBotButton from "../../../UI/TelegramBotButton";
import DiscordBotButton from "../../../UI/DiscordBotButton";

export default function FollowMenu() {
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
        <TelegramBotButton />
        {/* Discord Button */}
        <DiscordBotButton />
      </div>

      {/* Export/Import Button */}
      {/* <div className="flex items-center ml-auto">
                <button className="btn btn-outline">Export/Import</button>
              </div> */}
      <ExportImportButton />
    </div>
  );
}
