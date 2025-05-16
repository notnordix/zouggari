"use client"

import { useState, useEffect, useRef } from "react"
import { Search, X, ChevronDown, MapPin, Car, Calendar, Tag, Briefcase } from "lucide-react"

// List of Moroccan cities
const moroccanCities = [
  "Agadir",
  "Al Hoceima",
  "Assilah",
  "Azemmour",
  "Beni Mellal",
  "Berkane",
  "Berrechid",
  "Casablanca",
  "Chefchaouen",
  "Dakhla",
  "El Jadida",
  "Errachidia",
  "Essaouira",
  "Fès",
  "Fnideq",
  "Guelmim",
  "Ifrane",
  "Kénitra",
  "Khouribga",
  "Laâyoune",
  "Larache",
  "Marrakech",
  "Meknès",
  "Mohammedia",
  "Nador",
  "Ouarzazate",
  "Oujda",
  "Rabat",
  "Safi",
  "Salé",
  "Settat",
  "Sidi Ifni",
  "Tanger",
  "Tan-Tan",
  "Taroudant",
  "Taza",
  "Tétouan",
  "Tiznit",
]

// Car classes
const carClasses = ["Toutes les classes", "Économique", "Confort", "Luxe", "Premium", "SUV", "Utilitaire"]

// Car brands
const carBrands = [
  "Toutes les marques",
  "Audi",
  "BMW",
  "Citroën",
  "Dacia",
  "Fiat",
  "Ford",
  "Honda",
  "Hyundai",
  "Kia",
  "Mercedes",
  "Nissan",
  "Opel",
  "Peugeot",
  "Renault",
  "Seat",
  "Skoda",
  "Toyota",
  "Volkswagen",
]

// Car types
const carTypes = [
  "Tous les types",
  "Berline",
  "Cabriolet",
  "Citadine",
  "Coupé",
  "Crossover",
  "Monospace",
  "SUV",
  "4x4",
  "Utilitaire",
]

// Price ranges
const priceRanges = [
  "Tous les prix",
  "Moins de 300 DH",
  "300 - 500 DH",
  "500 - 800 DH",
  "800 - 1200 DH",
  "1200 - 2000 DH",
  "Plus de 2000 DH",
]

// Years
const years = [
  "Toutes les années",
  "2023",
  "2022",
  "2021",
  "2020",
  "2019",
  "2018",
  "2017",
  "2016",
  "2015",
  "Avant 2015",
]

interface FilterSectionProps {
  onFilterChange?: (filters: any) => void
  onSearchChange?: (search: string) => void
}

export default function FilterSection({ onFilterChange, onSearchChange }: FilterSectionProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [citySearchTerm, setCitySearchTerm] = useState("")
  const [filters, setFilters] = useState({
    city: "Toutes les villes",
    brand: "Toutes les marques",
    type: "Tous les types",
    price: "Tous les prix",
    class: "Toutes les classes",
    year: "Toutes les années",
  })

  const [dropdownOpen, setDropdownOpen] = useState({
    city: false,
    brand: false,
    type: false,
    price: false,
    class: false,
    year: false,
  })

  const dropdownRefs = {
    city: useRef(null),
    brand: useRef(null),
    type: useRef(null),
    price: useRef(null),
    class: useRef(null),
    year: useRef(null),
  }

  // Check if any filter is applied
  const hasActiveFilters = Object.values(filters).some(
    (value, index) =>
      value !==
      Object.values({
        city: "Toutes les villes",
        brand: "Toutes les marques",
        type: "Tous les types",
        price: "Tous les prix",
        class: "Toutes les classes",
        year: "Toutes les années",
      })[index],
  )

  // Filtered cities based on search
  const filteredCities = citySearchTerm
    ? [
        "Toutes les villes",
        ...moroccanCities.filter((city) => city.toLowerCase().includes(citySearchTerm.toLowerCase())),
      ]
    : ["Toutes les villes", ...moroccanCities]

  useEffect(() => {
    // Trigger animations after component mounts with a slight delay
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 300)

    // Handle clicks outside dropdowns
    const handleClickOutside = (event) => {
      Object.keys(dropdownRefs).forEach((key) => {
        if (dropdownRefs[key].current && !dropdownRefs[key].current.contains(event.target)) {
          setDropdownOpen((prev) => ({ ...prev, [key]: false }))
        }
      })
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      clearTimeout(timer)
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Notify parent components when filters change
  useEffect(() => {
    if (onFilterChange) {
      onFilterChange(filters)
    }
  }, [filters, onFilterChange])

  // Notify parent components when search changes
  useEffect(() => {
    if (onSearchChange) {
      onSearchChange(searchTerm)
    }
  }, [searchTerm, onSearchChange])

  // Toggle dropdown
  const toggleDropdown = (dropdown) => {
    setDropdownOpen((prev) => {
      const newState = { ...prev }
      // Close all other dropdowns
      Object.keys(newState).forEach((key) => {
        newState[key] = key === dropdown ? !prev[key] : false
      })
      return newState
    })
  }

  // Set filter value
  const setFilter = (type, value) => {
    setFilters((prev) => ({ ...prev, [type]: value }))
    setDropdownOpen((prev) => ({ ...prev, [type]: false }))
  }

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      city: "Toutes les villes",
      brand: "Toutes les marques",
      type: "Tous les types",
      price: "Tous les prix",
      class: "Toutes les classes",
      year: "Toutes les années",
    })
    setSearchTerm("")
  }

  // Reset specific filter
  const resetFilter = (type) => {
    setFilters((prev) => ({
      ...prev,
      [type]:
        type === "city"
          ? "Toutes les villes"
          : type === "brand"
            ? "Toutes les marques"
            : type === "type"
              ? "Tous les types"
              : type === "price"
                ? "Tous les prix"
                : type === "class"
                  ? "Toutes les classes"
                  : "Toutes les années",
    }))
  }

  // Handle search term change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  return (
    <div
      className={`md:bg-white md:rounded-xl md:shadow-md p-3 md:p-4 mb-4 md:mb-8 transition-all duration-700 transform relative z-30 ${
        isLoaded ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
      }`}
    >
      {/* Search and Reset Filters */}
      <div className="flex gap-3 mb-4 transition-all duration-300 ease-in-out">
        <div className={`relative transition-all duration-500 ease-in-out ${hasActiveFilters ? "w-10/12" : "w-full"}`}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher par nom, marque..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fcb040] focus:border-transparent"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 font-medium rounded-lg text-sm px-4 py-2.5 transition-colors flex items-center justify-center w-2/12"
          >
            <X className="w-4 h-4 mr-1.5" />
            <span className="hidden md:inline">Effacer tout</span>
            <span className="md:hidden">Effacer</span>
          </button>
        )}
      </div>

      {/* Filters Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* City Filter */}
        <div className="relative" ref={dropdownRefs.city}>
          <button
            onClick={() => toggleDropdown("city")}
            className={`w-full flex items-center justify-between px-3 py-2 border ${
              filters.city !== "Toutes les villes" ? "border-[#fcb040] bg-[#fcb040]/5" : "border-gray-200"
            } rounded-lg text-left text-sm focus:outline-none focus:ring-2 focus:ring-[#fcb040] focus:border-transparent transition-colors`}
          >
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-gray-500" />
              <span className="truncate text-xs md:text-sm">{filters.city}</span>
            </div>
            <div className="flex items-center">
              {filters.city !== "Toutes les villes" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    resetFilter("city")
                  }}
                  className="mr-1 text-red-500 hover:text-red-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen.city ? "rotate-180" : ""}`} />
            </div>
          </button>

          {dropdownOpen.city && (
            <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              <div className="sticky top-0 bg-white p-2 border-b border-gray-100">
                <input
                  type="text"
                  placeholder="Rechercher une ville..."
                  className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#fcb040]"
                  value={citySearchTerm}
                  onChange={(e) => setCitySearchTerm(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <div>
                {filteredCities.map((city) => (
                  <button
                    key={city}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${
                      filters.city === city ? "bg-[#fcb040]/10 font-medium" : ""
                    }`}
                    onClick={() => setFilter("city", city)}
                  >
                    {city}
                  </button>
                ))}
                {filteredCities.length === 0 && (
                  <div className="px-3 py-2 text-sm text-gray-500">Aucune ville trouvée</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Brand Filter */}
        <div className="relative" ref={dropdownRefs.brand}>
          <button
            onClick={() => toggleDropdown("brand")}
            className={`w-full flex items-center justify-between px-3 py-2 border ${
              filters.brand !== "Toutes les marques" ? "border-[#fcb040] bg-[#fcb040]/5" : "border-gray-200"
            } rounded-lg text-left text-sm focus:outline-none focus:ring-2 focus:ring-[#fcb040] focus:border-transparent transition-colors`}
          >
            <div className="flex items-center">
              <Car className="w-4 h-4 mr-2 text-gray-500" />
              <span className="truncate text-xs md:text-sm">{filters.brand}</span>
            </div>
            <div className="flex items-center">
              {filters.brand !== "Toutes les marques" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    resetFilter("brand")
                  }}
                  className="mr-1 text-red-500 hover:text-red-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen.brand ? "rotate-180" : ""}`} />
            </div>
          </button>

          {dropdownOpen.brand && (
            <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {carBrands.map((brand) => (
                <button
                  key={brand}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${
                    filters.brand === brand ? "bg-[#fcb040]/10 font-medium" : ""
                  }`}
                  onClick={() => setFilter("brand", brand)}
                >
                  {brand}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Type Filter */}
        <div className="relative" ref={dropdownRefs.type}>
          <button
            onClick={() => toggleDropdown("type")}
            className={`w-full flex items-center justify-between px-3 py-2 border ${
              filters.type !== "Tous les types" ? "border-[#fcb040] bg-[#fcb040]/5" : "border-gray-200"
            } rounded-lg text-left text-sm focus:outline-none focus:ring-2 focus:ring-[#fcb040] focus:border-transparent transition-colors`}
          >
            <div className="flex items-center">
              <Car className="w-4 h-4 mr-2 text-gray-500" />
              <span className="truncate text-xs md:text-sm">{filters.type}</span>
            </div>
            <div className="flex items-center">
              {filters.type !== "Tous les types" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    resetFilter("type")
                  }}
                  className="mr-1 text-red-500 hover:text-red-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen.type ? "rotate-180" : ""}`} />
            </div>
          </button>

          {dropdownOpen.type && (
            <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
              {carTypes.map((type) => (
                <button
                  key={type}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${
                    filters.type === type ? "bg-[#fcb040]/10 font-medium" : ""
                  }`}
                  onClick={() => setFilter("type", type)}
                >
                  {type}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Price Filter */}
        <div className="relative" ref={dropdownRefs.price}>
          <button
            onClick={() => toggleDropdown("price")}
            className={`w-full flex items-center justify-between px-3 py-2 border ${
              filters.price !== "Tous les prix" ? "border-[#fcb040] bg-[#fcb040]/5" : "border-gray-200"
            } rounded-lg text-left text-sm focus:outline-none focus:ring-2 focus:ring-[#fcb040] focus:border-transparent transition-colors`}
          >
            <div className="flex items-center">
              <Tag className="w-4 h-4 mr-2 text-gray-500" />
              <span className="truncate text-xs md:text-sm">{filters.price}</span>
            </div>
            <div className="flex items-center">
              {filters.price !== "Tous les prix" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    resetFilter("price")
                  }}
                  className="mr-1 text-red-500 hover:text-red-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen.price ? "rotate-180" : ""}`} />
            </div>
          </button>

          {dropdownOpen.price && (
            <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
              {priceRanges.map((price) => (
                <button
                  key={price}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${
                    filters.price === price ? "bg-[#fcb040]/10 font-medium" : ""
                  }`}
                  onClick={() => setFilter("price", price)}
                >
                  {price}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Class Filter */}
        <div className="relative" ref={dropdownRefs.class}>
          <button
            onClick={() => toggleDropdown("class")}
            className={`w-full flex items-center justify-between px-3 py-2 border ${
              filters.class !== "Toutes les classes" ? "border-[#fcb040] bg-[#fcb040]/5" : "border-gray-200"
            } rounded-lg text-left text-sm focus:outline-none focus:ring-2 focus:ring-[#fcb040] focus:border-transparent transition-colors`}
          >
            <div className="flex items-center">
              <Briefcase className="w-4 h-4 mr-2 text-gray-500" />
              <span className="truncate text-xs md:text-sm">{filters.class}</span>
            </div>
            <div className="flex items-center">
              {filters.class !== "Toutes les classes" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    resetFilter("class")
                  }}
                  className="mr-1 text-red-500 hover:text-red-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen.class ? "rotate-180" : ""}`} />
            </div>
          </button>

          {dropdownOpen.class && (
            <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
              {carClasses.map((carClass) => (
                <button
                  key={carClass}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${
                    filters.class === carClass ? "bg-[#fcb040]/10 font-medium" : ""
                  }`}
                  onClick={() => setFilter("class", carClass)}
                >
                  {carClass}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Year Filter */}
        <div className="relative" ref={dropdownRefs.year}>
          <button
            onClick={() => toggleDropdown("year")}
            className={`w-full flex items-center justify-between px-3 py-2 border ${
              filters.year !== "Toutes les années" ? "border-[#fcb040] bg-[#fcb040]/5" : "border-gray-200"
            } rounded-lg text-left text-sm focus:outline-none focus:ring-2 focus:ring-[#fcb040] focus:border-transparent transition-colors`}
          >
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-gray-500" />
              <span className="truncate text-xs md:text-sm">{filters.year}</span>
            </div>
            <div className="flex items-center">
              {filters.year !== "Toutes les années" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    resetFilter("year")
                  }}
                  className="mr-1 text-red-500 hover:text-red-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen.year ? "rotate-180" : ""}`} />
            </div>
          </button>

          {dropdownOpen.year && (
            <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
              {years.map((year) => (
                <button
                  key={year}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${
                    filters.year === year ? "bg-[#fcb040]/10 font-medium" : ""
                  }`}
                  onClick={() => setFilter("year", year)}
                >
                  {year}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
