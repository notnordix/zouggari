"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { ChevronDown, Phone, Mail, Menu, X, Home, Info, Car, Truck } from "lucide-react"

interface HeaderProps {
  isScrolled: boolean
}

export default function Header({ isScrolled }: HeaderProps) {
  const [servicesOpen, setServicesOpen] = useState(false)
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const servicesDropdownRef = useRef<HTMLDivElement>(null)

  // Debug logging to check if isScrolled prop is received correctly
  useEffect(() => {
    console.log("Header isScrolled:", isScrolled)
  }, [isScrolled])

  useEffect(() => {
    // Trigger animations after component mounts with a slight delay
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  // Close mobile menu when window is resized to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && mobileMenuOpen) {
        setMobileMenuOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [mobileMenuOpen])

  // Handle body scroll lock when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileMenuOpen])

  // Close services dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (servicesOpen && servicesDropdownRef.current && !servicesDropdownRef.current.contains(target)) {
        setServicesOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [servicesOpen])

  // Toggle services dropdown
  const toggleServicesDropdown = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setServicesOpen(!servicesOpen)
  }

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-black/80 backdrop-blur-sm shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-3">
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center justify-center overflow-visible">
          <div className="max-w-4xl w-full flex items-center justify-between">
            {/* Home Link with animation */}
            <div className="overflow-hidden">
              <Link
                href="/"
                className={`nav-link group relative text-white hover:text-[#fcb040] transition-colors font-bold flex items-center gap-1.5 transform transition-transform duration-700 ease-out ${
                  isLoaded ? "translate-y-0" : "translate-y-16"
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Accueil</span>
                <span className="nav-underline absolute -bottom-1 left-1/2 w-0 h-0.5 bg-[#fcb040] group-hover:w-full group-hover:left-0 transition-all duration-300 ease-in-out"></span>
              </Link>
            </div>

            {/* Services Dropdown with animation */}
            <div className="overflow-visible" ref={servicesDropdownRef}>
              <div
                className={`relative transform transition-transform duration-700 delay-150 ease-out ${
                  isLoaded ? "translate-y-0" : "translate-y-16"
                }`}
              >
                <button
                  className="nav-link group relative text-white hover:text-[#fcb040] transition-colors font-bold flex items-center gap-1.5"
                  onClick={toggleServicesDropdown}
                >
                  <span>Services</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-300 ${servicesOpen ? "rotate-180" : ""}`}
                  />
                  <span className="nav-underline absolute -bottom-1 left-1/2 w-0 h-0.5 bg-[#fcb040] group-hover:w-full group-hover:left-0 transition-all duration-300 ease-in-out"></span>
                </button>

                {/* Services Dropdown Menu */}
                <div
                  className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-lg py-2 z-[60] overflow-hidden transition-all duration-300 ${
                    servicesOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible translate-y-[-10px]"
                  }`}
                >
                  <Link
                    href="/services/location"
                    className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/20 transition-colors"
                    onClick={() => setServicesOpen(false)}
                  >
                    <Car className="w-5 h-5 text-[#fcb040]" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-xs text-white/70">Véhicules haut de gamme</p>
                    </div>
                  </Link>
                  <Link
                    href="/services/transport"
                    className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/20 transition-colors"
                    onClick={() => setServicesOpen(false)}
                  >
                    <Truck className="w-5 h-5 text-[#fcb040]" />
                    <div>
                      <p className="font-medium">Transport</p>
                      <p className="text-xs text-white/70">Solutions de transport</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {/* Logo with animation */}
            <div className="overflow-hidden">
              <Link
                href="/"
                className={`text-3xl font-bold text-white hover:text-[#fcb040] transition-colors transform transition-transform duration-700 delay-300 ease-out ${
                  isLoaded ? "translate-y-0 scale-100" : "translate-y-16 scale-95"
                }`}
              >
                zouggari
              </Link>
            </div>

            {/* About Link with animation */}
            <div className="overflow-hidden">
              <Link
                href="/about"
                className={`nav-link group relative text-white hover:text-[#fcb040] transition-colors font-bold flex items-center gap-1.5 transform transition-transform duration-700 delay-450 ease-out ${
                  isLoaded ? "translate-y-0" : "translate-y-16"
                }`}
              >
                <Info className="w-4 h-4" />
                <span>À propos</span>
                <span className="nav-underline absolute -bottom-1 left-1/2 w-0 h-0.5 bg-[#fcb040] group-hover:w-full group-hover:left-0 transition-all duration-300 ease-in-out"></span>
              </Link>
            </div>

            {/* Contact Link with sliding animation */}
            <div className="overflow-hidden">
              <div
                className={`relative overflow-hidden rounded-lg group w-28 transform transition-transform duration-700 delay-600 ease-out ${
                  isLoaded ? "translate-y-0" : "translate-y-16"
                }`}
              >
                <Link href="/contact" className="block">
                  <div className="bg-white flex items-center justify-center gap-2 py-2 px-3 transition-transform duration-300 group-hover:-translate-y-full">
                    <Phone className="w-4 h-4 text-black" />
                    <span className="text-black font-medium text-base">Contact</span>
                  </div>
                  <div className="bg-[#fcb040] flex items-center justify-center gap-2 py-2 px-3 absolute inset-0 transition-transform duration-300 translate-y-full group-hover:translate-y-0">
                    <Mail className="w-4 h-4 text-white" />
                    <span className="text-white font-medium text-base">Écrivez</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="flex md:hidden items-center justify-between">
          {/* Logo on the left for mobile */}
          <div className="overflow-hidden">
            <Link
              href="/"
              className={`text-2xl font-bold text-white hover:text-[#fcb040] transition-colors transform transition-transform duration-700 ease-out ${
                isLoaded ? "translate-y-0" : "translate-y-16"
              }`}
            >
              zouggari
            </Link>
          </div>

          {/* Mobile Menu Button on the right */}
          <div className="overflow-hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`text-white p-1 transform transition-transform duration-700 delay-200 ease-out ${
                isLoaded ? "translate-y-0" : "translate-y-16"
              }`}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Positioned as a fixed overlay */}
      <div
        ref={mobileMenuRef}
        className={`mobile-menu fixed inset-x-0 top-[56px] h-[calc(100vh-56px)] bg-black/90 backdrop-blur-md z-40 md:hidden transition-all duration-500 ease-in-out ${
          mobileMenuOpen ? "mobile-menu-open" : "mobile-menu-closed"
        }`}
        style={{ position: "fixed" }}
      >
        <div className="container mx-auto px-4 py-4 h-full overflow-y-auto">
          <nav className="flex flex-col space-y-3">
            {/* Mobile Navigation Links */}
            <Link
              href="/"
              className="mobile-menu-item flex items-center gap-2 text-white hover:text-[#fcb040] transition-colors py-2 border-b border-white/10"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Home className="w-4 h-4" />
              <span className="text-base font-bold">Accueil</span>
            </Link>

            {/* Services Dropdown for Mobile */}
            <div className="border-b border-white/10">
              <button
                onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                className="mobile-menu-item flex items-center justify-between w-full text-white hover:text-[#fcb040] transition-colors py-2"
              >
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold">Services</span>
                </div>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-300 ${mobileServicesOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Mobile Services Submenu */}
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  mobileServicesOpen ? "max-h-[160px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <Link
                  href="/services/location"
                  className="mobile-menu-item flex items-center gap-2 pl-6 py-2 text-white hover:bg-white/10 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Car className="w-4 h-4 text-[#fcb040]" />
                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <p className="text-xs text-white/70">Véhicules haut de gamme</p>
                  </div>
                </Link>
                <Link
                  href="/services/transport"
                  className="mobile-menu-item flex items-center gap-2 pl-6 py-2 text-white hover:bg-white/10 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Truck className="w-4 h-4 text-[#fcb040]" />
                  <div>
                    <p className="text-sm font-medium">Transport</p>
                    <p className="text-xs text-white/70">Solutions de transport</p>
                  </div>
                </Link>
              </div>
            </div>

            <Link
              href="/about"
              className="mobile-menu-item flex items-center gap-2 text-white hover:text-[#fcb040] transition-colors py-2 border-b border-white/10"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Info className="w-4 h-4" />
              <span className="text-base font-bold">À propos</span>
            </Link>

            <Link
              href="/contact"
              className="mobile-menu-item flex items-center gap-2 text-white hover:text-[#fcb040] transition-colors py-2 border-b border-white/10"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Phone className="w-4 h-4" />
              <span className="text-base font-bold">Contact</span>
            </Link>

            {/* Contact Button for Mobile */}
            <div className="pt-2">
              <Link
                href="/contact"
                className="mobile-menu-item block w-full bg-[#fcb040] text-white py-2 px-3 rounded-lg text-center font-bold transition-all hover:bg-[#e9a439] active:scale-95"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center justify-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">Écrivez-nous</span>
                </div>
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
