"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { LogOut, Home, Car, Users, Settings } from "lucide-react"
import { logoutAdmin } from "@/lib/admin-auth"

export default function AdminDashboard() {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

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

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Image
              src="https://i.ibb.co/Qj7ZTj7W/Picsart-25-05-17-15-29-02-303-removebg-preview.png"
              alt="Zouggari Transport"
              width={140}
              height={40}
              className="h-10 w-auto object-contain"
            />
            <h1 className="ml-4 text-xl font-bold text-gray-800">Admin Dashboard</h1>
          </div>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-5 h-5 mr-1" />
            <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
          </button>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md hidden md:block">
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <a href="#" className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-gray-100 font-medium">
                  <Home className="w-5 h-5 mr-3 text-gray-500" />
                  Dashboard
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-gray-100 font-medium">
                  <Car className="w-5 h-5 mr-3 text-gray-500" />
                  Vehicles
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-gray-100 font-medium">
                  <Users className="w-5 h-5 mr-3 text-gray-500" />
                  Customers
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-gray-100 font-medium">
                  <Settings className="w-5 h-5 mr-3 text-gray-500" />
                  Settings
                </a>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main content area */}
        <main className="flex-1 p-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Welcome to the Admin Dashboard</h2>
            <p className="text-gray-600">
              This is a protected area. You can manage your vehicles, customers, and settings from here.
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}
