import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext"; // Adjust path if needed

export default function Navbar() {
  const { address, isConnected, savedAddresses } = useAuth();

  useEffect(() => {
    if (isConnected) {
      console.log("Connected Wallet Address:", address);
      console.log("Saved Addresses:", savedAddresses);
    }
  }, [isConnected, address, savedAddresses]);

  return (
    <div>
      <div className="navbar bg-base-100 px-6 shadow-md">
        <div className="flex-none">
          <a className="btn btn-ghost text-2xl font-bold">TradeAssist</a>
        </div>

        <div className="flex flex-1 items-center justify-center gap-8">
          <div className="flex items-center space-x-6 md:space-x-8 ml-8">
            <Link
              href="#"
              className="text-sm md:text-lg font-semibold hover:text-blue-500 transition duration-200"
            >
              Meme
            </Link>
            <Link
              href="#"
              className="text-sm md:text-lg font-semibold hover:text-blue-500 transition duration-200"
            >
              New pair
            </Link>
            <Link
              href="#"
              className="text-sm md:text-lg font-semibold hover:text-blue-500 transition duration-200"
            >
              Trending
            </Link>
            <Link
              href="#"
              className="text-sm md:text-lg font-semibold hover:text-blue-500 transition duration-200"
            >
              CopyTrade
            </Link>
            <Link
              href="/holding"
              className="text-sm md:text-lg font-semibold hover:text-blue-500 transition duration-200"
            >
              Holding
            </Link>
            <Link
              href="/follow"
              className="text-sm md:text-lg font-semibold hover:text-blue-500 transition duration-200"
            >
              Follow
            </Link>
          </div>

          <div className="relative flex-1 max-w-md lg:max-w-xl mr-8">
            <input
              type="text"
              placeholder="Search token/contract/wallet"
              className="input input-bordered w-full rounded-full px-4 py-1.5 pl-12 text-base bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M17.75 9a7.75 7.75 0 1 1-15.5 0 7.75 7.75 0 0 1 15.5 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="flex-none">
          <div className="dropdown dropdown-end mx-4">
            <ConnectButton />
          </div>
        </div>
      </div>

      {isConnected && (
        <div className="text-center mt-2 text-sm text-gray-500">
          <p>
            Connected Wallet:{" "}
            <span className="font-bold text-blue-500">{address}</span>
          </p>
          <p>
            Saved Addresses:{" "}
            <span className="font-bold text-blue-500">
              {savedAddresses.join(", ") || "None"}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
