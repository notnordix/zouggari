"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, X } from "lucide-react"

interface FileUploadProps {
  onFileSelect: (file: File) => void
  onClear: () => void
  initialPreview?: string
}

export default function FileUpload({ onFileSelect, onClear, initialPreview }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [preview, setPreview] = useState<string | null>(initialPreview || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      handleFile(file)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      handleFile(file)
    }
  }

  const handleFile = (file: File) => {
    // Check if file is an image
    if (!file.type.match("image.*")) {
      alert("Please select an image file")
      return
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size should not exceed 5MB")
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        setPreview(e.target.result as string)
      }
    }
    reader.readAsDataURL(file)

    // Pass file to parent component
    onFileSelect(file)
  }

  const handleClear = () => {
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    onClear()
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="w-full">
      {preview ? (
        <div className="relative rounded-lg overflow-hidden border border-gray-200">
          <img src={preview || "/placeholder.svg"} alt="Preview" className="w-full h-48 object-cover" />
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
            isDragging
              ? "border-[#fcb040] bg-[#fcb040]/5"
              : "border-gray-300 hover:border-[#fcb040] hover:bg-[#fcb040]/5"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <Upload className="w-10 h-10 text-gray-400 mb-2" />
          <p className="text-sm text-gray-600 text-center mb-1">
            <span className="font-medium">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500 text-center">SVG, PNG, JPG or GIF (max. 5MB)</p>
        </div>
      )}
      <input type="file" ref={fileInputRef} onChange={handleFileInput} accept="image/*" className="hidden" />
    </div>
  )
}
