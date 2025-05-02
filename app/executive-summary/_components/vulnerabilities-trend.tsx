"use client";

import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

interface TrendDataPoint {
  month: string;
  count: number;
}

export function VulnerabilitiesTrend() {
  const [trendData, setTrendData] = useState<TrendDataPoint[]>([]);
  
  useEffect(() => {
    async function fetchTrendData() {
      try {
        const response = await fetch('/api/vulnerabilities/trend');
        if (!response.ok) {
          throw new Error('Failed to fetch vulnerability trend data');
        }
        
        const data = await response.json();
        setTrendData(data.trend);
      } catch (error) {
        console.error('Error fetching vulnerability trend:', error);
      }
    }
    
    fetchTrendData();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-base font-medium">Vulnerabilities Trend</h2>
        <span className="text-xs text-gray-500">(+5 this year)</span>
      </div>
      
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={trendData}
            margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8E3A59" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8E3A59" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10 }}
            />
            <YAxis 
              hide={true}
              domain={[0, 'dataMax + 100']}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#8E3A59"
              fillOpacity={1}
              fill="url(#colorCount)"
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      {/* Legend with horizontal dashed lines */}
      <div className="mt-2">
        <div className="flex justify-between items-center">
          <div className="flex-1 h-px border-t border-dashed border-[#8E3A59] opacity-50" />
          <span className="mx-2 text-xs text-gray-500">500</span>
        </div>
        <div className="flex justify-between items-center mt-6">
          <div className="flex-1 h-px border-t border-dashed border-[#8E3A59] opacity-50" />
          <span className="mx-2 text-xs text-gray-500">300</span>
        </div>
        <div className="flex justify-between items-center mt-6">
          <div className="flex-1 h-px border-t border-dashed border-[#8E3A59] opacity-50" />
          <span className="mx-2 text-xs text-gray-500">200</span>
        </div>
        <div className="flex justify-between items-center mt-6">
          <div className="flex-1 h-px border-t border-dashed border-[#8E3A59] opacity-50" />
          <span className="mx-2 text-xs text-gray-500">100</span>
        </div>
      </div>
    </div>
  );
} 