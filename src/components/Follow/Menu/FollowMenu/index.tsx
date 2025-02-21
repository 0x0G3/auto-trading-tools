import React from "react";
import ExportImportButton from "../../../UI/ExportImportButton";
import TelegramBotButton from "../../../UI/TelegramBotButton";
import DiscordBotButton from "../../../UI/DiscordBotButton";
import InputWallet from "./InputWallet";

export default function FollowMenu() {
  return (
    <div className="flex items-center justify-between w-full">
      {/* Content next to tabs */}
      <div className="flex items-center space-x-4 ml-8">
        <InputWallet />
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
