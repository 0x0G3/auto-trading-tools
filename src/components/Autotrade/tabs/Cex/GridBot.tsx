import React, { useState, useEffect } from "react";
import { useBinance } from "../../../../context/BinanceContext";
import {
  GridBotProps,
  BotState,
  BotLog,
  ActiveOrderResponse,
  StatusResponse,
  Order,
} from "../../../../types/gridBot";

const BOT_SERVER_URL = "https://bot.auto-trading-tools.com:3005";

export default function GridBot({
  log,
  updatePriceHistory,
  setActiveOrders,
  setError,
}: GridBotProps) {
  const { apiKey, apiSecret } = useBinance();
  const [symbols, setSymbols] = useState<string[]>(["DOGEUSDT"]);
  const [investment, setInvestment] = useState<number>(2);
  const [percentageDrop, setPercentageDrop] = useState<number>(0.6);
  const [percentageRise, setPercentageRise] = useState<number>(1.2);
  const [intervalMs, setIntervalMs] = useState<number>(2 * 60 * 1000);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [noBuys, setNoBuys] = useState<boolean>(false);
  const [errorCount, setErrorCount] = useState<number>(0);
  const [isPolling, setIsPolling] = useState<boolean>(false);

  const availableSymbols = ["DOGEUSDT", "BTCUSDT", "ETHUSDT", "XRPUSDT"];

  useEffect(() => {
    if (!apiKey || isPolling) return;

    const fetchState = async () => {
      try {
        const response = await fetch(
          `${BOT_SERVER_URL}/status?wallet=${apiKey}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const { states, logs, activeOrders }: StatusResponse =
          await response.json();

        if (states && states.length > 0) {
          const runningSymbols = states
            .filter((state: BotState) => state.is_running)
            .map((state: BotState) => state.symbol);
          setSymbols(runningSymbols.length > 0 ? runningSymbols : ["DOGEUSDT"]);
          setInvestment(states[0].investment || 2);
          setPercentageDrop(states[0].percentage_drop || 0.6);
          setPercentageRise(states[0].percentage_rise || 1.2);
          setIntervalMs(states[0].interval_ms || 2 * 60 * 1000);
          setIsRunning(runningSymbols.length > 0);
          logs.forEach((l: BotLog) => log(l.message));
          const allOrders: Order[] = activeOrders.flatMap(
            (bot: ActiveOrderResponse) =>
              bot.orders.map((order) => ({ ...order, symbol: bot.symbol }))
          );
          setActiveOrders(allOrders);
          setErrorCount(0);
        }
      } catch (err) {
        const errorMsg = (err as Error).message;
        setError(errorMsg);
        log(`Fetch state error: ${errorMsg}`);
        setErrorCount((prev) => {
          const newCount = prev + 1;
          if (newCount >= 5) {
            setIsPolling(false);
            log("Stopped polling due to repeated failures");
          }
          return newCount;
        });
      }
    };

    fetchState();
    setIsPolling(true);
    const intervalId = setInterval(fetchState, 30000);

    return () => {
      clearInterval(intervalId);
      setIsPolling(false);
    };
  }, [apiKey, log, setActiveOrders, setError]);

  const handleToggleBot = async (action: "start" | "stop") => {
    if (!apiKey || !apiSecret) return;
    try {
      const response = await fetch(`${BOT_SERVER_URL}/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wallet: apiKey,
          apiKey,
          apiSecret,
          ...(action === "start" && {
            symbols,
            investment,
            percentageDrop,
            percentageRise,
            intervalMs,
            noBuys,
          }),
        }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to ${action} bot: ${response.status} - ${errorText}`
        );
      }
      setIsRunning(action === "start");
    } catch (err) {
      setError((err as Error).message);
      log(`Toggle bot error: ${(err as Error).message}`);
    }
  };

  const handleSymbolChange = (selectedSymbol: string) => {
    setSymbols((prev) =>
      prev.includes(selectedSymbol)
        ? prev.filter((s) => s !== selectedSymbol)
        : [...prev, selectedSymbol]
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <label className="text-sm">Symbols:</label>
        <div className="flex flex-wrap gap-4">
          {availableSymbols.map((sym) => (
            <div key={sym} className="flex items-center">
              <input
                type="checkbox"
                id={sym}
                value={sym}
                checked={symbols.includes(sym)}
                onChange={() => handleSymbolChange(sym)}
                disabled={isRunning}
                className="checkbox mr-2"
              />
              <label htmlFor={sym} className="text-sm">
                {sym}
              </label>
            </div>
          ))}
        </div>
      </div>
      <div className="flex space-x-4">
        <div>
          <label className="text-sm">Investment (USDT):</label>
          <input
            type="number"
            className="input input-bordered w-24"
            value={investment}
            onChange={(e) => setInvestment(parseFloat(e.target.value) || 0)}
            disabled={isRunning}
            min="1"
          />
        </div>
        <div>
          <label className="text-sm">Drop (%):</label>
          <input
            type="number"
            className="input input-bordered w-24"
            value={percentageDrop}
            onChange={(e) => setPercentageDrop(parseFloat(e.target.value) || 0)}
            disabled={isRunning}
            min="0.1"
            max="10"
            step="0.1"
          />
        </div>
        <div>
          <label className="text-sm">Rise (%):</label>
          <input
            type="number"
            className="input input-bordered w-24"
            value={percentageRise}
            onChange={(e) => setPercentageRise(parseFloat(e.target.value) || 0)}
            disabled={isRunning}
            min="0.1"
            max="10"
            step="0.1"
          />
        </div>
        <div>
          <label className="text-sm">No Buys:</label>
          <input
            type="checkbox"
            className="checkbox"
            checked={noBuys}
            onChange={(e) => setNoBuys(e.target.checked)}
            disabled={isRunning}
          />
        </div>
      </div>
      <div className="flex space-x-4">
        <button
          className="btn btn-primary"
          onClick={() => handleToggleBot("start")}
          disabled={isRunning || symbols.length === 0}
        >
          Start Bot{symbols.length > 1 ? "s" : ""}
        </button>
        <button
          className="btn btn-error"
          onClick={() => handleToggleBot("stop")}
          disabled={!isRunning}
        >
          Stop Bot{symbols.length > 1 ? "s" : ""}
        </button>
      </div>
    </div>
  );
}
// import React, { useState, useEffect } from "react";
// import { useBinance } from "../../../../context/BinanceContext";
// import {
//   GridBotProps,
//   BotState,
//   BotLog,
//   ActiveOrderResponse,
//   StatusResponse,
//   Order,
// } from "../../../../types/gridBot";

// const BOT_SERVER_URL = "https://bot.auto-trading-tools.com:3005";

// export default function GridBot({
//   log,
//   updatePriceHistory,
//   setActiveOrders,
//   setError,
// }: GridBotProps) {
//   const { apiKey, apiSecret } = useBinance();
//   const [symbols, setSymbols] = useState<string[]>(["DOGEUSDT"]);
//   const [investment, setInvestment] = useState<number>(2);
//   const [percentageDrop, setPercentageDrop] = useState<number>(0.6);
//   const [percentageRise, setPercentageRise] = useState<number>(1.2);
//   const [intervalMs, setIntervalMs] = useState<number>(2 * 60 * 1000);
//   const [isRunning, setIsRunning] = useState<boolean>(false);
//   const [noBuys, setNoBuys] = useState<boolean>(false);
//   const [errorCount, setErrorCount] = useState<number>(0);
//   const [isPolling, setIsPolling] = useState<boolean>(false);

//   const availableSymbols = ["DOGEUSDT", "BTCUSDT", "ETHUSDT", "XRPUSDT"];

//   useEffect(() => {
//     if (!apiKey || isPolling) return;

//     const fetchState = async () => {
//       try {
//         const response = await fetch(
//           `${BOT_SERVER_URL}/status?wallet=${apiKey}`
//         );
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         const { states, logs, activeOrders }: StatusResponse =
//           await response.json();

//         if (states && states.length > 0) {
//           const runningSymbols = states
//             .filter((state: BotState) => state.is_running)
//             .map((state: BotState) => state.symbol);
//           setSymbols(runningSymbols.length > 0 ? runningSymbols : ["DOGEUSDT"]);
//           setInvestment(states[0].investment || 2);
//           setPercentageDrop(states[0].percentage_drop || 0.6);
//           setPercentageRise(states[0].percentage_rise || 1.2);
//           setIntervalMs(states[0].interval_ms || 2 * 60 * 1000);
//           setIsRunning(runningSymbols.length > 0);
//           logs.forEach((l: BotLog) => log(l.message));
//           const allOrders: Order[] = activeOrders.flatMap(
//             (bot: ActiveOrderResponse) =>
//               bot.orders.map((order) => ({ ...order, symbol: bot.symbol }))
//           );
//           setActiveOrders(allOrders);
//           setErrorCount(0);
//         }
//       } catch (err) {
//         const errorMsg = (err as Error).message;
//         setError(errorMsg);
//         log(`Fetch state error: ${errorMsg}`);
//         setErrorCount((prev) => {
//           const newCount = prev + 1;
//           if (newCount >= 5) {
//             setIsPolling(false);
//             log("Stopped polling due to repeated failures");
//           }
//           return newCount;
//         });
//       }
//     };

//     fetchState();
//     setIsPolling(true);
//     const intervalId = setInterval(fetchState, 30000);

//     return () => {
//       clearInterval(intervalId);
//       setIsPolling(false);
//     };
//   }, [apiKey, log, setActiveOrders, setError]);

//   const handleToggleBot = async (action: "start" | "stop") => {
//     if (!apiKey || !apiSecret) return;
//     try {
//       const response = await fetch(`${BOT_SERVER_URL}/${action}`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           wallet: apiKey,
//           apiKey,
//           apiSecret,
//           ...(action === "start" && {
//             symbols,
//             investment,
//             percentageDrop,
//             percentageRise,
//             intervalMs,
//             noBuys,
//           }),
//           // No symbol field for "stop" to stop all bots
//         }),
//       });
//       if (!response.ok) throw new Error(`Failed to ${action} bot`);
//       setIsRunning(action === "start");
//     } catch (err) {
//       setError((err as Error).message);
//       log(`Toggle bot error: ${(err as Error).message}`);
//     }
//   };

//   const handleSymbolChange = (selectedSymbol: string) => {
//     setSymbols((prev) =>
//       prev.includes(selectedSymbol)
//         ? prev.filter((s) => s !== selectedSymbol)
//         : [...prev, selectedSymbol]
//     );
//   };

//   return (
//     <div className="space-y-4">
//       <div className="flex flex-col space-y-2">
//         <label className="text-sm">Symbols:</label>
//         <div className="flex flex-wrap gap-4">
//           {availableSymbols.map((sym) => (
//             <div key={sym} className="flex items-center">
//               <input
//                 type="checkbox"
//                 id={sym}
//                 value={sym}
//                 checked={symbols.includes(sym)}
//                 onChange={() => handleSymbolChange(sym)}
//                 disabled={isRunning}
//                 className="checkbox mr-2"
//               />
//               <label htmlFor={sym} className="text-sm">
//                 {sym}
//               </label>
//             </div>
//           ))}
//         </div>
//       </div>
//       <div className="flex space-x-4">
//         <div>
//           <label className="text-sm">Investment (USDT):</label>
//           <input
//             type="number"
//             className="input input-bordered w-24"
//             value={investment}
//             onChange={(e) => setInvestment(parseFloat(e.target.value) || 0)}
//             disabled={isRunning}
//             min="1"
//           />
//         </div>
//         <div>
//           <label className="text-sm">Drop (%):</label>
//           <input
//             type="number"
//             className="input input-bordered w-24"
//             value={percentageDrop}
//             onChange={(e) => setPercentageDrop(parseFloat(e.target.value) || 0)}
//             disabled={isRunning}
//             min="0.1"
//             max="10"
//             step="0.1"
//           />
//         </div>
//         <div>
//           <label className="text-sm">Rise (%):</label>
//           <input
//             type="number"
//             className="input input-bordered w-24"
//             value={percentageRise}
//             onChange={(e) => setPercentageRise(parseFloat(e.target.value) || 0)}
//             disabled={isRunning}
//             min="0.1"
//             max="10"
//             step="0.1"
//           />
//         </div>
//         <div>
//           <label className="text-sm">No Buys:</label>
//           <input
//             type="checkbox"
//             className="checkbox"
//             checked={noBuys}
//             onChange={(e) => setNoBuys(e.target.checked)}
//             disabled={isRunning}
//           />
//         </div>
//       </div>
//       <div className="flex space-x-4">
//         <button
//           className="btn btn-primary"
//           onClick={() => handleToggleBot("start")}
//           disabled={isRunning || symbols.length === 0}
//         >
//           Start Bot{symbols.length > 1 ? "s" : ""}
//         </button>
//         <button
//           className="btn btn-error"
//           onClick={() => handleToggleBot("stop")}
//           disabled={!isRunning}
//         >
//           Stop Bot{symbols.length > 1 ? "s" : ""}
//         </button>
//       </div>
//     </div>
//   );
// }
