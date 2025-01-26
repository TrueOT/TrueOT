import { Header } from "./_components/header"
import { Sidebar } from "./_components/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  )
}