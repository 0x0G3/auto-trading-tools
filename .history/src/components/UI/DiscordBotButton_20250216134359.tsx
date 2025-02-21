import React from "react";
import { FaDiscord } from "react-icons/fa";

function DiscordBotButton() {
  return (
    <button className="btn btn-secondary flex items-center space-x-2">
      <FaDiscord className="w-5 h-5" />
      <span>Bot</span>
    </button>
  );
}

export default DiscordBotButton;
