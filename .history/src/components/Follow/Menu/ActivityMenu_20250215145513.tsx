import React from "react";

function ActivityMenu() {
  return (
    <div className="flex items-center justify-center space-x-4 w-full">
      <button className="btn btn-outline">Filter</button>
      <select className="select select-bordered w-36">
        <option value="1-10">$1 - $10</option>
        <option value="10-50">$10 - $50</option>
        <option value="50-100">$50 - $100</option>
      </select>
      <button className="btn btn-primary">Buy</button>
    </div>
  );
}

export default ActivityMenu;
