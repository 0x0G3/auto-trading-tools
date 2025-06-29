import React from "react";

export default function Hero({
  title = "Supercharge your trading strategy",
  description = "Unlock the best trading indicators and AI agent for backtesting used by 15,000+ traders.",
  buttonText = "Get Started!",
  onButtonClick = () => {},
  bgClass = "bg-black",
  textColor = "text-white",
  maxWidth = "max-w-md",
}) {
  return (
    <div className={`hero min-h-screen ${bgClass}`}>
      <div className="hero-content text-center">
        <div className={maxWidth}>
          <h1 className={`text-5xl font-bold ${textColor}`}>{title}</h1>
          <p className={`py-6 ${textColor}`}>{description}</p>
          <button
            className="btn btn-primary rounded-lg"
            onClick={onButtonClick}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
