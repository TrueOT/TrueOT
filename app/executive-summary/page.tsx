import { BarChart3, AlertTriangle, AlertCircle, CheckCircle2, SmileIcon, Box, Cpu, FolderOpen, Shield } from "lucide-react";
import { prisma } from "@/lib/db/prisma";

export default async function ExecutiveSummaryPage() {
  // Get total count from VulnerabilityAnalysis table
  const vulnerabilityCount = await prisma.vulnerabilityAnalysis.count();
  
  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-lg flex justify-between items-center bg-[#8E3A59]">
          <div>
            <h3 className="text-sm font-medium text-white">Total Devices</h3>
            <p className="text-3xl font-bold text-white mt-2">{vulnerabilityCount}</p>
          </div>
          <div className="text-white opacity-80">
            <BarChart3 size={24} />
          </div>
        </div>
        
        <div className="p-6 rounded-lg flex justify-between items-center bg-[#8E3A59]">
          <div>
            <h3 className="text-sm font-medium text-white">Critical Vulnerabilities</h3>
            <p className="text-3xl font-bold text-white mt-2">0</p>
          </div>
          <div className="text-white opacity-80">
            <AlertTriangle size={24} />
          </div>
        </div>
        
        <div className="p-6 rounded-lg flex justify-between items-center bg-[#8E3A59]">
          <div>
            <h3 className="text-sm font-medium text-white">Open Vulnerabilities</h3>
            <p className="text-3xl font-bold text-white mt-2">5</p>
          </div>
          <div className="text-white opacity-80">
            <AlertCircle size={24} />
          </div>
        </div>
        
        <div className="p-6 rounded-lg flex justify-between items-center bg-[#8E3A59]">
          <div>
            <h3 className="text-sm font-medium text-white">Mitigated Vulnerabilities</h3>
            <p className="text-3xl font-bold text-white mt-2">6</p>
          </div>
          <div className="text-white opacity-80">
            <CheckCircle2 size={24} />
          </div>
        </div>
      </div>
      
      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Welcome Section */}
        <div className="lg:col-span-1 bg-slate-50 p-8 rounded-lg">
          <h2 className="text-base font-medium mb-2">Welcome back,</h2>
          <h1 className="text-2xl font-bold mb-6">Test3</h1>
          
          <p className="text-sm text-gray-700">
            System status is ready. It is time to manage vulnerabilities.
          </p>
          
          <div className="flex mt-8">
            <button className="text-sm text-gray-500 flex items-center gap-1">
              Tap to start →
            </button>
          </div>
        </div>
        
        {/* Mitigation Success Rate */}
        <div className="lg:col-span-1 bg-slate-50 p-8 rounded-lg">
          <h2 className="text-base font-medium mb-2">Mitigation Success Rate</h2>
          <p className="text-xs text-gray-500 mb-6">Across all vulnerabilities</p>

          <div className="flex justify-center items-center relative">
            <div className="relative h-[170px] w-[170px]">
              {/* Circle with progress */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-[150px] w-[150px] rounded-full bg-gray-100"></div>
              </div>
              
              {/* Progress Arc - Simplified */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-[150px] w-[150px] rounded-full border-[10px] border-transparent border-t-[#8E3A59] border-r-[#8E3A59] transform -rotate-[60deg]"></div>
              </div>
              
              {/* Center Content */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center justify-center">
                  <SmileIcon className="h-8 w-8 text-[#8E3A59] mb-2" />
                  <span className="text-3xl font-bold">43%</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>0%</span>
            <span>100%</span>
          </div>
        </div>
        
        {/* Vulnerability Handling Overview */}
        <div className="lg:col-span-1 bg-slate-50 p-8 rounded-lg">
          <h2 className="text-base font-medium mb-6">Vulnerability Handling Overview</h2>
          
          <div className="flex flex-col gap-4 mb-6">
            <div className="bg-slate-100 p-4 rounded-lg">
              <h3 className="text-xs text-gray-500 mb-1">Vulnerabilities Uploaded</h3>
              <p className="text-xl font-bold">14 vulnerabilities</p>
            </div>
            
            <div className="bg-slate-100 p-4 rounded-lg">
              <h3 className="text-xs text-gray-500 mb-1">Incidents Resolved</h3>
              <p className="text-xl font-bold">6 resolved</p>
            </div>
          </div>
          
          <div className="mt-6 relative">
            <div className="flex justify-center">
              <div className="text-center">
                <div className="text-[40px] font-bold">10.0</div>
                <div className="text-xs text-gray-500">Total Score</div>
              </div>
            </div>
            
            <div className="mt-2 flex justify-end">
              <div className="text-xs text-gray-500">Risk</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Third Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vulnerabilities Trend */}
        <div className="lg:col-span-2 bg-slate-50 p-8 rounded-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-base font-medium">Vulnerabilities Trend</h2>
            <span className="text-xs text-gray-500">(+5 this year)</span>
          </div>
          
          <div className="h-[300px] relative mb-4">
            {/* Month labels at bottom */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
              <span>Aug</span>
              <span>Sep</span>
              <span>Oct</span>
              <span>Nov</span>
              <span>Dec</span>
            </div>
            
            {/* Horizontal measurement lines */}
            <div className="absolute top-0 left-0 right-0 h-full flex flex-col justify-between">
              <div className="border-t border-dashed border-gray-200 w-full h-0"></div>
              <div className="border-t border-dashed border-gray-200 w-full h-0"></div>
              <div className="border-t border-dashed border-gray-200 w-full h-0"></div>
              <div className="border-t border-dashed border-gray-200 w-full h-0"></div>
            </div>
            
            {/* The trend line and area */}
            <div className="absolute top-8 left-0 right-0 bottom-5">
              <svg width="100%" height="100%" viewBox="0 0 800 200" preserveAspectRatio="none">
                {/* Gradient definition */}
                <defs>
                  <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#8E3A59" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#8E3A59" stopOpacity="0.1" />
                  </linearGradient>
                </defs>
                
                {/* The area fill under the curve */}
                <path 
                  d="M0,180 C50,170 100,130 150,120 C200,110 250,150 300,140 C350,130 400,80 450,70 C500,60 550,120 600,130 C650,140 700,90 750,80 L750,200 L0,200 Z" 
                  fill="url(#areaGradient)" 
                />
                
                {/* The line on top of the area */}
                <path 
                  d="M0,180 C50,170 100,130 150,120 C200,110 250,150 300,140 C350,130 400,80 450,70 C500,60 550,120 600,130 C650,140 700,90 750,80" 
                  fill="none" 
                  stroke="#8E3A59" 
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>
          
          {/* Measurement labels */}
          <div className="mt-2 space-y-6">
            <div className="flex justify-end items-center">
              <div className="flex-1 h-px border-t border-dashed border-[#8E3A59] opacity-50" />
              <span className="ml-2 text-xs text-gray-500">500</span>
            </div>
            <div className="flex justify-end items-center">
              <div className="flex-1 h-px border-t border-dashed border-[#8E3A59] opacity-50" />
              <span className="ml-2 text-xs text-gray-500">300</span>
            </div>
            <div className="flex justify-end items-center">
              <div className="flex-1 h-px border-t border-dashed border-[#8E3A59] opacity-50" />
              <span className="ml-2 text-xs text-gray-500">200</span>
            </div>
            <div className="flex justify-end items-center">
              <div className="flex-1 h-px border-t border-dashed border-[#8E3A59] opacity-50" />
              <span className="ml-2 text-xs text-gray-500">100</span>
            </div>
          </div>
        </div>
        
        {/* Security Activity */}
        <div className="lg:col-span-1 bg-slate-50 p-8 rounded-lg">
          <h2 className="text-base font-medium mb-6">Security Activity</h2>
          <p className="text-xs text-gray-500 mb-4">(Last 7 Days)</p>
          
          <div className="h-[150px] mb-8 flex items-end justify-between">
            {/* Simple bar chart with 7 bars */}
            <div className="w-8 h-[70%] bg-[#8E3A59] rounded-t-md"></div>
            <div className="w-8 h-[80%] bg-[#8E3A59] rounded-t-md"></div>
            <div className="w-8 h-[60%] bg-[#8E3A59] rounded-t-md"></div>
            <div className="w-8 h-[50%] bg-[#8E3A59] rounded-t-md"></div>
            <div className="w-8 h-[55%] bg-[#8E3A59] rounded-t-md"></div>
            <div className="w-8 h-[30%] bg-[#8E3A59] rounded-t-md"></div>
            <div className="w-8 h-[75%] bg-[#8E3A59] rounded-t-md"></div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b pb-3">
              <div className="bg-purple-100 p-2 rounded-md">
                <Box size={18} className="text-[#8E3A59]" />
              </div>
              <div className="flex-1">
                <span className="text-xs text-gray-500">Total Assets</span>
                <h3 className="text-sm font-semibold">{vulnerabilityCount}</h3>
              </div>
            </div>
            
            <div className="flex items-center gap-3 border-b pb-3">
              <div className="bg-purple-100 p-2 rounded-md">
                <FolderOpen size={18} className="text-[#8E3A59]" />
              </div>
              <div className="flex-1">
                <span className="text-xs text-gray-500">Open</span>
                <h3 className="text-sm font-semibold">5</h3>
              </div>
            </div>
            
            <div className="flex items-center gap-3 border-b pb-3">
              <div className="bg-purple-100 p-2 rounded-md">
                <Cpu size={18} className="text-[#8E3A59]" />
              </div>
              <div className="flex-1">
                <span className="text-xs text-gray-500">Closed</span>
                <h3 className="text-sm font-semibold">6</h3>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-2 rounded-md">
                <Shield size={18} className="text-[#8E3A59]" />
              </div>
              <div className="flex-1">
                <span className="text-xs text-gray-500">Secured</span>
                <h3 className="text-sm font-semibold">0</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 