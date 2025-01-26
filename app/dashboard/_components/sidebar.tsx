"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, LogOut, Settings, User } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    color: "text-purple-600",
  },
  {
    name: "Profile",
    href: "/profile",
    icon: User,
  },
  {
    name: "Setting",
    href: "/settings",
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r bg-white p-4">
      <nav>
        <ul>
          <li className="py-2">Dashboard</li>
          <li className="py-2">Settings</li>
        </ul>
      </nav>
    </aside>
  )
}
