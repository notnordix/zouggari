"use server"

import { cookies } from "next/headers"
import { query } from "./db"

let pageViewCount = 0 // Declare the variable before using it

// This is a server action to verify admin credentials
export async function verifyAdminCredentials(username: string, password: string) {
  // Get admin credentials from environment variables
  const adminUsername = process.env.ADMIN_USERNAME
  const adminPassword = process.env.ADMIN_PASSWORD

  // Check if environment variables are set
  if (!adminUsername || !adminPassword) {
    console.error("Admin credentials not set in environment variables")
    return { success: false, message: "Server configuration error" }
  }

  // Verify credentials
  if (username === adminUsername && password === adminPassword) {
    // Set a cookie to maintain the session
    const cookieStore = await cookies()
    cookieStore.set("admin_authenticated", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    })

    return { success: true }
  }

  // Return error for invalid credentials
  return { success: false, message: "Invalid username or password" }
}

// Function to check if user is authenticated
export async function isAdminAuthenticated() {
  const cookieStore = await cookies()
  const isAuthenticated = cookieStore.get("admin_authenticated")

  return isAuthenticated?.value === "true"
}

// Function to logout admin
export async function logoutAdmin() {
  const cookieStore = await cookies()
  cookieStore.delete("admin_authenticated")

  return { success: true }
}

// Function to increment page view count
export async function incrementPageViews() {
  try {
    // First, check if there's a record for total page views
    const existingRecord = await query<any[]>("SELECT * FROM viewcounts WHERE page_path = ?", ["total"])

    if (existingRecord && existingRecord.length > 0) {
      // Update existing record
      await query("UPDATE viewcounts SET view_count = view_count + 1, last_viewed = NOW() WHERE page_path = ?", [
        "total",
      ])
    } else {
      // Create new record
      await query("INSERT INTO viewcounts (page_path, view_count) VALUES (?, 1)", ["total"])
    }

    // Get the updated count
    const result = await query<any[]>("SELECT view_count FROM viewcounts WHERE page_path = ?", ["total"])

    return { success: true, count: result[0]?.view_count || 1 }
  } catch (error) {
    console.error("Error incrementing page views:", error)
    // Fallback to in-memory counter if database fails
    pageViewCount++
    return { success: false, count: pageViewCount }
  }
}

// Function to get page view count
export async function getPageViews() {
  try {
    const result = await query<any[]>("SELECT view_count FROM viewcounts WHERE page_path = ?", ["total"])

    return { success: true, count: result[0]?.view_count || 0 }
  } catch (error) {
    console.error("Error getting page views:", error)
    // Fallback to in-memory counter if database fails
    return { success: false, count: pageViewCount }
  }
}
