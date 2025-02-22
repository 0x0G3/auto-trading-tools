import React from "react";
import { useAuth } from "../../../../context/AuthContext";
// import { useAuth } from "../../../../../context/AuthContext"; // Adjust path

export default function FollowTab() {
  const { savedAddresses } = useAuth();

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Followed Addresses</h2>
      {savedAddresses.length > 0 ? (
        <ul className="space-y-2">
          {savedAddresses.map((addr, index) => (
            <li key={index} className="p-2 bg-gray-100 rounded">
              {addr}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No addresses followed yet.</p>
      )}
    </div>
  );
}
