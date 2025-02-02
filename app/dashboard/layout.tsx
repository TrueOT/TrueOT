import { Header } from "./_components/header"
import { SidebarNav } from "./_components/sidebar-nav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <SidebarNav />
      <div className="flex-1">
        <Header />
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  )
}