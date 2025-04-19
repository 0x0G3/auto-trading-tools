// /home/grivas/tradingtools/auto-trading-tools/src/components/Autotrade/tabs/Cex/index.tsx
import React, { useState } from "react";
import { useBinance } from "../../../../context/BinanceContext";
import GridBot from "./GridBot";
import SMC_ICT from "./Smc-ict";
import Chart from "../../../UI/Chart";
import { Order, PriceData } from "../../../../types/gridBot";

export default function Cex() {
  const { apiKey, apiSecret } = useBinance();
  const [strategy, setStrategy] = useState<string>("grid");
  const [logs, setLogs] = useState<string[]>([]);
  const [priceHistory, setPriceHistory] = useState<PriceData[]>([]);
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [symbol, setSymbol] = useState<string>("BTCUSDT");
  const [interval, setInterval] = useState<string>("1h");

  const strategies = [
    { id: "grid", label: "Grid Trading" },
    { id: "smc-ict", label: "Smart Money Concepts & Inner Circle Trades" },
  ];

  const log = (message: string) => {
    setLogs((prev) => [
      ...prev.slice(-100),
      `[${new Date().toISOString()}] ${message}`,
    ]);
  };

  const updatePriceHistory = (price: number) => {
    setPriceHistory((prev) => [
      ...prev.slice(-19),
      { time: new Date().toLocaleTimeString(), price },
    ]);
  };

  const renderStrategyContent = () => {
    switch (strategy) {
      case "grid":
        return (
          <GridBot
            apiKey={apiKey}
            apiSecret={apiSecret}
            log={log}
            updatePriceHistory={updatePriceHistory}
            setActiveOrders={setActiveOrders}
            setError={setError}
          />
        );
      case "smc-ict":
        return (
          <SMC_ICT
            apiKey={apiKey}
            apiSecret={apiSecret}
            log={log}
            updatePriceHistory={updatePriceHistory}
            setActiveOrders={setActiveOrders}
            setError={setError}
            symbol={symbol}
            setSymbol={setSymbol}
            interval={interval}
            setInterval={setInterval}
          />
        );
      default:
        return <p className="text-gray-500">Select a strategy to begin.</p>;
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Binance Trading Bot</h2>
      {apiKey && apiSecret ? (
        <div className="space-y-6">
          {/* Strategy Selector */}
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium">Strategy:</label>
            <select
              className="select select-bordered w-48"
              value={strategy}
              onChange={(e) => setStrategy(e.target.value)}
            >
              {strategies.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          {/* Error Message */}
          {error && <p className="text-red-500">{error}</p>}
          {/* Strategy Content */}
          {renderStrategyContent()}
          {/* Chart Section (Full Width) */}
          <div className="w-full">
            <h4 className="text-md font-medium mb-2">Price Trend</h4>
            <Chart
              symbol={symbol}
              interval={interval}
              priceHistory={priceHistory}
              updatePriceHistory={updatePriceHistory}
              className="h-96"
            />
          </div>
          {/* Active Orders and Activity Log (Side-by-Side) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-md font-medium mb-2">Active Orders</h4>
              <div className="max-h-64 overflow-y-auto bg-gray-100 p-2 rounded">
                {activeOrders.length === 0 ? (
                  <p className="text-xs text-gray-500">No active orders</p>
                ) : (
                  activeOrders.map((order) => (
                    <p key={order.orderId} className="text-xs text-gray-700">
                      Order ID: {order.orderId}, Price: $
                      {order.price.toFixed(4)}, Quantity: {order.quantity}
                    </p>
                  ))
                )}
              </div>
            </div>
            <div>
              <h4 className="text-md font-medium mb-2">Activity Log</h4>
              <div className="max-h-64 overflow-y-auto bg-gray-100 p-2 rounded">
                {logs
                  .slice()
                  .reverse()
                  .map((logEntry, index) => (
                    <p key={index} className="text-xs text-gray-700">
                      {logEntry}
                    </p>
                  ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">
          Enter your Binance API keys in the menu to start trading.
        </p>
      )}
    </div>
  );
}
// // /home/grivas/tradingtools/auto-trading-tools/src/components/Autotrade/tabs/Cex/index.tsx
// import React, { useState } from "react";
// import { useBinance } from "../../../../context/BinanceContext";
// import GridBot from "./GridBot";
// import SMC_ICT from "./Smc-ict";
// // import Chart from "../../ui/Chart";
// import { Order, PriceData } from "../../../../types/gridBot";
// import Chart from "../../../UI/Chart";

// export default function Cex() {
//   const { apiKey, apiSecret } = useBinance();
//   const [strategy, setStrategy] = useState<string>("grid");
//   const [logs, setLogs] = useState<string[]>([]);
//   const [priceHistory, setPriceHistory] = useState<PriceData[]>([]);
//   const [activeOrders, setActiveOrders] = useState<Order[]>([]);
//   const [error, setError] = useState<string | null>(null);
//   const [symbol, setSymbol] = useState<string>("BTCUSDT");
//   const [interval, setInterval] = useState<string>("1h");

//   const strategies = [
//     { id: "grid", label: "Grid Trading" },
//     { id: "smc-ict", label: "Smart Money Concepts & Inner Circle Trades" },
//   ];

//   const log = (message: string) => {
//     setLogs((prev) => [
//       ...prev.slice(-100),
//       `[${new Date().toISOString()}] ${message}`,
//     ]);
//   };

//   const updatePriceHistory = (price: number) => {
//     setPriceHistory((prev) => [
//       ...prev.slice(-19),
//       { time: new Date().toLocaleTimeString(), price },
//     ]);
//   };

//   const renderStrategyContent = () => {
//     switch (strategy) {
//       case "grid":
//         return (
//           <GridBot
//             apiKey={apiKey}
//             apiSecret={apiSecret}
//             log={log}
//             updatePriceHistory={updatePriceHistory}
//             setActiveOrders={setActiveOrders}
//             setError={setError}
//           />
//         );
//       case "smc-ict":
//         return (
//           <SMC_ICT
//             apiKey={apiKey}
//             apiSecret={apiSecret}
//             log={log}
//             updatePriceHistory={updatePriceHistory}
//             setActiveOrders={setActiveOrders}
//             setError={setError}
//             symbol={symbol}
//             setSymbol={setSymbol}
//             interval={interval}
//             setInterval={setInterval}
//           />
//         );
//       default:
//         return <p className="text-gray-500">Select a strategy to begin.</p>;
//     }
//   };

//   return (
//     <div className="p-4">
//       <h2 className="text-xl font-semibold mb-4">Binance Trading Bot</h2>
//       {apiKey && apiSecret ? (
//         <div className="space-y-6">
//           <div className="flex items-center space-x-4">
//             <label className="text-sm font-medium">Strategy:</label>
//             <select
//               className="select select-bordered w-48"
//               value={strategy}
//               onChange={(e) => setStrategy(e.target.value)}
//             >
//               {strategies.map((s) => (
//                 <option key={s.id} value={s.id}>
//                   {s.label}
//                 </option>
//               ))}
//             </select>
//           </div>
//           {error && <p className="text-red-500">{error}</p>}
//           {renderStrategyContent()}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <h4 className="text-md font-medium mb-2">Price Trend</h4>
//               <Chart priceHistory={priceHistory} className="h-64" />
//             </div>
//             <div>
//               <h4 className="text-md font-medium mb-2">Active Orders</h4>
//               <div className="max-h-64 overflow-y-auto bg-gray-100 p-2 rounded">
//                 {activeOrders.length === 0 ? (
//                   <p className="text-xs text-gray-500">No active orders</p>
//                 ) : (
//                   activeOrders.map((order) => (
//                     <p key={order.orderId} className="text-xs text-gray-700">
//                       Order ID: {order.orderId}, Price: $
//                       {order.price.toFixed(4)}, Quantity: {order.quantity}
//                     </p>
//                   ))
//                 )}
//               </div>
//             </div>
//           </div>
//           <div>
//             <h4 className="text-md font-medium mb-2">Activity Log</h4>
//             <div className="max-h-64 overflow-y-auto bg-gray-100 p-2 rounded">
//               {logs
//                 .slice()
//                 .reverse()
//                 .map((logEntry, index) => (
//                   <p key={index} className="text-xs text-gray-700">
//                     {logEntry}
//                   </p>
//                 ))}
//             </div>
//           </div>
//         </div>
//       ) : (
//         <p className="text-gray-500">
//           Enter your Binance API keys in the menu to start trading.
//         </p>
//       )}
//     </div>
//   );
// }
