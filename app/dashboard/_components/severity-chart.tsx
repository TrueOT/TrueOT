"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const data = [
  { name: "Critical", value: 20, color: "#FF4444" },  // Bright Red
  { name: "High", value: 30, color: "#FF8C00" },      // Orange
  { name: "Medium", value: 30, color: "#FFD700" },    // Yellow
  { name: "Low", value: 20, color: "#4169E1" },       // Royal Blue
];

export function SeverityChart() {
  return (
    <div>
      <h3 className="text-base font-medium mb-8">Severity Distribution Overview</h3>
      <div className="relative h-[120px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="100%"
              startAngle={180}
              endAngle={0}
              innerRadius={90}
              outerRadius={110}
              paddingAngle={0}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        {/* Percentage Display */}
        <div 
          className="absolute"
          style={{
            top: "30%",
            left: "50%",
            transform: "translate(-50%, -50%)"
          }}
        >
          {/* <div className="text-3xl font-semibold">77%</div> */}
        </div>
      </div>
      {/* Legend */}
      <div className="flex items-center justify-center gap-3 mt-4">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-[#FF4444]" />
          <span className="text-xs">Critical</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-[#FF8C00]" />
          <span className="text-xs">High</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-[#FFD700]" />
          <span className="text-xs">Medium</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-[#4169E1]" />
          <span className="text-xs">Low</span>
        </div>
      </div>
    </div>
  );
} 