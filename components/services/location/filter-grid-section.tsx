"use client"

import { useState } from "react"
import FilterSection from "./filter-section"
import VehicleGrid from "./vehicle-grid"

export default function FilterGridSection() {
  const [filters, setFilters] = useState({
    city: "Toutes les villes",
    brand: "Toutes les marques",
    type: "Tous les types",
    price: "Tous les prix",
    class: "Toutes les classes",
    year: "Toutes les années",
  })
  const [searchTerm, setSearchTerm] = useState("")

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
  }

  const handleSearchChange = (newSearchTerm) => {
    setSearchTerm(newSearchTerm)
  }

  return (
    <section className="py-6 md:py-10 bg-white md:bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Filter Section */}
          <FilterSection onFilterChange={handleFilterChange} onSearchChange={handleSearchChange} />

          {/* Vehicle Grid */}
          <VehicleGrid filters={filters} searchTerm={searchTerm} />
        </div>
      </div>
    </section>
  )
}
