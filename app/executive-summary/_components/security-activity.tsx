"use client";

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Box, Cpu, FolderOpen, Shield } from 'lucide-react';

interface ActivityItem {
  name: string;
  count: number;
}

interface ActivityData {
  dailyActivity: ActivityItem[];
  totalAssets: number;
  openVulnerabilities: number;
  closedVulnerabilities: number;
  securedAssets: number;
}

export function SecurityActivity() {
  const [data, setData] = useState<ActivityData>({
    dailyActivity: [],
    totalAssets: 0,
    openVulnerabilities: 0,
    closedVulnerabilities: 0,
    securedAssets: 0
  });
  
  useEffect(() => {
    async function fetchActivityData() {
      try {
        const response = await fetch('/api/vulnerabilities/activity');
        if (!response.ok) {
          throw new Error('Failed to fetch security activity data');
        }
        
        const activityData = await response.json();
        setData(activityData);
      } catch (error) {
        console.error('Error fetching security activity:', error);
      }
    }
    
    fetchActivityData();
  }, []);

  return (
    <div>
      <h2 className="text-base font-medium mb-6">Security Activity</h2>
      <p className="text-xs text-gray-500 mb-4">(Last 7 Days)</p>
      
      <div className="h-[150px] mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data.dailyActivity}
            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 0 }}
            />
            <YAxis 
              hide={true}
              domain={[0, 'dataMax + 100']}
            />
            <Bar dataKey="count" fill="#8E3A59" radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center gap-3 border-b pb-3">
          <div className="bg-purple-100 p-2 rounded-md">
            <Box size={18} className="text-[#8E3A59]" />
          </div>
          <div className="flex-1">
            <span className="text-xs text-gray-500">Total Assets</span>
            <h3 className="text-sm font-semibold">{data.totalAssets}</h3>
          </div>
        </div>
        
        <div className="flex items-center gap-3 border-b pb-3">
          <div className="bg-purple-100 p-2 rounded-md">
            <FolderOpen size={18} className="text-[#8E3A59]" />
          </div>
          <div className="flex-1">
            <span className="text-xs text-gray-500">Open</span>
            <h3 className="text-sm font-semibold">{data.openVulnerabilities}</h3>
          </div>
        </div>
        
        <div className="flex items-center gap-3 border-b pb-3">
          <div className="bg-purple-100 p-2 rounded-md">
            <Cpu size={18} className="text-[#8E3A59]" />
          </div>
          <div className="flex-1">
            <span className="text-xs text-gray-500">Closed</span>
            <h3 className="text-sm font-semibold">{data.closedVulnerabilities}</h3>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-purple-100 p-2 rounded-md">
            <Shield size={18} className="text-[#8E3A59]" />
          </div>
          <div className="flex-1">
            <span className="text-xs text-gray-500">Secured</span>
            <h3 className="text-sm font-semibold">{data.securedAssets}</h3>
          </div>
        </div>
      </div>
    </div>
  );
} 