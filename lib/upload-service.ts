"use server"

import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { v4 as uuidv4 } from "uuid"
import { existsSync } from "fs"

export async function uploadImage(formData: FormData): Promise<string> {
  try {
    const file = formData.get("file") as File

    if (!file) {
      throw new Error("No file uploaded")
    }

    // Create a unique filename
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Get file extension
    const originalFilename = file.name
    const extension = originalFilename.split(".").pop()

    // Create a unique filename with the original extension
    const filename = `${uuidv4()}.${extension}`

    // Define the path where the file will be saved
    const uploadDir = join(process.cwd(), "public", "uploads")

    // Create the uploads directory if it doesn't exist
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
      console.log("Uploads directory created automatically")
    }

    const path = join(uploadDir, filename)

    // Write the file to the uploads directory
    await writeFile(path, buffer)

    // Return the URL that can be used to access the file
    return `/uploads/${filename}`
  } catch (error) {
    console.error("Error uploading file:", error)
    throw error
  }
}
