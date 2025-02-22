import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext"; // Assuming this path is correct

export default function ExportImportButton() {
  const { savedAddresses, saveAddresses } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [address, setAddress] = useState("");
  const [importData, setImportData] = useState("");

  // Add a single address
  const handleAddAddress = async () => {
    if (!address.trim()) {
      alert("Please enter a valid address");
      return;
    }
    const newAddresses = [...savedAddresses, address.trim()];
    try {
      await saveAddresses(newAddresses);
      setAddress("");
      setIsModalOpen(false);
    } catch (error) {
      alert("Failed to save address");
    }
  };

  // Export addresses as JSON
  const handleExport = () => {
    const json = JSON.stringify(savedAddresses, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "followed_addresses.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import addresses from JSON
  const handleImport = async () => {
    if (!importData.trim()) {
      alert("Please paste valid JSON data");
      return;
    }
    try {
      const imported = JSON.parse(importData);
      if (!Array.isArray(imported)) {
        throw new Error("Invalid format: must be an array of addresses");
      }
      const newAddresses = [...new Set([...savedAddresses, ...imported])];
      await saveAddresses(newAddresses);
      setImportData("");
      setIsModalOpen(false);
    } catch (error) {
      alert("Failed to import addresses: " + (error as Error).message);
    }
  };

  return (
    <div>
      {/* Export/Import Button */}
      <div className="flex items-center ml-auto">
        <button
          className="btn btn-outline"
          onClick={() => setIsModalOpen(true)}
        >
          Export/Import
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-96">
            <h3 className="text-lg font-semibold mb-4">
              Manage Followed Addresses
            </h3>

            {/* Add Address */}
            <div className="mb-4">
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter wallet address"
                className="input input-bordered w-full mb-2"
              />
              <button
                onClick={handleAddAddress}
                className="btn btn-primary w-full"
              >
                Add Address
              </button>
            </div>

            {/* Import Addresses */}
            <div className="mb-4">
              <textarea
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                placeholder='Paste JSON (e.g., ["0x123...", "0x456..."])'
                className="textarea textarea-bordered w-full h-24 mb-2"
              />
              <button
                onClick={handleImport}
                className="btn btn-secondary w-full"
              >
                Import
              </button>
            </div>

            {/* Export Button */}
            <button
              onClick={handleExport}
              className="btn btn-outline w-full mb-4"
            >
              Export
            </button>

            {/* Close Modal */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="btn btn-ghost w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
