import { NextResponse } from "next/server"
import { getVehicles } from "@/lib/vehicle-data-server"

export async function GET() {
  try {
    const vehicles = await getVehicles()
    return NextResponse.json(vehicles)
  } catch (error) {
    console.error("Error fetching vehicles:", error)
    return NextResponse.json({ error: "Failed to fetch vehicles" }, { status: 500 })
  }
}
