"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { LogOut, Home, Car, Menu, X, ChevronRight } from "lucide-react"
import { logoutAdmin } from "@/lib/admin-auth"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Check if the window is mobile size
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
      // Only collapse sidebar on desktop when resizing to smaller screens
      // Don't auto-collapse on mobile
      if (window.innerWidth < 1024 && !isMobile) {
        setSidebarCollapsed(false) // Keep expanded on mobile
      }
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [isMobile])

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logoutAdmin()
      router.push("/admin/login")
    } catch (error) {
      console.error("Logout failed:", error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  const isActive = (path: string) => {
    return pathname === path
  }

  const handleMobileMenuOpen = () => {
    setSidebarCollapsed(false) // Ensure sidebar is expanded when opened on mobile
    setIsMobileMenuOpen(true)
  }

  const navItems = [
    {
      name: "Overview",
      path: "/admin/dashboard",
      icon: Home,
    },
    {
      name: "Vehicles",
      path: "/admin/dashboard/vehicles",
      icon: Car,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 
          transition-all duration-300 ease-in-out
          bg-white border-r border-gray-200
          ${isMobile ? "w-72" : isSidebarCollapsed ? "w-20" : "w-64"} 
          ${isMobile ? (isMobileMenuOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0"}
          lg:relative
        `}
      >
        {/* Logo */}
        <div
          className={`
          flex items-center justify-center h-16 border-b border-gray-200
          ${isSidebarCollapsed ? "px-2" : "px-6"}
        `}
        >
          {isSidebarCollapsed ? (
            <div className="w-10 h-10 relative">
              <Image
                src="https://i.ibb.co/Qj7ZTj7W/Picsart-25-05-17-15-29-02-303-removebg-preview.png"
                alt="Zouggari Transport"
                fill
                className="object-contain"
              />
            </div>
          ) : (
            <Image
              src="https://i.ibb.co/Qj7ZTj7W/Picsart-25-05-17-15-29-02-303-removebg-preview.png"
              alt="Zouggari Transport"
              width={140}
              height={40}
              className="h-10 w-auto object-contain"
            />
          )}
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`
                    flex items-center px-3 py-3 rounded-lg transition-all
                    ${isActive(item.path) ? "bg-[#fcb040]/10 text-[#fcb040]" : "text-gray-600 hover:bg-gray-100"}
                    ${isSidebarCollapsed ? "justify-center" : "justify-between"}
                  `}
                  onClick={() => isMobile && setIsMobileMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <item.icon
                      className={`
                      ${isActive(item.path) ? "text-[#fcb040]" : "text-gray-500"}
                      ${isSidebarCollapsed ? "w-6 h-6" : "w-5 h-5 mr-3"}
                    `}
                    />
                    {!isSidebarCollapsed && <span>{item.name}</span>}
                  </div>
                  {!isSidebarCollapsed && isActive(item.path) && <ChevronRight className="w-4 h-4" />}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout button at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={`
              w-full flex items-center px-3 py-3 rounded-lg
              text-red-600 hover:bg-red-50 transition-all
              ${isSidebarCollapsed ? "justify-center" : "justify-between"}
            `}
          >
            <div className="flex items-center">
              <LogOut
                className={`
                text-red-500
                ${isSidebarCollapsed ? "w-6 h-6" : "w-5 h-5 mr-3"}
              `}
              />
              {!isSidebarCollapsed && <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>}
            </div>
          </button>
        </div>

        {/* Mobile close button */}
        {isMobile && (
          <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-3 right-3 text-gray-500 lg:hidden">
            <X className="w-6 h-6" />
          </button>
        )}
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-6">
          {/* Left side - Mobile menu button and toggle sidebar */}
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button onClick={handleMobileMenuOpen} className="text-gray-600 lg:hidden mr-2">
              <Menu className="w-6 h-6" />
            </button>

            {/* Toggle sidebar button - visible on desktop */}
            <button
              onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
              className="hidden lg:block text-gray-600 p-1 rounded-md hover:bg-gray-100"
            >
              <Menu className="w-5 h-5" />
            </button>

            <h1 className="ml-2 text-xl font-bold text-gray-800">Admin Dashboard</h1>
          </div>

          {/* Right side - profile */}
          <div className="flex items-center">
            {/* Profile */}
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-[#fcb040]/20 flex items-center justify-center text-[#fcb040] font-medium">
                A
              </div>
              <div className="ml-2 hidden md:block">
                <p className="text-sm font-medium text-gray-700">Admin</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">{children}</main>
      </div>

      {/* Mobile menu backdrop */}
      {isMobile && isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}
    </div>
  )
}
