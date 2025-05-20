import { query } from "./db"

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

// Define translation field types
type TranslationField = "name" | "type" | "class" | "features"
type TranslationLanguage = "fr" | "en"

interface Translation {
  language: TranslationLanguage
  field_name: TranslationField
  translated_value: string
}

// This function is only used on the server side (API routes or server components)
export async function getVehicles() {
  try {
    const vehicles = await query<any[]>(`
      SELECT v.*, GROUP_CONCAT(DISTINCT c.name) as cities
      FROM vehicles v
      LEFT JOIN vehicle_cities vc ON v.id = vc.vehicle_id
      LEFT JOIN cities c ON vc.city_id = c.id
      GROUP BY v.id
    `)

    if (!vehicles || vehicles.length === 0) {
      return []
    }

    // Transform database results to Vehicle objects
    const result: Vehicle[] = await Promise.all(
      vehicles.map(async (vehicle) => {
        // Get cities for this vehicle
        const citiesResult = await query<any[]>(
          `SELECT c.name FROM cities c 
         JOIN vehicle_cities vc ON c.id = vc.city_id 
         WHERE vc.vehicle_id = ?`,
          [vehicle.id],
        )
        const cities = citiesResult.map((city) => city.name)

        // Get features for this vehicle (French)
        const featuresFrResult = await query<any[]>(
          `SELECT f.name FROM features f 
         JOIN vehicle_features vf ON f.id = vf.feature_id 
         WHERE vf.vehicle_id = ? AND f.language = 'fr'`,
          [vehicle.id],
        )
        const featuresFr = featuresFrResult.map((feature) => feature.name)

        // Get features for this vehicle (English)
        const featuresEnResult = await query<any[]>(
          `SELECT f.name FROM features f 
         JOIN vehicle_features vf ON f.id = vf.feature_id 
         WHERE vf.vehicle_id = ? AND f.language = 'en'`,
          [vehicle.id],
        )
        const featuresEn = featuresEnResult.map((feature) => feature.name)

        // Get translations for this vehicle
        const translationsResult = await query<Translation[]>(
          `SELECT language, field_name, translated_value FROM translations 
         WHERE vehicle_id = ?`,
          [vehicle.id],
        )

        // Organize translations
        const translations = {
          fr: { features: featuresFr } as Vehicle["translations"]["fr"],
          en: { features: featuresEn } as Vehicle["translations"]["en"],
        }

        translationsResult.forEach((translation) => {
          if (translation.language === "en" && translation.field_name !== "features") {
            // Use type assertion to tell TypeScript this is a valid field
            ;(translations.en as any)[translation.field_name] = translation.translated_value
          } else if (translation.language === "fr" && translation.field_name !== "features") {
            // Use type assertion to tell TypeScript this is a valid field
            ;(translations.fr as any)[translation.field_name] = translation.translated_value
          }
        })

        return {
          id: vehicle.id,
          name: vehicle.name,
          brand: vehicle.brand,
          type: vehicle.type,
          class: vehicle.class,
          price: vehicle.price,
          priceRange: vehicle.price_range,
          cities: cities,
          features: featuresFr,
          image: vehicle.image_url || "https://via.placeholder.com/400x300?text=No+Image",
          available: vehicle.available,
          translations: translations,
        }
      }),
    )

    return result
  } catch (error) {
    console.error("Error fetching vehicles from database:", error)
    // Return empty array if database query fails
    return []
  }
}
