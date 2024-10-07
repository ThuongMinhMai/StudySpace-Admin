/** @format */
"use client";
import { formatPrice } from "@/lib/utils";
// import { MonthRevenue } from "@/types";
import {
  Bar,
  BarChart as BarGraph,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
interface MonthRevenue {
  month: string; // Format: "MM/YYYY"
  transactionInMonth: number;
  revenueInMonth: number;
}
interface BarChartProps {
  data: MonthRevenue[] | undefined;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip bg-white border p-3">
        <p className="label">{`Month: ${label}`}</p>
        <p className="intro">{`Revenue: ${formatPrice(payload[0].value)}`}</p>
      </div>
    );
  }

  return null;
};

export default function BarChartManager({ data }: BarChartProps) {
  // Ensure the component renders correctly when data is undefined or empty
  if (!data || data.length === 0) {
    return <p>No data available</p>;
  }

  return (
    <ResponsiveContainer width={"100%"} height={350}>
      <BarGraph data={data}>
        <XAxis
          dataKey={"month"} // Correct key name based on the interface
          tickLine={false}
          axisLine={false}
          stroke="#888888"
          fontSize={12}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          stroke="#88888"
          fontSize={12}
          tickFormatter={(value) => formatPrice(value)}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar
          dataKey={"revenueInMonth"} // Correct key name based on the interface
          radius={[4, 4, 0, 0]}
          fill="#8884d8" // Add a fill color for the bars
        />
      </BarGraph>
    </ResponsiveContainer>
  );
}
