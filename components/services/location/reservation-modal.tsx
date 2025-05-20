"use client"

import { useState, useEffect } from "react"
import { X, Calendar, User, ChevronDown, ChevronUp } from "lucide-react"
import type { Vehicle } from "@/lib/vehicle-data-client"
import { useLanguage } from "@/lib/language-context"

interface ReservationModalProps {
  vehicle: Vehicle | null
  isOpen: boolean
  onClose: () => void
}

export default function ReservationModal({ vehicle, isOpen, onClose }: ReservationModalProps) {
  const { t, language } = useLanguage()
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [isLoaded, setIsLoaded] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    if (isOpen) {
      // Set today as the default start date
      const today = new Date()
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)

      setStartDate(formatDate(today))
      setEndDate(formatDate(tomorrow))

      // Reset form when opening
      setName("")
      setPhone("")
      setShowDetails(false)

      // Add a small delay before showing the modal for animation
      const timer = setTimeout(() => {
        setIsLoaded(true)
      }, 50)

      // Prevent body scrolling when modal is open
      document.body.style.overflow = "hidden"

      return () => {
        clearTimeout(timer)
        document.body.style.overflow = ""
      }
    } else {
      setIsLoaded(false)
    }
  }, [isOpen])

  // Format date to YYYY-MM-DD for input
  const formatDate = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  // Get translated vehicle data
  const getTranslatedVehicleData = (vehicle: Vehicle | null) => {
    if (!vehicle) return { name: "", type: "", class: "", features: [] }

    return {
      name: language === "en" && vehicle.translations.en.name ? vehicle.translations.en.name : vehicle.name,
      type: language === "en" && vehicle.translations.en.type ? vehicle.translations.en.type : vehicle.type,
      class: language === "en" && vehicle.translations.en.class ? vehicle.translations.en.class : vehicle.class,
      features: language === "en" ? vehicle.translations.en.features : vehicle.features,
    }
  }

  const translatedVehicleData = getTranslatedVehicleData(vehicle)

  // Handle WhatsApp click
  const handleWhatsAppClick = () => {
    if (!name || !phone || !startDate || !endDate) {
      alert("Veuillez remplir tous les champs")
      return
    }

    const message = encodeURIComponent(
      `Bonjour, je souhaite réserver le véhicule ${translatedVehicleData.name} (${vehicle?.brand}).\n\n` +
        `Nom: ${name}\n` +
        `Téléphone: ${phone}\n` +
        `Date de début: ${startDate}\n` +
        `Date de fin: ${endDate}\n\n` +
        `Merci.`,
    )

    window.open(`https://wa.me/212661482890?text=${message}`, "_blank")
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 ${isLoaded ? "opacity-50" : "opacity-0"}`}
        onClick={onClose}
      ></div>

      {/* Modal - Horizontal layout on desktop, vertical on mobile */}
      <div
        className={`bg-white rounded-lg shadow-xl w-full max-w-xs md:max-w-3xl relative z-10 overflow-hidden transition-all duration-300 transform ${
          isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-black/50 text-white p-1.5 rounded-full hover:bg-black/70 transition-colors z-20"
          aria-label="Fermer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Desktop layout - Horizontal */}
        <div className="hidden md:flex">
          {/* Left side - Vehicle image */}
          <div className="w-2/5 relative">
            <div className="h-full">
              <img
                src={vehicle?.image || "/placeholder.svg"}
                alt={translatedVehicleData.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>

              {/* Vehicle info overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="text-xl font-bold truncate">{translatedVehicleData.name}</h3>
                <div className="flex items-center justify-between">
                  <p className="text-sm opacity-90">
                    {vehicle?.brand} • {translatedVehicleData.type}
                  </p>
                  <p className="text-lg font-bold">
                    {vehicle?.price} DH/{t("day")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Form and details */}
          <div className="w-3/5 p-5 flex flex-col">
            {/* Vehicle class and type */}
            <div className="flex justify-start items-center mb-3">
              <span className="bg-gray-100 text-gray-800 text-sm font-medium px-2 py-1 rounded">
                {t("class")}: {translatedVehicleData.class}
              </span>
            </div>

            {/* View Details Button */}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="w-full flex items-center justify-center gap-1 text-sm text-[#fcb040] hover:text-[#e9a439] transition-colors py-2 mb-2"
            >
              <span>{showDetails ? t("hide_details") : t("see_details")}</span>
              {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {/* Collapsible Details Section */}
            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out ${
                showDetails ? "max-h-40 opacity-100 mb-3" : "max-h-0 opacity-0"
              }`}
            >
              {/* Features */}
              <div className="mb-2">
                <p className="text-xs text-gray-500 mb-1 font-medium">{t("features")}</p>
                <div className="flex flex-wrap gap-1">
                  {translatedVehicleData.features.map((feature, index) => (
                    <span key={index} className="bg-gray-100 text-gray-700 text-xs px-1.5 py-0.5 rounded">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* Available Cities */}
              <div className="mb-2">
                <p className="text-xs text-gray-500 mb-1 font-medium">{t("available_in")}</p>
                <div className="flex flex-wrap gap-1">
                  {vehicle?.cities.map((city, index) => (
                    <span key={index} className="bg-gray-100 text-gray-700 text-xs px-1.5 py-0.5 rounded">
                      {city}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="space-y-3 flex-grow">
              {/* Name input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("full_name")}</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t("your_name")}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#fcb040] focus:border-transparent"
                    required
                    autoComplete="name"
                    name="fullname"
                  />
                </div>
              </div>

              {/* Phone input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("phone")}</label>
                <div className="relative">
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t("your_phone")}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#fcb040] focus:border-transparent"
                    required
                    autoComplete="tel"
                    name="phone"
                  />
                </div>
              </div>

              {/* Date range */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("start_date")}</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full pl-9 pr-2 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#fcb040] focus:border-transparent"
                      required
                      autoComplete="off"
                      name="start_date"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("end_date")}</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full pl-9 pr-2 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#fcb040] focus:border-transparent"
                      required
                      autoComplete="off"
                      name="end_date"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* WhatsApp button */}
            <button
              onClick={handleWhatsAppClick}
              className="mt-4 w-full bg-[#25D366] hover:bg-[#20BD5C] text-white py-2.5 px-4 rounded-md font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <span>{t("book_via_whatsapp")}</span>
            </button>
          </div>
        </div>

        {/* Mobile layout - Vertical (existing layout) */}
        <div className="md:hidden">
          {/* Header with vehicle image */}
          <div className="relative h-36 overflow-hidden">
            <img
              src={vehicle?.image || "/placeholder.svg"}
              alt={translatedVehicleData.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

            {/* Vehicle info overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-2.5 text-white">
              <h3 className="text-base font-bold truncate">{translatedVehicleData.name}</h3>
              <div className="flex items-center justify-between">
                <p className="text-xs opacity-90">
                  {vehicle?.brand} • {translatedVehicleData.type}
                </p>
                <p className="text-sm font-bold">
                  {vehicle?.price} DH/{t("day")}
                </p>
              </div>
            </div>
          </div>

          {/* Vehicle Details */}
          <div className="px-3 pt-2 pb-1 border-b border-gray-200">
            {/* Vehicle class and type */}
            <div className="flex justify-start items-center mb-2">
              <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-0.5 rounded">
                {t("class")}: {translatedVehicleData.class}
              </span>
            </div>

            {/* View Details Button */}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="w-full flex items-center justify-center gap-1 text-xs text-[#fcb040] hover:text-[#e9a439] transition-colors py-1.5 mb-1"
            >
              <span>{showDetails ? t("hide_details") : t("see_details")}</span>
              {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {/* Collapsible Details Section */}
            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out ${
                showDetails ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              {/* Features */}
              <div className="mb-2">
                <p className="text-xs text-gray-500 mb-1 font-medium">{t("features")}</p>
                <div className="flex flex-wrap gap-1">
                  {translatedVehicleData.features.map((feature, index) => (
                    <span key={index} className="bg-gray-100 text-gray-700 text-xs px-1.5 py-0.5 rounded">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* Available Cities */}
              <div className="mb-2">
                <p className="text-xs text-gray-500 mb-1 font-medium">{t("available_in")}</p>
                <div className="flex flex-wrap gap-1">
                  {vehicle?.cities.map((city, index) => (
                    <span key={index} className="bg-gray-100 text-gray-700 text-xs px-1.5 py-0.5 rounded">
                      {city}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-3">
            <div className="space-y-2">
              {/* Name input */}
              <div>
                <label htmlFor="name" className="block text-xs font-medium text-gray-700 mb-1">
                  {t("full_name")}
                </label>
                <div className="relative">
                  <User className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t("your_name")}
                    className="w-full pl-8 pr-2.5 py-1.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#fcb040] focus:border-transparent"
                    required
                    autoComplete="name"
                    name="fullname"
                  />
                </div>
              </div>

              {/* Phone input */}
              <div>
                <label htmlFor="phone" className="block text-xs font-medium text-gray-700 mb-1">
                  {t("phone")}
                </label>
                <div className="relative">
                  <svg
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t("your_phone")}
                    className="w-full pl-8 pr-2.5 py-1.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#fcb040] focus:border-transparent"
                    required
                    autoComplete="tel"
                    name="phone"
                  />
                </div>
              </div>

              {/* Date range */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="start_date" className="block text-xs font-medium text-gray-700 mb-1">
                    {t("start_date")}
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                    <input
                      type="date"
                      id="start_date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full pl-8 pr-1.5 py-1.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#fcb040] focus:border-transparent"
                      required
                      autoComplete="off"
                      name="start_date"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="end_date" className="block text-xs font-medium text-gray-700 mb-1">
                    {t("end_date")}
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                    <input
                      type="date"
                      id="end_date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full pl-8 pr-1.5 py-1.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#fcb040] focus:border-transparent"
                      required
                      autoComplete="off"
                      name="end_date"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* WhatsApp button */}
            <button
              onClick={handleWhatsAppClick}
              className="mt-4 w-full bg-[#25D366] hover:bg-[#20BD5C] text-white py-2 px-3 rounded-md font-medium flex items-center justify-center gap-2 transition-colors text-sm"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <span>{t("book_via_whatsapp")}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
