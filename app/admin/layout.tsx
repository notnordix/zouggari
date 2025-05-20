import type React from "react"
// Replace the entire component with this implementation
export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    // Remove the html and body tags, just render a div with the background color
    <div className="bg-gray-100 min-h-screen">{children}</div>
  )
}
