"use client"

import { Bell, History, Search, Sun } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="h-16 border-b bg-white px-6">
      <div className="flex h-full items-center justify-between">
        <div className="flex w-full max-w-md items-center">
          <Search className="mr-2 h-4 w-4 text-gray-400" />
          <Input type="search" placeholder="Search..." className="w-full" />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Sun className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <History className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <div className="h-8 w-8 overflow-hidden rounded-full">
            <img src="/placeholder.svg?height=32&width=32" alt="User avatar" className="h-full w-full object-cover" />
          </div>
        </div>
      </div>
    </header>
  )
}

