import React, { PureComponent } from "react";
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default class Example extends PureComponent {
  static demoUrl =
    "https://codesandbox.io/s/pie-chart-with-padding-angle-7ux0o";

  constructor(props) {
    super(props);
    this.state = {
      innerRadius: 20,
      outerRadius: 40,
    };
  }

  componentDidMount() {
    window.addEventListener("resize", this.updateRadius);
    this.updateRadius();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateRadius);
  }

  updateRadius = () => {
    this.setState({
      innerRadius: window.innerWidth / 12,
      outerRadius: window.innerWidth / 10,
    });
  };
  render() {
    const data = this.props.data || [];

    return (
      <ResponsiveContainer>
        <PieChart onMouseEnter={this.onPieEnter}>
          <Pie
            data={data}
            startAngle={180}
            endAngle={0}
            innerRadius={this.state.innerRadius}
            outerRadius={this.state.outerRadius}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    );
  }
}
