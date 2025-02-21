import React, { useState } from "react";
import { useFollow } from "../../context/Follow";

export default function ExportImportButton() {
  const { setAddresses } = useFollow();
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [address, setAddress] = useState("");

  return (
    <div>
      {/* export/import button */}
      <div className="flex items-center ml-auto">
        <button
          className="btn btn-outline"
          onClick={() => setIsModelOpen(true)}
        >
          Export/Import
        </button>
      </div>
      {/* Modal for adding addresses */}
      {isModelOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-80">
            <h3 className=""></h3>
          </div>
        </div>
      )}
    </div>
  );
}
