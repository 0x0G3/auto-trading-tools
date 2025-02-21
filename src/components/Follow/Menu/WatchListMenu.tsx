import React from "react";
import ExportImportButton from "../../UI/ExportImportButton";

function WatchListMenu() {
  return (
    <div className="flex items-center justify-between w-full">
      {/* Content next to tabs */}
      <div className="flex items-center space-x-4 ml-8">
        <select className="select select-bordered w-24">
          <option value="1m">1m</option>
          <option value="5m">5m</option>
          <option value="1h">1h</option>
          <option value="6h">6h</option>
          <option value="24h">24h</option>
        </select>
        <input
          type="text"
          placeholder="Search Token"
          className="input input-bordered w-36"
        />
        <input
          type="number"
          placeholder="Amount to Purchase"
          className="input input-bordered w-36"
        />
      </div>

      {/* Export/Import Button */}
      {/* <div className="flex items-center ml-auto">
                  <button className="btn btn-outline">Export/Import</button>
                </div> */}
      <ExportImportButton />
    </div>
  );
}

export default WatchListMenu;
