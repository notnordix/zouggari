"use client"

import { useState, useEffect } from "react"
import { Car } from "lucide-react"

interface VehicleGridProps {
  filters?: any
  searchTerm?: string
}

export default function VehicleGrid({ filters, searchTerm }: VehicleGridProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Trigger animations after component mounts with a slight delay
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 300)

    return () => clearTimeout(timer)
  }, [])

  // Here you would normally filter vehicles based on filters and searchTerm
  // For now, we'll just show the empty state

  return (
    <div
      className={`md:bg-white md:rounded-xl md:shadow-lg p-6 md:p-10 text-center transition-all duration-700 transform relative z-20 ${
        isLoaded ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
      }`}
    >
      <div className="max-w-md mx-auto">
        <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Car className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-2xl font-bold mb-3">Aucun véhicule disponible</h3>
        <p className="text-gray-500 mb-6">
          Notre flotte de véhicules est actuellement en cours de mise à jour. Veuillez revenir ultérieurement pour
          découvrir nos options de location.
        </p>
        <button className="bg-[#fcb040] hover:bg-[#e9a439] text-white font-bold py-3 px-6 rounded-lg transition-all duration-300">
          Être notifié des disponibilités
        </button>
      </div>
    </div>
  )
}
