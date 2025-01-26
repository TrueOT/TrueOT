"use client"

import { Bell, History, Search, Sun } from "lucide-react"

export function Header() {
  return (
    <header className="h-16 border-b bg-white px-6">
      <div className="flex h-full items-center justify-between">
        <div className="flex w-full max-w-md items-center">
          <Search className="mr-2 h-4 w-4 text-gray-400" />
          <input 
            type="search" 
            placeholder="Search..." 
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-lg p-2 hover:bg-gray-100">
            <Sun className="h-5 w-5" />
          </button>
          <button className="rounded-lg p-2 hover:bg-gray-100">
            <History className="h-5 w-5" />
          </button>
          <button className="rounded-lg p-2 hover:bg-gray-100">
            <Bell className="h-5 w-5" />
          </button>
          <div className="h-8 w-8 overflow-hidden rounded-full">
            <img 
              src="/api/placeholder/32/32" 
              alt="User avatar" 
              className="h-full w-full object-cover" 
            />
          </div>
        </div>
      </div>
    </header>
  )
}