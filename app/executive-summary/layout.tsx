import { ReactNode } from "react";
import { SidebarNav } from "@/app/dashboard/_components/sidebar-nav";
import { Header } from "@/app/dashboard/_components/header";

interface ExecutiveSummaryLayoutProps {
  children: ReactNode;
}

export default function ExecutiveSummaryLayout({ children }: ExecutiveSummaryLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <SidebarNav />
      <div className="flex-1">
        <Header />
        <main className="p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
            <p className="text-gray-500">
              Summary statistics and insights from vulnerability management system
            </p>
          </div>
          
          {children}
        </main>
      </div>
    </div>
  );
} 