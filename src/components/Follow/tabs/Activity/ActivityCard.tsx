import React from "react";
import { ethers } from "ethers";
import { Transaction } from "../../../../lib/fetchActivity";

interface ActivityCardProps {
  transaction: Transaction;
}

export default function ActivityCard({ transaction }: ActivityCardProps) {
  const date = new Date(
    parseInt(transaction.timeStamp) * 1000
  ).toLocaleString();
  const valueInEther = ethers.formatEther(transaction.value);

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-sm">
      <p className="text-sm font-semibold">
        {transaction.tokenSymbol
          ? `${transaction.tokenName} (${transaction.tokenSymbol})`
          : "ETH"}{" "}
        Transfer
      </p>
      <p className="text-xs text-gray-600">
        Hash:{" "}
        <a
          href={`https://basescan.org/tx/${transaction.hash}`}
          target="_blank"
          className="text-blue-500"
          rel="noopener noreferrer"
        >
          {transaction.hash.slice(0, 10)}...
        </a>
      </p>
      <p className="text-xs">
        From: {transaction.from.slice(0, 6)}...{transaction.from.slice(-4)}
      </p>
      <p className="text-xs">
        To: {transaction.to.slice(0, 6)}...{transaction.to.slice(-4)}
      </p>
      <p className="text-xs">
        Value: {valueInEther} {transaction.tokenSymbol || "ETH"}
      </p>
      <p className="text-xs text-gray-500">Date: {date}</p>
    </div>
  );
}
