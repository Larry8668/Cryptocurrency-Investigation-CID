import React from "react";
import { PieChart, Pie, ResponsiveContainer } from "recharts";

const CircleGraph = ({ props }) => {
  const { data01, data02 } = props;
  return (
    <div className="w-full h-[150px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data01}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={20}
            fill="#8884d8"
          />
          <Pie
            data={data02}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={20}
            outerRadius={40}
            fill="#82ca9d"
            label
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CircleGraph;
