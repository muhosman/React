import React, { PureComponent } from "react";
import styles from "../../CustomStyles";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Brush,
  AreaChart,
  Area,
  Bar,
  ResponsiveContainer,
} from "recharts";

export default function Example({ data, bars }) {
  return (
    <ResponsiveContainer>
      <LineChart
        width={500}
        height={200}
        data={data}
        syncId="anyId"
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" strokeWidth={2} />{" "}
        {/* X eksen çizgi kalınlığını 2 olarak ayarlayın */}
        <YAxis strokeWidth={2} />
        <Tooltip />
        <Brush
          fill="#93C6E7" // Brush doldurma rengi
          stroke="#004080" // Brush çizgi rengi
          opacity={1} // Brush opaklığı
        />
        <Legend />
        {bars?.map((bar, index) => (
          <Line
            type="monotone"
            key={index}
            dataKey={bar.dataKey}
            stroke={bar.fill}
            fill={bar.fill}
            strokeWidth={2} // Çizgi kalınlığını 3 olarak ayarlayın
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
