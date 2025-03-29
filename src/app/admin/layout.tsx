import type React from "react"
import ProtectedRoute from "@/components/protected-route"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        <div className="flex">
          {/* <DashboardSidebar /> */}
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

