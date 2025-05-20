export interface Vehicle {
  id: string
  name: string
  brand: string
  type: string
  class: string
  price: number
  priceRange: string
  cities: string[]
  features: string[]
  image: string
  available: boolean
  translations: {
    fr: {
      name?: string
      type?: string
      class?: string
      features: string[]
    }
    en: {
      name?: string
      type?: string
      class?: string
      features: string[]
    }
  }
}

// This file is just a re-export to maintain compatibility with existing imports
// For client components, import from vehicle-data-client.ts
// For server components, import from vehicle-data-server.ts

export { fallbackVehicles, fetchVehicles, filterVehicles } from "./vehicle-data-client"

// Define translation field types
type TranslationField = "name" | "type" | "class" | "features"
type TranslationLanguage = "fr" | "en"

interface Translation {
  language: TranslationLanguage
  field_name: TranslationField
  translated_value: string
}

// Fallback mock data in case database is not available
const fallbackVehicles: Vehicle[] = [
  {
    id: "v1",
    name: "Touareg",
    brand: "Volkswgen",
    type: "Berline",
    class: "Luxe",
    price: 3000,
    priceRange: "Plus de 2000 DH",
    cities: ["Casablanca", "Rabat", "Marrakech"],
    features: ["Climatisation", "GPS", "Bluetooth", "Sièges en cuir", "Caméra de recul"],
    image: "https://i.pinimg.com/736x/ac/bb/50/acbb502e45e7e9d4101532ed7e115178.jpg",
    available: true,
    translations: {
      fr: {
        features: ["Climatisation", "GPS", "Bluetooth", "Sièges en cuir", "Caméra de recul"],
      },
      en: {
        name: "Touareg",
        type: "Sedan",
        class: "Luxury",
        features: ["Air conditioning", "GPS", "Bluetooth", "Leather seats", "Backup camera"],
      },
    },
  },
]

// Helper function to filter vehicles based on filter criteria
function filterVehicles(
  vehicles: Vehicle[],
  filters: {
    city: string
    brand: string
    type: string
    price: string
    class: string
  },
  searchTerm = "",
  t?: (key: string) => string,
  language = "fr",
): Vehicle[] {
  return vehicles.filter((vehicle) => {
    // Get the "all" values for each filter
    const allCities = t ? t("all_cities") : "Toutes les villes"
    const allBrands = t ? t("all_brands") : "Toutes les marques"
    const allTypes = t ? t("all_types") : "Tous les types"
    const allPrices = t ? t("all_prices") : "Tous les prix"
    const allClasses = t ? t("all_classes") : "Toutes les classes"

    // Get translated values for the vehicle
    const vehicleType = language === "en" && vehicle.translations.en.type ? vehicle.translations.en.type : vehicle.type
    const vehicleClass =
      language === "en" && vehicle.translations.en.class ? vehicle.translations.en.class : vehicle.class
    const vehicleName = language === "en" && vehicle.translations.en.name ? vehicle.translations.en.name : vehicle.name
    const vehicleFeatures = language === "en" ? vehicle.translations.en.features : vehicle.features

    // Filter by city
    if (filters.city !== allCities && !vehicle.cities.includes(filters.city)) {
      return false
    }

    // Filter by brand
    if (filters.brand !== allBrands && vehicle.brand !== filters.brand) {
      return false
    }

    // Filter by type - use translated type for comparison
    if (filters.type !== allTypes && vehicleType !== filters.type) {
      return false
    }

    // Filter by price range
    if (filters.price !== allPrices && vehicle.priceRange !== filters.price) {
      return false
    }

    // Filter by class - use translated class for comparison
    if (filters.class !== allClasses && vehicleClass !== filters.class) {
      return false
    }

    // Filter by search term - use translated values for search
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      return (
        vehicleName.toLowerCase().includes(searchLower) ||
        vehicle.brand.toLowerCase().includes(searchLower) ||
        vehicleType.toLowerCase().includes(searchLower) ||
        vehicleFeatures.some((feature) => feature.toLowerCase().includes(searchLower))
      )
    }

    return true
  })
}

const vehicles = fallbackVehicles
