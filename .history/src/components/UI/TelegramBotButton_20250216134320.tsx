import React from "react";
import { FaTelegramPlane } from "react-icons/fa";

function TelegramBotButton() {
  return (
    <button className="btn btn-primary flex items-center space-x-2">
      <FaTelegramPlane className="w-5 h-5" />
      <span>Bot</span>
    </button>
  );
}

export default TelegramBotButton;
