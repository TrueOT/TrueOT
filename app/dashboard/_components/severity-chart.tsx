"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";

// Define initial empty data structure and colors
const COLORS = {
  "CRITICAL": "#FF4444",  // Bright Red
  "HIGH": "#FF8C00",      // Orange
  "MEDIUM": "#FFD700",    // Yellow
  "LOW": "#4169E1",       // Royal Blue
};

export function SeverityChart() {
  const [chartData, setChartData] = useState([
    { name: "Critical", value: 0, color: COLORS.CRITICAL },
    { name: "High", value: 0, color: COLORS.HIGH },
    { name: "Medium", value: 0, color: COLORS.MEDIUM },
    { name: "Low", value: 0, color: COLORS.LOW },
  ]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    async function fetchRiskLevelData() {
      try {
        const response = await fetch('/api/vulnerabilities/statistics');
        if (!response.ok) {
          throw new Error('Failed to fetch risk level data');
        }
        
        const data = await response.json();
        const { riskLevelCounts, total } = data;
        
        // Update chart data with actual counts
        setChartData([
          { name: "Critical", value: riskLevelCounts.CRITICAL || 0, color: COLORS.CRITICAL },
          { name: "High", value: riskLevelCounts.HIGH || 0, color: COLORS.HIGH },
          { name: "Medium", value: riskLevelCounts.MEDIUM || 0, color: COLORS.MEDIUM },
          { name: "Low", value: riskLevelCounts.LOW || 0, color: COLORS.LOW },
        ]);
        
        setTotalCount(total);
      } catch (error) {
        console.error('Error fetching risk level data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchRiskLevelData();
  }, []);

  // Calculate highest percentage for display (or show total)
  const highestCategory = chartData.reduce((max, item) => 
    item.value > max.value ? item : max, chartData[0]);
    
  const highestPercentage = totalCount > 0 
    ? Math.round((highestCategory.value / totalCount) * 100) 
    : 0;

  return (
    <div>
      <h3 className="text-base font-medium mb-8">Severity Distribution Overview</h3>
      <div className="relative h-[120px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
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
              {chartData.map((entry, index) => (
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
          {!isLoading && highestPercentage > 0 && (
            <div className="text-3xl font-semibold">{highestPercentage}%</div>
          )}
        </div>
      </div>
      {/* Legend */}
      <div className="flex items-center justify-center gap-3 mt-4">
        {chartData.map((item) => (
          <div key={item.name} className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-xs">{item.name} {item.value > 0 && `(${item.value})`}</span>
          </div>
        ))}
      </div>
    </div>
  );
} 