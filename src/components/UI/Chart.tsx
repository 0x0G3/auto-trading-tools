// /home/grivas/tradingtools/auto-trading-tools/src/components/UI/Chart.tsx
import React, { useState, useEffect, useRef } from "react";
import {
  createChart,
  ColorType,
  IChartApi,
  CandlestickSeries,
  CandlestickData,
  WhitespaceData,
  Time,
} from "lightweight-charts";
import { PriceData } from "../../types/gridBot";

interface ChartProps {
  symbol: string; // Trading pair (e.g., 'BTCUSDT')
  interval: string; // Timeframe (e.g., '1h', '4h')
  priceHistory: PriceData[]; // Current price history for compatibility
  updatePriceHistory: (price: number) => void; // Update price history
  height?: number; // Chart height (default: 384px to match h-96)
  className?: string; // Optional CSS class for styling
}

const BOT_SERVER_URL = "https://bot.auto-trading-tools.com:3006"; // Corrected to remove /premium

// Mock OHLC data for local testing with unique, ascending timestamps
const MOCK_OHLC_DATA = [
  {
    time: new Date(Date.now() - 3600000 * 5).toISOString(),
    open: 50000,
    high: 50500,
    low: 49500,
    close: 50200,
  },
  {
    time: new Date(Date.now() - 3600000 * 4).toISOString(),
    open: 50200,
    high: 50800,
    low: 50000,
    close: 50600,
  },
  {
    time: new Date(Date.now() - 3600000 * 3).toISOString(),
    open: 50600,
    high: 51000,
    low: 50300,
    close: 50400,
  },
  {
    time: new Date(Date.now() - 3600000 * 2).toISOString(),
    open: 50400,
    high: 50700,
    low: 50100,
    close: 50500,
  },
  {
    time: new Date(Date.now() - 3600000 * 1).toISOString(),
    open: 50500,
    high: 50900,
    low: 50400,
    close: 50800,
  },
];

const Chart: React.FC<ChartProps> = ({
  symbol,
  interval,
  priceHistory,
  updatePriceHistory,
  height = 384,
  className = "",
}) => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  // Fetch candlestick data
  useEffect(() => {
    const fetchKlines = async () => {
      try {
        const response = await fetch(
          `${BOT_SERVER_URL}/klines?symbol=${symbol}&interval=${interval}&limit=100`
        );
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        // Sort data by time in ascending order
        const sortedData = data.sort(
          (a: any, b: any) =>
            new Date(a.time).getTime() - new Date(b.time).getTime()
        );
        setChartData(sortedData);
        setError(null);
        if (sortedData.length > 0) {
          updatePriceHistory(sortedData[sortedData.length - 1].close); // Update price history
        }
      } catch (err) {
        console.error("Fetch klines error:", err);
        setError("Failed to fetch candlestick data. Using mock data.");
        // Sort mock data by time in ascending order
        const sortedMockData = MOCK_OHLC_DATA.sort(
          (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
        );
        setChartData(sortedMockData);
        if (sortedMockData.length > 0) {
          updatePriceHistory(sortedMockData[sortedMockData.length - 1].close);
        }
      }
    };
    fetchKlines();
  }, [symbol, interval, updatePriceHistory]);

  useEffect(() => {
    if (chartContainerRef.current && chartData.length > 0) {
      const chart = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height,
        layout: {
          background: { type: ColorType.Solid, color: "#ffffff" },
          textColor: "#333",
        },
        grid: {
          vertLines: { color: "#e0e0e0" },
          horzLines: { color: "#e0e0e0" },
        },
      });

      const candlestickSeries = chart.addSeries(CandlestickSeries, {
        upColor: "#26a69a",
        downColor: "#ef5350",
        borderVisible: false,
        wickUpColor: "#26a69a",
        wickDownColor: "#ef5350",
      });

      // Apply type assertion to resolve the error
      candlestickSeries.setData(
        chartData.map((candle) => ({
          time: new Date(candle.time).getTime() / 1000,
          open: candle.open,
          high: candle.high,
          low: candle.low,
          close: candle.close,
        })) as (CandlestickData<Time> | WhitespaceData<Time>)[]
      );

      chart.timeScale().fitContent();

      const handleResize = () => {
        if (chartContainerRef.current) {
          chart.applyOptions({ width: chartContainerRef.current.clientWidth });
        }
      };
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        chart.remove();
      };
    }
  }, [chartData, height]);

  return (
    <div className={`w-full ${className}`} style={{ height }}>
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      <div
        ref={chartContainerRef}
        className="w-full"
        style={{ height: error ? `calc(${height}px - 24px)` : height }}
      />
    </div>
  );
};

export default Chart;
