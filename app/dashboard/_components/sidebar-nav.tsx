"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, User, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
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
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white border-r flex flex-col">
      {/* Logo Section */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="TrueOT"
            width={32}
            height={32}
          />
          <span className="font-semibold">TrueOT</span>
        </div>
      </div>

      {/* User Section */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          <Image
            src="/avatar.png"
            alt="User"
            width={40}
            height={40}
            className="rounded-full"
          />
          <div className="flex flex-col">
            <span className="font-semibold">Ahmed</span>
            <span className="text-xs text-gray-500">Security analyst</span>
            <span className="text-xs text-gray-500">vulnerability manager</span>
          </div>
          <button className="ml-auto">...</button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors",
                    pathname === item.href && "bg-gray-100 text-purple-600"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t">
        <button className="flex items-center gap-2 text-gray-700 hover:text-red-600 transition-colors w-full">
          <LogOut className="h-5 w-5" />
          Log out
        </button>
      </div>
    </div>
  );
} 