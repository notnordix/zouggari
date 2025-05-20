"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, Plus, Check, Globe } from "lucide-react"
import type { Vehicle } from "@/lib/vehicle-data"
import FileUpload from "./file-upload"
import { uploadImage } from "@/lib/upload-service"

// List of Moroccan cities for the dropdown
const moroccanCities = [
  "Agadir",
  "Al Hoceima",
  "Assilah",
  "Azemmour",
  "Beni Mellal",
  "Berkane",
  "Berrechid",
  "Casablanca",
  "Chefchaouen",
  "Dakhla",
  "El Jadida",
  "Errachidia",
  "Essaouira",
  "Fès",
  "Fnideq",
  "Guelmim",
  "Ifrane",
  "Kénitra",
  "Khouribga",
  "Laâyoune",
  "Larache",
  "Marrakech",
  "Meknès",
  "Mohammedia",
  "Nador",
  "Ouarzazate",
  "Oujda",
  "Rabat",
  "Safi",
  "Salé",
  "Settat",
  "Sidi Ifni",
  "Tanger",
  "Tan-Tan",
  "Taroudant",
  "Taza",
  "Tétouan",
  "Tiznit",
]

// Car brands
const carBrands = [
  "Audi",
  "BMW",
  "Citroën",
  "Dacia",
  "Fiat",
  "Ford",
  "Honda",
  "Hyundai",
  "Kia",
  "Mercedes",
  "Nissan",
  "Opel",
  "Peugeot",
  "Renault",
  "Seat",
  "Skoda",
  "Toyota",
  "Volkswagen",
]

// Car types in French
const carTypesFr = ["Berline", "Cabriolet", "Citadine", "Coupé", "Crossover", "Monospace", "SUV", "4x4", "Utilitaire"]

// Car types in English
const carTypesEn = ["Sedan", "Convertible", "City car", "Coupe", "Crossover", "Minivan", "SUV", "4x4", "Utility"]

// Car classes in French
const carClassesFr = ["Économique", "Confort", "Luxe", "Premium", "SUV", "Utilitaire"]

// Car classes in English
const carClassesEn = ["Economy", "Comfort", "Luxury", "Premium", "SUV", "Utility"]

// Price ranges
const priceRanges = [
  "Moins de 300 DH",
  "300 - 500 DH",
  "500 - 800 DH",
  "800 - 1200 DH",
  "1200 - 2000 DH",
  "Plus de 2000 DH",
]

interface VehicleFormProps {
  vehicle?: Vehicle | null
  onSubmit: (vehicle: Partial<Vehicle>) => void
  onCancel: () => void
  isEdit?: boolean
}

export default function VehicleForm({ vehicle, onSubmit, onCancel, isEdit = false }: VehicleFormProps) {
  const [formData, setFormData] = useState<Partial<Vehicle>>({
    id: "",
    name: "",
    brand: "",
    type: "",
    class: "",
    price: 0,
    priceRange: "",
    cities: [],
    features: [],
    image: "",
    available: true,
    translations: {
      fr: {
        features: [],
      },
      en: {
        name: "",
        type: "",
        class: "",
        features: [],
      },
    },
  })

  const [newFeature, setNewFeature] = useState("")
  const [newFeatureEn, setNewFeatureEn] = useState("")
  const [newCity, setNewCity] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [activeTab, setActiveTab] = useState<"fr" | "en">("fr")
  const [isUploading, setIsUploading] = useState(false)

  // Initialize form with vehicle data if editing
  useEffect(() => {
    if (vehicle && isEdit) {
      setFormData({
        ...vehicle,
      })
    }
  }, [vehicle, isEdit])

  // Update price range based on price
  useEffect(() => {
    if (formData.price) {
      let range = ""
      if (formData.price < 300) range = "Moins de 300 DH"
      else if (formData.price >= 300 && formData.price < 500) range = "300 - 500 DH"
      else if (formData.price >= 500 && formData.price < 800) range = "500 - 800 DH"
      else if (formData.price >= 800 && formData.price < 1200) range = "800 - 1200 DH"
      else if (formData.price >= 1200 && formData.price < 2000) range = "1200 - 2000 DH"
      else range = "Plus de 2000 DH"

      setFormData((prev) => ({ ...prev, priceRange: range }))
    }
  }, [formData.price])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target

    if (type === "number") {
      setFormData({ ...formData, [name]: Number.parseFloat(value) })
    } else if (type === "checkbox") {
      setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked })
    } else {
      setFormData({ ...formData, [name]: value })
    }

    // Clear error when field is updated
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" })
    }
  }

  const handleTranslationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, lang: "fr" | "en") => {
    const { name, value } = e.target

    setFormData({
      ...formData,
      translations: {
        ...formData.translations,
        fr: {
          ...formData.translations?.fr,
          features: formData.translations?.fr?.features || [],
        },
        en: {
          ...formData.translations?.en,
          features: formData.translations?.en?.features || [],
          [name]: value,
        },
      },
    })

    // Clear error when field is updated
    if (errors[`${lang}_${name}`]) {
      setErrors({ ...errors, [`${lang}_${name}`]: "" })
    }
  }

  const handleFileSelect = async (file: File) => {
    setUploadedFile(file)

    // Create a temporary object URL for preview
    const imageUrl = URL.createObjectURL(file)
    setFormData({ ...formData, image: imageUrl })

    // Clear any image error
    if (errors.image) {
      setErrors({ ...errors, image: "" })
    }
  }

  const handleClearImage = () => {
    setUploadedFile(null)
    setFormData({ ...formData, image: "" })
  }

  const addFeature = (lang: "fr" | "en") => {
    const feature = lang === "fr" ? newFeature : newFeatureEn

    if (feature.trim()) {
      // Ensure both language features arrays exist
      const frFeatures = formData.translations?.fr?.features || []
      const enFeatures = formData.translations?.en?.features || []

      // Update the features for the current language
      const updatedTranslations = {
        fr: {
          ...formData.translations?.fr,
          features: lang === "fr" ? [...frFeatures, feature.trim()] : frFeatures,
        },
        en: {
          ...formData.translations?.en,
          features: lang === "en" ? [...enFeatures, feature.trim()] : enFeatures,
        },
      }

      // If we're adding a French feature, also update the main features array
      if (lang === "fr") {
        setFormData({
          ...formData,
          features: [...(formData.features || []), feature.trim()],
          translations: updatedTranslations,
        })
        setNewFeature("")
      } else {
        setFormData({
          ...formData,
          translations: updatedTranslations,
        })
        setNewFeatureEn("")
      }

      // Clear features error if it exists
      if (errors.features) {
        setErrors({ ...errors, features: "" })
      }
    }
  }

  const removeFeature = (index: number, lang: "fr" | "en") => {
    // Ensure both language features arrays exist
    const frFeatures = formData.translations?.fr?.features || []
    const enFeatures = formData.translations?.en?.features || []

    if (lang === "fr") {
      const updatedFeatures = formData.features?.filter((_, i) => i !== index) || []
      const updatedTranslationsFr = frFeatures.filter((_, i) => i !== index)

      setFormData({
        ...formData,
        features: updatedFeatures,
        translations: {
          fr: {
            ...formData.translations?.fr,
            features: updatedTranslationsFr,
          },
          en: {
            ...formData.translations?.en,
            features: enFeatures,
          },
        },
      })
    } else {
      const updatedTranslationsEn = enFeatures.filter((_, i) => i !== index)

      setFormData({
        ...formData,
        translations: {
          fr: {
            ...formData.translations?.fr,
            features: frFeatures,
          },
          en: {
            ...formData.translations?.en,
            features: updatedTranslationsEn,
          },
        },
      })
    }
  }

  const addCity = () => {
    if (newCity && !formData.cities?.includes(newCity)) {
      setFormData({
        ...formData,
        cities: [...(formData.cities || []), newCity],
      })
      setNewCity("")

      // Clear cities error if it exists
      if (errors.cities) {
        setErrors({ ...errors, cities: "" })
      }
    }
  }

  const removeCity = (city: string) => {
    setFormData({
      ...formData,
      cities: formData.cities?.filter((c) => c !== city) || [],
    })
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Validate French (primary) fields
    if (!formData.name) newErrors.name = "Name is required"
    if (!formData.brand) newErrors.brand = "Brand is required"
    if (!formData.type) newErrors.type = "Type is required"
    if (!formData.class) newErrors.class = "Class is required"
    if (!formData.price || formData.price <= 0) newErrors.price = "Valid price is required"
    if (!formData.image && !uploadedFile) newErrors.image = "Vehicle image is required"
    if (!formData.cities?.length) newErrors.cities = "At least one city is required"
    if (!formData.features?.length) newErrors.features = "At least one feature is required"

    // Validate English translations
    if (!formData.translations?.en.name) newErrors.en_name = "English name is required"
    if (!formData.translations?.en.type) newErrors.en_type = "English type is required"
    if (!formData.translations?.en.class) newErrors.en_class = "English class is required"
    if (!formData.translations?.en.features?.length) newErrors.en_features = "At least one English feature is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      try {
        // Upload image if there's a new file
        if (uploadedFile) {
          setIsUploading(true)

          // Create a FormData object to send the file
          const formDataObj = new FormData()
          formDataObj.append("file", uploadedFile)

          // Upload the image and get the URL
          const imageUrl = await uploadImage(formDataObj)

          // Update the form data with the new image URL
          setFormData((prev) => ({ ...prev, image: imageUrl }))

          // Submit the form with the updated image URL
          onSubmit({
            ...formData,
            image: imageUrl,
            id: isEdit ? formData.id : `v${Date.now()}`,
          })
        } else {
          // If no new image, just submit the form as is
          onSubmit({
            ...formData,
            id: isEdit ? formData.id : `v${Date.now()}`,
          })
        }
      } catch (error) {
        console.error("Error uploading image:", error)
        setErrors({ ...errors, image: "Failed to upload image" })
      } finally {
        setIsUploading(false)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Vehicle Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Vehicle Image <span className="text-red-500">*</span>
        </label>
        <FileUpload onFileSelect={handleFileSelect} initialPreview={formData.image} onClear={handleClearImage} />
        {errors.image && <p className="mt-1 text-xs text-red-500">{errors.image}</p>}
      </div>

      {/* Language Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-4">
          <button
            type="button"
            className={`py-2 px-4 font-medium text-sm border-b-2 ${
              activeTab === "fr"
                ? "border-[#fcb040] text-[#fcb040]"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
            onClick={() => setActiveTab("fr")}
          >
            <div className="flex items-center">
              <Globe className="w-4 h-4 mr-2" />
              French (Primary)
            </div>
          </button>
          <button
            type="button"
            className={`py-2 px-4 font-medium text-sm border-b-2 ${
              activeTab === "en"
                ? "border-[#fcb040] text-[#fcb040]"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
            onClick={() => setActiveTab("en")}
          >
            <div className="flex items-center">
              <Globe className="w-4 h-4 mr-2" />
              English
            </div>
          </button>
        </div>
      </div>

      {/* French Content */}
      {activeTab === "fr" && (
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-3">Basic Information (French)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${
                  errors.name ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fcb040] focus:border-transparent`}
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
            </div>

            {/* Brand */}
            <div>
              <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
                Brand <span className="text-red-500">*</span>
              </label>
              <select
                id="brand"
                name="brand"
                value={formData.brand || ""}
                onChange={handleChange}
                className={`w-full px-3 py-2 bg-white border ${
                  errors.brand ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fcb040] focus:border-transparent`}
              >
                <option value="">Select a brand</option>
                {carBrands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
              {errors.brand && <p className="mt-1 text-xs text-red-500">{errors.brand}</p>}
            </div>

            {/* Type */}
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Type <span className="text-red-500">*</span>
              </label>
              <select
                id="type"
                name="type"
                value={formData.type || ""}
                onChange={handleChange}
                className={`w-full px-3 py-2 bg-white border ${
                  errors.type ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fcb040] focus:border-transparent`}
              >
                <option value="">Select a type</option>
                {carTypesFr.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.type && <p className="mt-1 text-xs text-red-500">{errors.type}</p>}
            </div>

            {/* Class */}
            <div>
              <label htmlFor="class" className="block text-sm font-medium text-gray-700 mb-1">
                Class <span className="text-red-500">*</span>
              </label>
              <select
                id="class"
                name="class"
                value={formData.class || ""}
                onChange={handleChange}
                className={`w-full px-3 py-2 bg-white border ${
                  errors.class ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fcb040] focus:border-transparent`}
              >
                <option value="">Select a class</option>
                {carClassesFr.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
              {errors.class && <p className="mt-1 text-xs text-red-500">{errors.class}</p>}
            </div>

            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Price (DH/day) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price || ""}
                onChange={handleChange}
                min="0"
                step="50"
                className={`w-full px-3 py-2 border ${
                  errors.price ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fcb040] focus:border-transparent`}
              />
              {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price}</p>}
            </div>

            {/* Available */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="available"
                name="available"
                checked={formData.available}
                onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                className="h-4 w-4 text-[#fcb040] focus:ring-[#fcb040] border-gray-300 rounded"
              />
              <label htmlFor="available" className="ml-2 block text-sm text-gray-700">
                Available for booking
              </label>
            </div>
          </div>

          {/* Cities */}
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Available Cities</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.cities?.map((city) => (
                <div key={city} className="bg-gray-100 px-3 py-1.5 rounded-full flex items-center text-sm">
                  <span className="text-gray-800">{city}</span>
                  <button
                    type="button"
                    onClick={() => removeCity(city)}
                    className="ml-1.5 text-gray-500 hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {formData.cities?.length === 0 && <p className="text-sm text-gray-500 italic">No cities selected</p>}
            </div>
            <div className="flex">
              <select
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
                className={`flex-1 px-3 py-2 border ${
                  errors.cities ? "border-red-500" : "border-gray-300"
                } rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#fcb040] focus:border-transparent`}
              >
                <option value="">Select a city</option>
                {moroccanCities
                  .filter((city) => !formData.cities?.includes(city))
                  .map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
              </select>
              <button
                type="button"
                onClick={addCity}
                className="bg-[#fcb040] text-white px-4 py-2 rounded-r-lg hover:bg-[#e9a439] flex items-center"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            {errors.cities && <p className="mt-1 text-xs text-red-500">{errors.cities}</p>}
          </div>

          {/* Features (French) */}
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Features (French)</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.features?.map((feature, index) => (
                <div key={index} className="bg-gray-100 px-3 py-1.5 rounded-full flex items-center text-sm">
                  <span className="text-gray-800">{feature}</span>
                  <button
                    type="button"
                    onClick={() => removeFeature(index, "fr")}
                    className="ml-1.5 text-gray-500 hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {formData.features?.length === 0 && <p className="text-sm text-gray-500 italic">No features added</p>}
            </div>
            <div className="flex">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Add a feature in French"
                className={`flex-1 px-3 py-2 border ${
                  errors.features ? "border-red-500" : "border-gray-300"
                } rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#fcb040] focus:border-transparent`}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addFeature("fr")
                  }
                }}
              />
              <button
                type="button"
                onClick={() => addFeature("fr")}
                className="bg-[#fcb040] text-white px-4 py-2 rounded-r-lg hover:bg-[#e9a439] flex items-center"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            {errors.features && <p className="mt-1 text-xs text-red-500">{errors.features}</p>}
          </div>
        </div>
      )}

      {/* English Content */}
      {activeTab === "en" && (
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-3">Basic Information (English)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name (English) */}
            <div>
              <label htmlFor="en_name" className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle Name (English) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="en_name"
                name="name"
                value={formData.translations?.en.name || ""}
                onChange={(e) => handleTranslationChange(e, "en")}
                className={`w-full px-3 py-2 border ${
                  errors.en_name ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fcb040] focus:border-transparent`}
              />
              {errors.en_name && <p className="mt-1 text-xs text-red-500">{errors.en_name}</p>}
            </div>

            {/* Type (English) */}
            <div>
              <label htmlFor="en_type" className="block text-sm font-medium text-gray-700 mb-1">
                Type (English) <span className="text-red-500">*</span>
              </label>
              <select
                id="en_type"
                name="type"
                value={formData.translations?.en.type || ""}
                onChange={(e) => handleTranslationChange(e, "en")}
                className={`w-full px-3 py-2 bg-white border ${
                  errors.en_type ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fcb040] focus:border-transparent`}
              >
                <option value="">Select a type</option>
                {carTypesEn.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.en_type && <p className="mt-1 text-xs text-red-500">{errors.en_type}</p>}
            </div>

            {/* Class (English) */}
            <div>
              <label htmlFor="en_class" className="block text-sm font-medium text-gray-700 mb-1">
                Class (English) <span className="text-red-500">*</span>
              </label>
              <select
                id="en_class"
                name="class"
                value={formData.translations?.en.class || ""}
                onChange={(e) => handleTranslationChange(e, "en")}
                className={`w-full px-3 py-2 bg-white border ${
                  errors.en_class ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fcb040] focus:border-transparent`}
              >
                <option value="">Select a class</option>
                {carClassesEn.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
              {errors.en_class && <p className="mt-1 text-xs text-red-500">{errors.en_class}</p>}
            </div>
          </div>

          {/* Features (English) */}
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Features (English)</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.translations?.en.features?.map((feature, index) => (
                <div key={index} className="bg-gray-100 px-3 py-1.5 rounded-full flex items-center text-sm">
                  <span className="text-gray-800">{feature}</span>
                  <button
                    type="button"
                    onClick={() => removeFeature(index, "en")}
                    className="ml-1.5 text-gray-500 hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {(!formData.translations?.en.features || formData.translations.en.features.length === 0) && (
                <p className="text-sm text-gray-500 italic">No features added</p>
              )}
            </div>
            <div className="flex">
              <input
                type="text"
                value={newFeatureEn}
                onChange={(e) => setNewFeatureEn(e.target.value)}
                placeholder="Add a feature in English"
                className={`flex-1 px-3 py-2 border ${
                  errors.en_features ? "border-red-500" : "border-gray-300"
                } rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#fcb040] focus:border-transparent`}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addFeature("en")
                  }
                }}
              />
              <button
                type="button"
                onClick={() => addFeature("en")}
                className="bg-[#fcb040] text-white px-4 py-2 rounded-r-lg hover:bg-[#e9a439] flex items-center"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            {errors.en_features && <p className="mt-1 text-xs text-red-500">{errors.en_features}</p>}
          </div>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isUploading}
          className="px-4 py-2 bg-[#fcb040] text-white rounded-lg hover:bg-[#e9a439] transition-colors flex items-center disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isUploading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {isEdit ? "Updating..." : "Adding..."}
            </>
          ) : (
            <>
              <Check className="w-4 h-4 mr-2" />
              {isEdit ? "Update Vehicle" : "Add Vehicle"}
            </>
          )}
        </button>
      </div>
    </form>
  )
}
