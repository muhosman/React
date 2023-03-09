import React, { PureComponent } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "Ocak",
    Kazanç: 4000,
  },
  {
    name: "Şubat",
    Kazanç: 3000,
  },
  {
    name: "Mart",
    Kazanç: 2000,
  },
  {
    name: "Nisan",
    Kazanç: 2780,
  },
  {
    name: "Mayıs",
    Kazanç: 1890,
  },
  {
    name: "Haziran",
    Kazanç: 2390,
  },
];

export default class Example extends PureComponent {
  static demoUrl = "https://codesandbox.io/s/simple-line-chart-kec3v";

  render() {
    return (
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Kazanç" stroke="#004080" />
        </LineChart>
      </ResponsiveContainer>
    );
  }
}
