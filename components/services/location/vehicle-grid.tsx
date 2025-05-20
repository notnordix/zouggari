"use client"

import { useState, useEffect } from "react"
import { Car, Calendar } from "lucide-react"
import type { Vehicle } from "@/lib/vehicle-data-client"
import { filterVehicles } from "@/lib/vehicle-data-client"
import { useLanguage } from "@/lib/language-context"

interface VehicleGridProps {
  vehicles: Vehicle[]
  filters?: any
  searchTerm?: string
  onReserveClick: (vehicle: Vehicle) => void
  isLoading?: boolean
}

export default function VehicleGrid({
  vehicles,
  filters,
  searchTerm,
  onReserveClick,
  isLoading = false,
}: VehicleGridProps) {
  const { t, language } = useLanguage()
  const [isLoaded, setIsLoaded] = useState(false)
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([])

  useEffect(() => {
    // Trigger animations after component mounts with a slight delay
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 300)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Filter vehicles based on the current filters and search term
    const filtered = filterVehicles(
      vehicles,
      filters || {
        city: t("all_cities"),
        brand: t("all_brands"),
        type: t("all_types"),
        price: t("all_prices"),
        class: t("all_classes"),
      },
      searchTerm || "",
      t,
      language,
    )

    setFilteredVehicles(filtered)
  }, [vehicles, filters, searchTerm, t, language])

  // Helper function to get translated vehicle properties
  const getTranslatedVehicleData = (vehicle: Vehicle) => {
    return {
      name: language === "en" && vehicle.translations.en.name ? vehicle.translations.en.name : vehicle.name,
      type: language === "en" && vehicle.translations.en.type ? vehicle.translations.en.type : vehicle.type,
      class: language === "en" && vehicle.translations.en.class ? vehicle.translations.en.class : vehicle.class,
      features: language === "en" ? vehicle.translations.en.features : vehicle.features,
    }
  }

  return (
    <div
      className={`md:bg-white md:rounded-xl md:shadow-lg p-4 md:p-6 transition-all duration-700 transform relative z-20 ${
        isLoaded ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
      }`}
    >
      {isLoading ? (
        // Loading state
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 border-4 border-[#fcb040] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading vehicles...</p>
        </div>
      ) : filteredVehicles.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {filteredVehicles.map((vehicle, index) => {
            const translatedData = getTranslatedVehicleData(vehicle)
            return (
              <div
                key={vehicle.id}
                className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300 flex flex-col relative card-animate"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Class label with custom styling */}
                <div className="absolute top-0 left-0 z-10">
                  <div className="bg-[#fcb040] text-white px-3 py-1 text-xs font-bold rounded-tl-lg rounded-br-lg shadow-md animate-pulse">
                    {translatedData.class}
                  </div>
                </div>

                {/* Vehicle Image */}
                <div className="relative aspect-square md:aspect-[4/3] overflow-hidden">
                  <img
                    src={vehicle.image || "/placeholder.svg"}
                    alt={translatedData.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = "/classic-red-convertible.png"
                    }}
                  />
                  {/* Price badge in top right */}
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-black px-2 py-1 rounded-full text-xs font-bold">
                    {vehicle.price} DH/{t("day")}
                  </div>
                </div>

                {/* Vehicle Info - Simplified */}
                <div className="p-3 flex-grow flex flex-col">
                  <h3 className="font-bold text-sm md:text-base truncate">{translatedData.name}</h3>
                  <div className="flex items-center gap-1 text-gray-500 text-xs mb-2">
                    <span>{vehicle.brand}</span>
                    <span>•</span>
                    <span>{translatedData.type}</span>
                  </div>

                  {/* Available Cities */}
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-1">{t("available_in")}</p>
                    <div className="flex flex-wrap gap-1">
                      {vehicle.cities.slice(0, 2).map((city, index) => (
                        <span key={index} className="bg-gray-100 text-gray-700 text-xs px-1.5 py-0.5 rounded">
                          {city}
                        </span>
                      ))}
                      {vehicle.cities.length > 2 && (
                        <span className="bg-gray-100 text-gray-700 text-xs px-1.5 py-0.5 rounded">
                          +{vehicle.cities.length - 2}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Reserve Button */}
                  <div className="mt-auto">
                    <div className="relative overflow-hidden rounded-lg group border border-[#fcb040]">
                      <button onClick={() => onReserveClick(vehicle)} className="w-full">
                        <div className="bg-[#fcb040] flex items-center justify-center gap-2 py-1.5 md:py-2 px-3 transition-all duration-300 group-hover:bg-[#fcb040]">
                          <Car className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
                          <span className="text-white font-medium text-xs md:text-sm">{t("reserve")}</span>
                        </div>
                        <div className="bg-white flex items-center justify-center gap-2 py-1.5 md:py-2 px-3 absolute inset-0 border-t-0 border-r-0 border-l-0 border-b border-[#fcb040] transition-all duration-300 translate-y-full group-hover:translate-y-0 group-hover:bg-[#fcb040] group-hover:text-white">
                          <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#fcb040] group-hover:text-white transition-colors duration-300" />
                          <span className="text-[#fcb040] group-hover:text-white transition-colors duration-300 font-medium text-xs md:text-sm">
                            {t("see_details")}
                          </span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-10 card-animate">
          <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Car className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold mb-3">{t("no_vehicle_found")}</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">{t("no_vehicle_message")}</p>
        </div>
      )}
    </div>
  )
}
