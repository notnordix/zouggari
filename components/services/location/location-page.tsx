"use client"

import { useState, useEffect } from "react"
import Header from "@/components/home/header"
import HeroSection from "./hero-section"
import FilterGridSection from "./filter-grid-section"
import Footer from "@/components/footer"
import ReservationModal from "./reservation-modal"
import type { Vehicle } from "@/lib/vehicle-data-client"

export default function LocationPage() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [pageLoaded, setPageLoaded] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    // Set initial scroll state
    const initialScrollY = window.scrollY
    setIsScrolled(initialScrollY > 10)

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const shouldBeScrolled = currentScrollY > 10
      setIsScrolled(shouldBeScrolled)
    }

    // Add passive: true for better performance
    window.addEventListener("scroll", handleScroll, { passive: true })

    // Set page as loaded after a small delay to ensure smooth animations
    const timer = setTimeout(() => {
      setPageLoaded(true)
    }, 100)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      clearTimeout(timer)
    }
  }, [])

  const openReservationModal = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle)
    setIsModalOpen(true)
  }

  const closeReservationModal = () => {
    setIsModalOpen(false)
    // Clear selected vehicle after modal animation completes
    setTimeout(() => {
      setSelectedVehicle(null)
    }, 300)
  }

  return (
    <main
      className={`min-h-screen w-full relative transition-opacity duration-500 ${pageLoaded ? "opacity-100" : "opacity-0"}`}
    >
      <Header isScrolled={isScrolled} />
      <HeroSection />
      <FilterGridSection onReserveClick={openReservationModal} />
      <Footer />

      {/* Reservation Modal - Now at the page level */}
      <ReservationModal vehicle={selectedVehicle} isOpen={isModalOpen} onClose={closeReservationModal} />
    </main>
  )
}
