"use client";

import { useEffect, useState } from 'react';
import { SmileIcon } from "lucide-react";

export function MitigationSuccessRate() {
  const [successRate, setSuccessRate] = useState(0);
  
  useEffect(() => {
    async function fetchSuccessRate() {
      try {
        const response = await fetch('/api/vulnerabilities/mitigation-rate');
        if (!response.ok) {
          throw new Error('Failed to fetch mitigation rate');
        }
        
        const data = await response.json();
        setSuccessRate(data.mitigationRate);
      } catch (error) {
        console.error('Error fetching mitigation rate:', error);
      }
    }
    
    fetchSuccessRate();
  }, []);

  // Calculate the stroke dash offset based on the success rate
  const radius = 75;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (successRate / 100) * circumference;

  return (
    <div>
      <h2 className="text-base font-medium mb-2">Mitigation Success Rate</h2>
      <p className="text-xs text-gray-500 mb-6">Across all vulnerabilities</p>

      <div className="flex justify-center items-center relative">
        <svg width="170" height="170" viewBox="0 0 170 170">
          {/* Background circle */}
          <circle
            cx="85"
            cy="85"
            r={radius}
            fill="none"
            stroke="#e6e6e6"
            strokeWidth="10"
          />
          
          {/* Progress circle */}
          <circle
            cx="85"
            cy="85"
            r={radius}
            fill="none"
            stroke="#8E3A59"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 85 85)"
          />
          
          {/* Center icon */}
          <foreignObject x="60" y="60" width="50" height="50">
            <div className="flex h-full w-full items-center justify-center">
              <SmileIcon className="h-8 w-8 text-[#8E3A59]" />
            </div>
          </foreignObject>
        </svg>
        
        {/* Percentage text */}
        <div className="absolute bottom-0 left-0 right-0 text-center">
          <span className="text-3xl font-bold">{successRate}%</span>
        </div>
      </div>
      
      <div className="flex justify-between text-xs text-gray-500 mt-2">
        <span>0%</span>
        <span>100%</span>
      </div>
    </div>
  );
} 