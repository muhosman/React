import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Example({ data, bars }) {
  return (
    <ResponsiveContainer>
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={"name"} />
        <YAxis stroke="#00407d" />
        <Tooltip />
        <Legend />
        {bars.map((bar, index) => (
          <Bar key={index} dataKey={bar.dataKey} fill={bar.fill} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
