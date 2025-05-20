"use client"

import type React from "react"

import { useState, useEffect, useRef, type MouseEvent, type ChangeEvent } from "react"
import { Search, X, ChevronDown, MapPin, Car, Tag, Briefcase } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

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

interface FilterSectionProps {
  onFilterChange?: (filters: FilterState) => void
  onSearchChange?: (search: string) => void
}

// Define types for our state
type FilterType = "city" | "brand" | "type" | "price" | "class"

interface FilterState {
  city: string
  brand: string
  type: string
  price: string
  class: string
}

interface DropdownState {
  city: boolean
  brand: boolean
  type: boolean
  price: boolean
  class: boolean
}

export default function FilterSection({ onFilterChange, onSearchChange }: FilterSectionProps) {
  const { t, language } = useLanguage()
  const [isLoaded, setIsLoaded] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [citySearchTerm, setCitySearchTerm] = useState("")
  const [filters, setFilters] = useState<FilterState>({
    city: "",
    brand: "",
    type: "",
    price: "",
    class: "",
  })

  // Initialize filter defaults with translations
  useEffect(() => {
    setFilters({
      city: t("all_cities"),
      brand: t("all_brands"),
      type: t("all_types"),
      price: t("all_prices"),
      class: t("all_classes"),
    })
  }, [language, t])

  const [dropdownOpen, setDropdownOpen] = useState<DropdownState>({
    city: false,
    brand: false,
    type: false,
    price: false,
    class: false,
  })

  const dropdownRefs = {
    city: useRef<HTMLDivElement>(null),
    brand: useRef<HTMLDivElement>(null),
    type: useRef<HTMLDivElement>(null),
    price: useRef<HTMLDivElement>(null),
    class: useRef<HTMLDivElement>(null),
  }

  // Check if any filter is applied
  const hasActiveFilters = Object.values(filters).some(
    (value, index) =>
      value !==
      Object.values({
        city: t("all_cities"),
        brand: t("all_brands"),
        type: t("all_types"),
        price: t("all_prices"),
        class: t("all_classes"),
      })[index],
  )

  // Get translated car classes
  const getCarClasses = () => [t("all_classes"), "Économique", "Confort", "Luxe", "Premium", "SUV", "Utilitaire"]

  // Get translated car brands
  const getCarBrands = () => [
    t("all_brands"),
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

  // Get translated car types
  const getCarTypes = () => [
    t("all_types"),
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

  // Get translated price ranges
  const getPriceRanges = () => [
    t("all_prices"),
    "Moins de 300 DH",
    "300 - 500 DH",
    "500 - 800 DH",
    "800 - 1200 DH",
    "1200 - 2000 DH",
    "Plus de 2000 DH",
  ]

  // Filtered cities based on search
  const filteredCities = citySearchTerm
    ? [t("all_cities"), ...moroccanCities.filter((city) => city.toLowerCase().includes(citySearchTerm.toLowerCase()))]
    : [t("all_cities"), ...moroccanCities]

  useEffect(() => {
    // Trigger animations after component mounts with a slight delay
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 300)

    // Handle clicks outside dropdowns
    const handleClickOutside = (event: MouseEvent | any) => {
      ;(Object.keys(dropdownRefs) as FilterType[]).forEach((key) => {
        if (dropdownRefs[key].current && !dropdownRefs[key].current?.contains(event.target)) {
          setDropdownOpen((prev) => ({ ...prev, [key]: false }))
        }
      })
    }

    document.addEventListener("mousedown", handleClickOutside as any)

    return () => {
      clearTimeout(timer)
      document.removeEventListener("mousedown", handleClickOutside as any)
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
  const toggleDropdown = (dropdown: FilterType) => {
    setDropdownOpen((prev) => {
      const newState = { ...prev }
      // Close all other dropdowns
      Object.keys(newState).forEach((key) => {
        newState[key as FilterType] = key === dropdown ? !prev[key as FilterType] : false
      })
      return newState
    })
  }

  // Set filter value
  const setFilter = (type: FilterType, value: string) => {
    setFilters((prev) => ({ ...prev, [type]: value }))
    setDropdownOpen((prev) => ({ ...prev, [type]: false }))
  }

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      city: t("all_cities"),
      brand: t("all_brands"),
      type: t("all_types"),
      price: t("all_prices"),
      class: t("all_classes"),
    })
    setSearchTerm("")
  }

  // Reset specific filter
  const resetFilter = (type: FilterType) => {
    setFilters((prev) => ({
      ...prev,
      [type]:
        type === "city"
          ? t("all_cities")
          : type === "brand"
            ? t("all_brands")
            : type === "type"
              ? t("all_types")
              : type === "price"
                ? t("all_prices")
                : t("all_classes"),
    }))
  }

  // Handle search term change
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
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
            placeholder={t("search_placeholder")}
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
            <span className="hidden md:inline">{t("clear_all")}</span>
            <span className="md:hidden">{t("clear")}</span>
          </button>
        )}
      </div>

      {/* Filters Grid - Changed from grid-cols-6 to grid-cols-5 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* City Filter */}
        <div className="relative" ref={dropdownRefs.city}>
          <button
            onClick={() => toggleDropdown("city")}
            className={`w-full flex items-center justify-between px-3 py-2 border ${
              filters.city !== t("all_cities") ? "border-[#fcb040] bg-[#fcb040]/5" : "border-gray-200"
            } rounded-lg text-left text-sm focus:outline-none focus:ring-2 focus:ring-[#fcb040] focus:border-transparent transition-colors`}
          >
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-gray-500" />
              <span className="truncate text-xs md:text-sm">{filters.city}</span>
            </div>
            <div className="flex items-center">
              {filters.city !== t("all_cities") && (
                <div
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation()
                    resetFilter("city")
                  }}
                  className="mr-1 text-red-500 hover:text-red-700 cursor-pointer"
                  role="button"
                  tabIndex={0}
                  aria-label="Clear city filter"
                >
                  <X className="w-3.5 h-3.5" />
                </div>
              )}
              <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen.city ? "rotate-180" : ""}`} />
            </div>
          </button>

          {dropdownOpen.city && (
            <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              <div className="sticky top-0 bg-white p-2 border-b border-gray-100">
                <input
                  type="text"
                  placeholder={t("search_city")}
                  className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#fcb040]"
                  value={citySearchTerm}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setCitySearchTerm(e.target.value)}
                  onClick={(e: React.MouseEvent) => e.stopPropagation()}
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
                  <div className="px-3 py-2 text-sm text-gray-500">{t("no_city_found")}</div>
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
              filters.brand !== t("all_brands") ? "border-[#fcb040] bg-[#fcb040]/5" : "border-gray-200"
            } rounded-lg text-left text-sm focus:outline-none focus:ring-2 focus:ring-[#fcb040] focus:border-transparent transition-colors`}
          >
            <div className="flex items-center">
              <Car className="w-4 h-4 mr-2 text-gray-500" />
              <span className="truncate text-xs md:text-sm">{filters.brand}</span>
            </div>
            <div className="flex items-center">
              {filters.brand !== t("all_brands") && (
                <div
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation()
                    resetFilter("brand")
                  }}
                  className="mr-1 text-red-500 hover:text-red-700 cursor-pointer"
                  role="button"
                  tabIndex={0}
                  aria-label="Clear brand filter"
                >
                  <X className="w-3.5 h-3.5" />
                </div>
              )}
              <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen.brand ? "rotate-180" : ""}`} />
            </div>
          </button>

          {dropdownOpen.brand && (
            <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {getCarBrands().map((brand) => (
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
              filters.type !== t("all_types") ? "border-[#fcb040] bg-[#fcb040]/5" : "border-gray-200"
            } rounded-lg text-left text-sm focus:outline-none focus:ring-2 focus:ring-[#fcb040] focus:border-transparent transition-colors`}
          >
            <div className="flex items-center">
              <Car className="w-4 h-4 mr-2 text-gray-500" />
              <span className="truncate text-xs md:text-sm">{filters.type}</span>
            </div>
            <div className="flex items-center">
              {filters.type !== t("all_types") && (
                <div
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation()
                    resetFilter("type")
                  }}
                  className="mr-1 text-red-500 hover:text-red-700 cursor-pointer"
                  role="button"
                  tabIndex={0}
                  aria-label="Clear type filter"
                >
                  <X className="w-3.5 h-3.5" />
                </div>
              )}
              <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen.type ? "rotate-180" : ""}`} />
            </div>
          </button>

          {dropdownOpen.type && (
            <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
              {getCarTypes().map((type) => (
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
              filters.price !== t("all_prices") ? "border-[#fcb040] bg-[#fcb040]/5" : "border-gray-200"
            } rounded-lg text-left text-sm focus:outline-none focus:ring-2 focus:ring-[#fcb040] focus:border-transparent transition-colors`}
          >
            <div className="flex items-center">
              <Tag className="w-4 h-4 mr-2 text-gray-500" />
              <span className="truncate text-xs md:text-sm">{filters.price}</span>
            </div>
            <div className="flex items-center">
              {filters.price !== t("all_prices") && (
                <div
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation()
                    resetFilter("price")
                  }}
                  className="mr-1 text-red-500 hover:text-red-700 cursor-pointer"
                  role="button"
                  tabIndex={0}
                  aria-label="Clear price filter"
                >
                  <X className="w-3.5 h-3.5" />
                </div>
              )}
              <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen.price ? "rotate-180" : ""}`} />
            </div>
          </button>

          {dropdownOpen.price && (
            <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
              {getPriceRanges().map((price) => (
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
              filters.class !== t("all_classes") ? "border-[#fcb040] bg-[#fcb040]/5" : "border-gray-200"
            } rounded-lg text-left text-sm focus:outline-none focus:ring-2 focus:ring-[#fcb040] focus:border-transparent transition-colors`}
          >
            <div className="flex items-center">
              <Briefcase className="w-4 h-4 mr-2 text-gray-500" />
              <span className="truncate text-xs md:text-sm">{filters.class}</span>
            </div>
            <div className="flex items-center">
              {filters.class !== t("all_classes") && (
                <div
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation()
                    resetFilter("class")
                  }}
                  className="mr-1 text-red-500 hover:text-red-700 cursor-pointer"
                  role="button"
                  tabIndex={0}
                  aria-label="Clear class filter"
                >
                  <X className="w-3.5 h-3.5" />
                </div>
              )}
              <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen.class ? "rotate-180" : ""}`} />
            </div>
          </button>

          {dropdownOpen.class && (
            <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
              {getCarClasses().map((carClass) => (
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
      </div>
    </div>
  )
}
