"use server"

import { query } from "./db"
import { v4 as uuidv4 } from "uuid"
import type { Vehicle } from "./vehicle-data"

// Add a new vehicle to the database
export async function addVehicle(
  vehicle: Partial<Vehicle>,
): Promise<{ success: boolean; message: string; id?: string }> {
  try {
    // Generate a unique ID for the vehicle
    const id = vehicle.id || `v${uuidv4()}`

    // Insert vehicle into the vehicles table
    await query(
      `INSERT INTO vehicles 
       (id, name, brand, type, class, price, price_range, image_url, available) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        vehicle.name,
        vehicle.brand,
        vehicle.type,
        vehicle.class,
        vehicle.price,
        vehicle.priceRange,
        vehicle.image,
        vehicle.available,
      ],
    )

    // Insert cities
    if (vehicle.cities && vehicle.cities.length > 0) {
      for (const city of vehicle.cities) {
        // Check if city exists
        const cityExists = await query<any[]>("SELECT id FROM cities WHERE name = ?", [city])

        let cityId
        if (cityExists.length === 0) {
          // Insert city
          const result = await query<any>("INSERT INTO cities (name) VALUES (?)", [city])
          cityId = result.insertId
        } else {
          cityId = cityExists[0].id
        }

        // Link vehicle to city
        await query("INSERT INTO vehicle_cities (vehicle_id, city_id) VALUES (?, ?)", [id, cityId])
      }
    }

    // Insert features (French)
    if (vehicle.features && vehicle.features.length > 0) {
      for (const feature of vehicle.features) {
        // Check if feature exists
        const featureExists = await query<any[]>("SELECT id FROM features WHERE name = ? AND language = ?", [
          feature,
          "fr",
        ])

        let featureId
        if (featureExists.length === 0) {
          // Insert feature
          const result = await query<any>("INSERT INTO features (name, language) VALUES (?, ?)", [feature, "fr"])
          featureId = result.insertId
        } else {
          featureId = featureExists[0].id
        }

        // Link vehicle to feature
        await query("INSERT INTO vehicle_features (vehicle_id, feature_id) VALUES (?, ?)", [id, featureId])
      }
    }

    // Insert features (English)
    if (vehicle.translations?.en.features && vehicle.translations.en.features.length > 0) {
      for (const feature of vehicle.translations.en.features) {
        // Check if feature exists
        const featureExists = await query<any[]>("SELECT id FROM features WHERE name = ? AND language = ?", [
          feature,
          "en",
        ])

        let featureId
        if (featureExists.length === 0) {
          // Insert feature
          const result = await query<any>("INSERT INTO features (name, language) VALUES (?, ?)", [feature, "en"])
          featureId = result.insertId
        } else {
          featureId = featureExists[0].id
        }

        // Link vehicle to feature
        await query("INSERT INTO vehicle_features (vehicle_id, feature_id) VALUES (?, ?)", [id, featureId])
      }
    }

    // Insert translations
    if (vehicle.translations?.en) {
      if (vehicle.translations.en.name) {
        await query(
          "INSERT INTO translations (vehicle_id, language, field_name, translated_value) VALUES (?, ?, ?, ?)",
          [id, "en", "name", vehicle.translations.en.name],
        )
      }

      if (vehicle.translations.en.type) {
        await query(
          "INSERT INTO translations (vehicle_id, language, field_name, translated_value) VALUES (?, ?, ?, ?)",
          [id, "en", "type", vehicle.translations.en.type],
        )
      }

      if (vehicle.translations.en.class) {
        await query(
          "INSERT INTO translations (vehicle_id, language, field_name, translated_value) VALUES (?, ?, ?, ?)",
          [id, "en", "class", vehicle.translations.en.class],
        )
      }
    }

    return { success: true, message: "Vehicle added successfully", id }
  } catch (error) {
    console.error("Error adding vehicle:", error)
    return { success: false, message: "Failed to add vehicle" }
  }
}

// Update an existing vehicle in the database
export async function updateVehicle(vehicle: Partial<Vehicle>): Promise<{ success: boolean; message: string }> {
  try {
    if (!vehicle.id) {
      return { success: false, message: "Vehicle ID is required" }
    }

    // Update vehicle in the vehicles table
    await query(
      `UPDATE vehicles 
       SET name = ?, brand = ?, type = ?, class = ?, price = ?, price_range = ?, image_url = ?, available = ?
       WHERE id = ?`,
      [
        vehicle.name,
        vehicle.brand,
        vehicle.type,
        vehicle.class,
        vehicle.price,
        vehicle.priceRange,
        vehicle.image,
        vehicle.available,
        vehicle.id,
      ],
    )

    // Delete existing cities
    await query("DELETE FROM vehicle_cities WHERE vehicle_id = ?", [vehicle.id])

    // Insert updated cities
    if (vehicle.cities && vehicle.cities.length > 0) {
      for (const city of vehicle.cities) {
        // Check if city exists
        const cityExists = await query<any[]>("SELECT id FROM cities WHERE name = ?", [city])

        let cityId
        if (cityExists.length === 0) {
          // Insert city
          const result = await query<any>("INSERT INTO cities (name) VALUES (?)", [city])
          cityId = result.insertId
        } else {
          cityId = cityExists[0].id
        }

        // Link vehicle to city
        await query("INSERT INTO vehicle_cities (vehicle_id, city_id) VALUES (?, ?)", [vehicle.id, cityId])
      }
    }

    // Delete existing features
    await query("DELETE FROM vehicle_features WHERE vehicle_id = ?", [vehicle.id])

    // Insert updated features (French)
    if (vehicle.features && vehicle.features.length > 0) {
      for (const feature of vehicle.features) {
        // Check if feature exists
        const featureExists = await query<any[]>("SELECT id FROM features WHERE name = ? AND language = ?", [
          feature,
          "fr",
        ])

        let featureId
        if (featureExists.length === 0) {
          // Insert feature
          const result = await query<any>("INSERT INTO features (name, language) VALUES (?, ?)", [feature, "fr"])
          featureId = result.insertId
        } else {
          featureId = featureExists[0].id
        }

        // Link vehicle to feature
        await query("INSERT INTO vehicle_features (vehicle_id, feature_id) VALUES (?, ?)", [vehicle.id, featureId])
      }
    }

    // Insert updated features (English)
    if (vehicle.translations?.en.features && vehicle.translations.en.features.length > 0) {
      for (const feature of vehicle.translations.en.features) {
        // Check if feature exists
        const featureExists = await query<any[]>("SELECT id FROM features WHERE name = ? AND language = ?", [
          feature,
          "en",
        ])

        let featureId
        if (featureExists.length === 0) {
          // Insert feature
          const result = await query<any>("INSERT INTO features (name, language) VALUES (?, ?)", [feature, "en"])
          featureId = result.insertId
        } else {
          featureId = featureExists[0].id
        }

        // Link vehicle to feature
        await query("INSERT INTO vehicle_features (vehicle_id, feature_id) VALUES (?, ?)", [vehicle.id, featureId])
      }
    }

    // Delete existing translations
    await query("DELETE FROM translations WHERE vehicle_id = ?", [vehicle.id])

    // Insert updated translations
    if (vehicle.translations?.en) {
      if (vehicle.translations.en.name) {
        await query(
          "INSERT INTO translations (vehicle_id, language, field_name, translated_value) VALUES (?, ?, ?, ?)",
          [vehicle.id, "en", "name", vehicle.translations.en.name],
        )
      }

      if (vehicle.translations.en.type) {
        await query(
          "INSERT INTO translations (vehicle_id, language, field_name, translated_value) VALUES (?, ?, ?, ?)",
          [vehicle.id, "en", "type", vehicle.translations.en.type],
        )
      }

      if (vehicle.translations.en.class) {
        await query(
          "INSERT INTO translations (vehicle_id, language, field_name, translated_value) VALUES (?, ?, ?, ?)",
          [vehicle.id, "en", "class", vehicle.translations.en.class],
        )
      }
    }

    return { success: true, message: "Vehicle updated successfully" }
  } catch (error) {
    console.error("Error updating vehicle:", error)
    return { success: false, message: "Failed to update vehicle" }
  }
}

// Delete a vehicle from the database
export async function deleteVehicle(id: string): Promise<{ success: boolean; message: string }> {
  try {
    // Delete the vehicle (foreign key constraints will handle related records)
    await query("DELETE FROM vehicles WHERE id = ?", [id])

    return { success: true, message: "Vehicle deleted successfully" }
  } catch (error) {
    console.error("Error deleting vehicle:", error)
    return { success: false, message: "Failed to delete vehicle" }
  }
}
