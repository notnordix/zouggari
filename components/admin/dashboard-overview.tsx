"use client"

import { useState, useEffect } from "react"
import { Eye, Car, TrendingUp, ArrowRight } from "lucide-react"
import Link from "next/link"
import { getPageViews } from "@/lib/admin-auth"
import { fetchVehicles } from "@/lib/vehicle-data-client"
import type { Vehicle } from "@/lib/vehicle-data"

export default function DashboardOverview() {
  const [pageViews, setPageViews] = useState(0)
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true)

        // Fetch page views from the database
        const viewsResult = await getPageViews()
        if (viewsResult.success) {
          setPageViews(viewsResult.count)
        }

        // Fetch vehicles from the API
        const vehiclesData = await fetchVehicles()
        setVehicles(vehiclesData)
      } catch (error) {
        console.error("Error loading dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    // Load data immediately
    loadData()

    // Then refresh every 30 seconds
    const interval = setInterval(loadData, 30000)

    // Clean up interval on component unmount
    return () => clearInterval(interval)
  }, [])

  // Get the 5 most recent vehicles
  const recentVehicles = [...vehicles].slice(0, 5)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back, Admin</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link
            href="/admin/dashboard/vehicles"
            className="inline-flex items-center px-4 py-2 bg-[#fcb040] text-white rounded-lg hover:bg-[#e9a439] transition-colors"
          >
            <Car className="w-4 h-4 mr-2" />
            Manage Vehicles
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Page Views Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Page Views</p>
              {isLoading ? (
                <div className="h-8 w-24 bg-gray-200 animate-pulse rounded mt-1"></div>
              ) : (
                <p className="text-2xl font-semibold text-gray-800 mt-1">{pageViews.toLocaleString()}</p>
              )}
              <p className="text-xs text-green-600 mt-2 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                <span>Total views</span>
              </p>
            </div>
            <div className="p-3 rounded-full bg-blue-50 text-blue-600 h-fit">
              <Eye className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Active Vehicles Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Vehicles</p>
              {isLoading ? (
                <div className="h-8 w-24 bg-gray-200 animate-pulse rounded mt-1"></div>
              ) : (
                <p className="text-2xl font-semibold text-gray-800 mt-1">
                  {vehicles.filter((v) => v.available).length}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-2 flex items-center">
                <span>of {vehicles.length} total</span>
              </p>
            </div>
            <div className="p-3 rounded-full bg-[#fcb040]/10 text-[#fcb040] h-fit">
              <Car className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Vehicles */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-800">Recent Vehicles</h2>
          <Link
            href="/admin/dashboard/vehicles"
            className="text-sm font-medium text-[#fcb040] hover:text-[#e9a439] flex items-center"
          >
            View all
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        {isLoading ? (
          <div className="divide-y divide-gray-100">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="px-6 py-4">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-lg bg-gray-200 animate-pulse"></div>
                  <div className="ml-4 flex-1">
                    <div className="h-4 bg-gray-200 animate-pulse rounded w-1/3 mb-2"></div>
                    <div className="h-3 bg-gray-200 animate-pulse rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : recentVehicles.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {recentVehicles.map((vehicle) => (
              <div key={vehicle.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0">
                      <img
                        src={vehicle.image || "/placeholder.svg"}
                        alt={vehicle.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "https://via.placeholder.com/48?text=Car"
                        }}
                      />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-800">{vehicle.name}</p>
                      <div className="flex items-center mt-1">
                        <p className="text-xs text-gray-500">
                          {vehicle.brand} • {vehicle.price} DH/day
                        </p>
                        <span
                          className={`ml-2 px-2 py-0.5 text-xs rounded-full ${vehicle.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                        >
                          {vehicle.available ? "Available" : "Unavailable"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Link
                    href={`/admin/dashboard/vehicles?edit=${vehicle.id}`}
                    className="text-sm text-[#fcb040] hover:text-[#e9a439] font-medium"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-8 text-center">
            <p className="text-gray-500">No vehicles found. Add your first vehicle to get started.</p>
          </div>
        )}
      </div>
    </div>
  )
}
