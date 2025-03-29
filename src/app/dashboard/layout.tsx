import type React from "react"
import ProtectedRoute from "@/components/protected-route"
import DashboardSidebar from "@/components/dashboard/Sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100 flex">
        {/* Sidebar with fixed width */}
        <div className="w-64">
          <DashboardSidebar />
        </div>

        {/* Main content area - flex-1 ensures it takes remaining space */}
        <div className="flex-1 p-4">{children}</div>
      </div>
    </ProtectedRoute>
  )
}


