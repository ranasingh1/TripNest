"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Calendar, Settings, LogOut, Menu, X, LayoutDashboard, Building, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth/authContext"

export default function DashboardSidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logOut } = useAuth()
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-30">
        <Button variant="outline" size="icon" onClick={() => setSidebarOpen(true)} className="bg-white">
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-30 h-full w-64 bg-white border-r transform transition-transform duration-200 ease-in-out lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <Link href="/" className="text-2xl font-bold text-teal-600">
              TripNest
            </Link>
            <button className="lg:hidden text-gray-500 hover:text-gray-700" onClick={() => setSidebarOpen(false)}>
              <X size={24} />
            </button>
          </div>

          <nav className="space-y-1">
            <Link
              href="/dashboard"
              className={`flex items-center px-4 py-3 rounded-md ${
                isActive("/dashboard") ? "text-gray-900 bg-gray-100" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <LayoutDashboard className="mr-3 h-5 w-5" />
              Dashboard
            </Link>
            <Link
              href="/dashboard/properties"
              className={`flex items-center px-4 py-3 rounded-md ${
                isActive("/dashboard/properties") ? "text-gray-900 bg-gray-100" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Building className="mr-3 h-5 w-5" />
              Properties
            </Link>
            <Link
              href="/dashboard/bookings"
              className={`flex items-center px-4 py-3 rounded-md ${
                isActive("/dashboard/bookings") ? "text-gray-900 bg-gray-100" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <BookOpen className="mr-3 h-5 w-5" />
              Bookings
            </Link>
            <Link
              href="/dashboard/calendar"
              className={`flex items-center px-4 py-3 rounded-md ${
                isActive("/dashboard/calendar") ? "text-gray-900 bg-gray-100" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Calendar className="mr-3 h-5 w-5" />
              Calendar
            </Link>
           
          </nav>
        </div>

        <div className="absolute bottom-0 w-full p-6 border-t">
          <div className="flex items-center mb-4">
            <div className="h-10 w-10 rounded-full bg-gray-200 mr-3 flex items-center justify-center">
              <span className="font-medium text-gray-600">
                {user?.displayName ? user.displayName[0] : user?.email?.[0] || "U"}
              </span>
            </div>
            <div>
              <p className="font-medium">{user?.displayName || "User"}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>
          <Button variant="outline" className="w-full flex items-center justify-center" onClick={() => logOut()}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>
    </>
  )
}

