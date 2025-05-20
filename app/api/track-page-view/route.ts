import { incrementPageViews } from "@/lib/admin-auth"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // Check if the request is coming from the same origin to prevent abuse
    const origin = request.headers.get("origin")
    const host = request.headers.get("host")

    // Simple validation to prevent abuse (can be enhanced further)
    if (!origin || !host || !origin.includes(host)) {
      return NextResponse.json({ success: false, message: "Invalid request" }, { status: 403 })
    }

    // Get the path from the request body
    const body = await request.json()
    const { path } = body

    if (!path) {
      return NextResponse.json({ success: false, message: "Path is required" }, { status: 400 })
    }

    // Increment the page view counter in the database
    const result = await incrementPageViews()

    // Return a success response
    return NextResponse.json({ success: true, count: result.count }, { status: 200 })
  } catch (error) {
    console.error("Error tracking page view:", error)
    return NextResponse.json({ success: false, message: "Failed to track page view" }, { status: 500 })
  }
}
