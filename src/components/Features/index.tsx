import Link from "next/link";
import React from "react";

export default function Features() {
  return (
    <div>
      <div>
        <div>
          <Link href="/toolkits" className="mx-2">
            toolkits
          </Link>
        </div>
        <div>
          <Link href="/screeners" className="mx-2">
            screeners
          </Link>
        </div>
        <div>
          <Link href="/backtesting" className="mx-2">
            backtesting
          </Link>
        </div>
        <div>
          <Link href="/aibacktesting" className="mx-2">
            aibacktesting
          </Link>
        </div>
      </div>
    </div>
  );
}
