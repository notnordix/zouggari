"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Plus, Search, Filter, X, Edit, Trash2, Check, AlertCircle } from "lucide-react"
import { fetchVehicles, type Vehicle } from "@/lib/vehicle-data-client"
import { addVehicle, updateVehicle, deleteVehicle } from "@/lib/vehicle-actions"
import VehicleForm from "./vehicle-form"

export default function VehiclesManagement() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const editId = searchParams.get("edit")

  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [currentVehicle, setCurrentVehicle] = useState<Vehicle | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [notification, setNotification] = useState<{
    type: "success" | "error"
    message: string
  } | null>(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filters, setFilters] = useState({
    brand: "",
    type: "",
    class: "",
    available: "",
  })
  const [isLoading, setIsLoading] = useState(true)

  // Get unique values for filter dropdowns
  const brands = Array.from(new Set(vehicles.map((v) => v.brand)))
  const types = Array.from(new Set(vehicles.map((v) => v.type)))
  const classes = Array.from(new Set(vehicles.map((v) => v.class)))

  // Load vehicles from the database
  useEffect(() => {
    async function loadVehicles() {
      try {
        setIsLoading(true)
        const data = await fetchVehicles()
        setVehicles(data)
      } catch (error) {
        console.error("Error loading vehicles:", error)
        setNotification({
          type: "error",
          message: "Failed to load vehicles",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadVehicles()
  }, [])

  // Handle edit from URL parameter
  useEffect(() => {
    if (editId) {
      const vehicleToEdit = vehicles.find((v) => v.id === editId)
      if (vehicleToEdit) {
        setCurrentVehicle(vehicleToEdit)
        setIsEditModalOpen(true)
      }
    }
  }, [editId, vehicles])

  // Clear notification after 3 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [notification])

  const handleAddVehicle = async (newVehicle: Partial<Vehicle>) => {
    try {
      const result = await addVehicle(newVehicle)

      if (result.success) {
        // Reload vehicles to get the updated list
        const updatedVehicles = await fetchVehicles()
        setVehicles(updatedVehicles)

        setIsAddModalOpen(false)
        setNotification({
          type: "success",
          message: "Vehicle added successfully",
        })
      } else {
        setNotification({
          type: "error",
          message: result.message || "Failed to add vehicle",
        })
      }
    } catch (error) {
      console.error("Error adding vehicle:", error)
      setNotification({
        type: "error",
        message: "An error occurred while adding the vehicle",
      })
    }
  }

  const handleEditVehicle = async (updatedVehicle: Partial<Vehicle>) => {
    try {
      const result = await updateVehicle(updatedVehicle)

      if (result.success) {
        // Reload vehicles to get the updated list
        const updatedVehicles = await fetchVehicles()
        setVehicles(updatedVehicles)

        setIsEditModalOpen(false)
        setCurrentVehicle(null)

        // Remove the edit parameter from the URL
        if (editId) {
          router.push("/admin/dashboard/vehicles")
        }

        setNotification({
          type: "success",
          message: "Vehicle updated successfully",
        })
      } else {
        setNotification({
          type: "error",
          message: result.message || "Failed to update vehicle",
        })
      }
    } catch (error) {
      console.error("Error updating vehicle:", error)
      setNotification({
        type: "error",
        message: "An error occurred while updating the vehicle",
      })
    }
  }

  const handleDeleteVehicle = (id: string) => {
    setCurrentVehicle(vehicles.find((v) => v.id === id) || null)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (currentVehicle) {
      try {
        const result = await deleteVehicle(currentVehicle.id)

        if (result.success) {
          // Reload vehicles to get the updated list
          const updatedVehicles = await fetchVehicles()
          setVehicles(updatedVehicles)

          setIsDeleteModalOpen(false)
          setCurrentVehicle(null)
          setNotification({
            type: "success",
            message: "Vehicle deleted successfully",
          })
        } else {
          setNotification({
            type: "error",
            message: result.message || "Failed to delete vehicle",
          })
        }
      } catch (error) {
        console.error("Error deleting vehicle:", error)
        setNotification({
          type: "error",
          message: "An error occurred while deleting the vehicle",
        })
      }
    }
  }

  const resetFilters = () => {
    setFilters({
      brand: "",
      type: "",
      class: "",
      available: "",
    })
    setSearchTerm("")
  }

  // Filter vehicles based on search term and filters
  const filteredVehicles = vehicles.filter((vehicle) => {
    // Search term filter
    const searchLower = searchTerm.toLowerCase()
    const matchesSearch =
      searchTerm === "" ||
      vehicle.name.toLowerCase().includes(searchLower) ||
      vehicle.brand.toLowerCase().includes(searchLower) ||
      vehicle.type.toLowerCase().includes(searchLower) ||
      vehicle.class.toLowerCase().includes(searchLower)

    // Dropdown filters
    const matchesBrand = filters.brand === "" || vehicle.brand === filters.brand
    const matchesType = filters.type === "" || vehicle.type === filters.type
    const matchesClass = filters.class === "" || vehicle.class === filters.class
    const matchesAvailable =
      filters.available === "" ||
      (filters.available === "available" && vehicle.available) ||
      (filters.available === "unavailable" && !vehicle.available)

    return matchesSearch && matchesBrand && matchesType && matchesClass && matchesAvailable
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Vehicles Management</h1>
          <p className="text-gray-500 mt-1">Manage your fleet of vehicles</p>
        </div>
        <div className="mt-4 md:mt-0">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-[#fcb040] text-white rounded-lg hover:bg-[#e9a439] transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Vehicle
          </button>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center ${
            notification.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {notification.type === "success" ? (
            <Check className="w-5 h-5 mr-2" />
          ) : (
            <AlertCircle className="w-5 h-5 mr-2" />
          )}
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)} className="ml-4 text-gray-500 hover:text-gray-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search vehicles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fcb040] focus:border-transparent"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>

          {/* Filter button */}
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
            {(filters.brand || filters.type || filters.class || filters.available) && (
              <span className="ml-2 bg-[#fcb040] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {Object.values(filters).filter(Boolean).length}
              </span>
            )}
          </button>
        </div>

        {/* Filter panel */}
        {isFilterOpen && (
          <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Brand filter */}
              <div className="flex-1">
                <label htmlFor="brand-filter" className="block text-sm font-medium text-gray-700 mb-1">
                  Brand
                </label>
                <select
                  id="brand-filter"
                  value={filters.brand}
                  onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fcb040] focus:border-transparent"
                >
                  <option value="">All Brands</option>
                  {brands.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
              </div>

              {/* Type filter */}
              <div className="flex-1">
                <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  id="type-filter"
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fcb040] focus:border-transparent"
                >
                  <option value="">All Types</option>
                  {types.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Class filter */}
              <div className="flex-1">
                <label htmlFor="class-filter" className="block text-sm font-medium text-gray-700 mb-1">
                  Class
                </label>
                <select
                  id="class-filter"
                  value={filters.class}
                  onChange={(e) => setFilters({ ...filters, class: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fcb040] focus:border-transparent"
                >
                  <option value="">All Classes</option>
                  {classes.map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>
              </div>

              {/* Availability filter */}
              <div className="flex-1">
                <label htmlFor="available-filter" className="block text-sm font-medium text-gray-700 mb-1">
                  Availability
                </label>
                <select
                  id="available-filter"
                  value={filters.available}
                  onChange={(e) => setFilters({ ...filters, available: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fcb040] focus:border-transparent"
                >
                  <option value="">All</option>
                  <option value="available">Available</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              </div>
            </div>

            {/* Reset filters button */}
            <div className="mt-4 flex justify-end">
              <button onClick={resetFilters} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">
                Reset Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Vehicles Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="h-48 bg-gray-200 animate-pulse"></div>
              <div className="p-4">
                <div className="h-5 bg-gray-200 animate-pulse rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2 mb-3"></div>
                <div className="h-6 bg-gray-200 animate-pulse rounded w-1/3 mb-3"></div>
                <div className="h-4 bg-gray-200 animate-pulse rounded w-full mb-4"></div>
                <div className="h-8 bg-gray-200 animate-pulse rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredVehicles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Vehicle Image */}
              <div className="h-48 overflow-hidden relative">
                <img
                  src={vehicle.image || "/placeholder.svg"}
                  alt={vehicle.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "https://via.placeholder.com/400x200?text=No+Image"
                  }}
                />
                <div
                  className={`absolute top-2 right-2 px-2 py-1 text-xs font-medium rounded-full ${
                    vehicle.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {vehicle.available ? "Available" : "Unavailable"}
                </div>
              </div>

              {/* Vehicle Details */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">{vehicle.name}</h3>
                <div className="flex items-center mt-1 text-sm text-gray-600">
                  <span className="font-medium">{vehicle.brand}</span>
                  <span className="mx-2">•</span>
                  <span>{vehicle.type}</span>
                  <span className="mx-2">•</span>
                  <span>{vehicle.class}</span>
                </div>
                <p className="mt-2 text-lg font-bold text-[#fcb040]">
                  {vehicle.price} DH<span className="text-sm font-normal text-gray-500">/day</span>
                </p>

                {/* Cities */}
                <div className="mt-3">
                  <p className="text-xs font-medium text-gray-500 mb-1">Available in:</p>
                  <div className="flex flex-wrap gap-1">
                    {vehicle.cities.slice(0, 3).map((city) => (
                      <span key={city} className="px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-700">
                        {city}
                      </span>
                    ))}
                    {vehicle.cities.length > 3 && (
                      <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-700">
                        +{vehicle.cities.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 flex justify-between pt-3 border-t border-gray-100">
                  <button
                    onClick={() => {
                      setCurrentVehicle(vehicle)
                      setIsEditModalOpen(true)
                    }}
                    className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteVehicle(vehicle.id)}
                    className="flex items-center text-sm text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">No vehicles found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || Object.values(filters).some(Boolean)
              ? "Try adjusting your search or filters"
              : "Add your first vehicle to get started"}
          </p>
          {(searchTerm || Object.values(filters).some(Boolean)) && (
            <button
              onClick={resetFilters}
              className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <X className="w-4 h-4 mr-2" />
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* Add Vehicle Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Add New Vehicle</h3>
                    <VehicleForm onSubmit={handleAddVehicle} onCancel={() => setIsAddModalOpen(false)} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Vehicle Modal */}
      {isEditModalOpen && currentVehicle && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Edit Vehicle</h3>
                    <VehicleForm
                      vehicle={currentVehicle}
                      onSubmit={handleEditVehicle}
                      onCancel={() => {
                        setIsEditModalOpen(false)
                        setCurrentVehicle(null)
                        if (editId) {
                          router.push("/admin/dashboard/vehicles")
                        }
                      }}
                      isEdit
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && currentVehicle && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Vehicle</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete <span className="font-medium">{currentVehicle.name}</span>? This
                        action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={confirmDelete}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    setIsDeleteModalOpen(false)
                    setCurrentVehicle(null)
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
