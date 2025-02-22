import React, { useState } from "react";

interface ActivityMenuProps {
  onFilter: (range: string) => void;
  onBuy?: () => void; // optional for future swap intergration
}

export default function ActivityMenu({ onFilter, onBuy }: ActivityMenuProps) {
  const [selectedRange, setSelectedRange] = useState<string>("1-10");

  const handleFilter = () => {
    onFilter(selectedRange);
  };

  const handleRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRange(e.target.value);
  };

  return (
    <div className="flex items-center justify-center space-x-4 w-full py-4">
      <button className="btn btn-outline" onClick={handleFilter}>
        Filter
      </button>
      <select
        className="select select-bordered w-36"
        value={selectedRange}
        onChange={handleRangeChange}
      >
        <option value="1-10">$1 - $10</option>
        <option value="10-50">$10 - $50</option>
        <option value="50-100">$50 - $100</option>
      </select>
      <button className="btn btn-primary" onClick={onBuy}>
        Buy
      </button>
    </div>
  );
}
