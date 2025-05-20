"use client"

import { useState, useEffect } from "react"
import FilterSection from "./filter-section"
import VehicleGrid from "./vehicle-grid"
import type { Vehicle } from "@/lib/vehicle-data-client"
import { fetchVehicles } from "@/lib/vehicle-data-client"

// Define the filter state type
interface FilterState {
  city: string
  brand: string
  type: string
  price: string
  class: string
}

interface FilterGridSectionProps {
  onReserveClick: (vehicle: Vehicle) => void
}

export default function FilterGridSection({ onReserveClick }: FilterGridSectionProps) {
  const [filters, setFilters] = useState<FilterState>({
    city: "Toutes les villes",
    brand: "Toutes les marques",
    type: "Tous les types",
    price: "Tous les prix",
    class: "Toutes les classes",
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadVehicles() {
      try {
        setIsLoading(true)
        const data = await fetchVehicles()
        setVehicles(data)
      } catch (error) {
        console.error("Error loading vehicles:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadVehicles()
  }, [])

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters)
  }

  const handleSearchChange = (newSearchTerm: string) => {
    setSearchTerm(newSearchTerm)
  }

  return (
    <section className="py-6 md:py-10 bg-white md:bg-gray-50">
      <div className="container mx-auto px-0 md:px-4">
        <div className="max-w-7xl mx-auto">
          {/* Filter Section - Always displayed */}
          <FilterSection onFilterChange={handleFilterChange} onSearchChange={handleSearchChange} />

          {/* Vehicle Grid */}
          <VehicleGrid
            vehicles={vehicles}
            filters={filters}
            searchTerm={searchTerm}
            onReserveClick={onReserveClick}
            isLoading={isLoading}
          />
        </div>
      </div>
    </section>
  )
}
