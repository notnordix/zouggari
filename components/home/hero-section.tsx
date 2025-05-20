"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Car, Eye, Calendar } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export default function HeroSection() {
  const { t } = useLanguage()
  const [isLoaded, setIsLoaded] = useState(false)
  const [viewportHeight, setViewportHeight] = useState("100vh")

  useEffect(() => {
    // Trigger animations after component mounts
    setIsLoaded(true)

    // Function to update viewport height accounting for mobile browser UI
    const updateViewportHeight = () => {
      // Use visual viewport API if available (accounts for mobile browser UI)
      if (window.visualViewport) {
        const vh = window.visualViewport.height
        setViewportHeight(`${vh}px`)
      }
    }

    // Set initial height
    updateViewportHeight()

    // Update on resize and orientation change
    window.addEventListener("resize", updateViewportHeight)
    window.addEventListener("orientationchange", updateViewportHeight)

    return () => {
      window.removeEventListener("resize", updateViewportHeight)
      window.removeEventListener("orientationchange", updateViewportHeight)
    }
  }, [])

  return (
    <section
      className="relative w-full flex items-center justify-center overflow-hidden py-16"
      style={{ height: viewportHeight }}
    >
      {/* Background Image with fade-in effect */}
      <div className={`hero-background transition-opacity duration-1000 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
        <div className="absolute inset-0 bg-black/50 z-10"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 z-20 relative mt-16 md:mt-0">
        <div className="grid md:grid-cols-2 gap-6 md:gap-12 items-center max-w-5xl mx-auto">
          {/* Left Column - Location */}
          <div
            className={`text-center flex flex-col items-center justify-center transition-all duration-700 transform ${
              isLoaded ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
            } relative overflow-hidden max-w-xs md:max-w-sm mx-auto w-full`}
          >
            {/* Shining blur background with animation */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden">
              {/* Animated gradient overlay for shining effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent shining-effect"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 p-4 md:p-6">
              <div
                className={`mb-3 md:mb-6 transition-all duration-700 delay-100 transform ${
                  isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                }`}
              >
                <Image
                  src="/location.png"
                  alt="Location Icon"
                  width={60}
                  height={60}
                  className="mx-auto md:w-20 md:h-20 w-16 h-16"
                />
              </div>
              <h2
                className={`text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 md:mb-6 tracking-tight transition-all duration-700 delay-200 transform ${
                  isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                }`}
              >
                {t("location")}
              </h2>

              {/* Paragraph with infinite text reveal animation */}
              <div
                className={`relative mb-4 md:mb-8 max-w-xs mx-auto transition-all duration-700 delay-300 transform ${
                  isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                }`}
              >
                <div className="text-container">
                  <p className="text-base md:text-lg text-white/90 text-reveal">
                    {t("premium_vehicles_at_your_service")}
                  </p>
                </div>
              </div>

              <div
                className={`w-40 md:w-48 mx-auto transition-all duration-700 delay-400 transform ${
                  isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                }`}
              >
                <div className="relative overflow-hidden rounded-lg group">
                  <Link href="/services/location" className="block">
                    <div className="bg-[#fcb040] flex items-center justify-center gap-2 py-2 md:py-3 px-3 md:px-4 transition-transform duration-300 group-hover:-translate-y-full">
                      <Car className="w-4 h-4 md:w-5 md:h-5 text-white" />
                      <span className="text-white font-medium text-base">{t("reserve")}</span>
                    </div>
                    <div className="bg-white flex items-center justify-center gap-2 py-2 md:py-3 px-3 md:px-4 absolute inset-0 transition-transform duration-300 translate-y-full group-hover:translate-y-0">
                      <Eye className="w-4 h-4 md:w-5 md:h-5 text-black" />
                      <span className="text-black font-medium text-base">{t("see_more")}</span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Transport */}
          <div
            className={`text-center flex flex-col items-center justify-center transition-all duration-700 delay-300 transform ${
              isLoaded ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
            } relative overflow-hidden max-w-xs md:max-w-sm mx-auto w-full`}
          >
            {/* Shining blur background with animation */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden">
              {/* Animated gradient overlay for shining effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent shining-effect-delayed"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 p-4 md:p-6">
              <div
                className={`mb-3 md:mb-6 transition-all duration-700 delay-400 transform ${
                  isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                }`}
              >
                <Image
                  src="/transport.png"
                  alt="Transport Icon"
                  width={60}
                  height={60}
                  className="mx-auto md:w-20 md:h-20 w-16 h-16"
                />
              </div>
              <h2
                className={`text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 md:mb-6 tracking-tight transition-all duration-700 delay-500 transform ${
                  isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                }`}
              >
                {t("transport_title")}
              </h2>

              {/* Paragraph with infinite text reveal animation */}
              <div
                className={`relative mb-4 md:mb-8 max-w-xs mx-auto transition-all duration-700 delay-600 transform ${
                  isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                }`}
              >
                <div className="text-container">
                  <p className="text-base md:text-lg text-white/90 text-reveal text-reveal-delay">
                    {t("premium_transport_solutions")}
                  </p>
                </div>
              </div>

              <div
                className={`w-40 md:w-48 mx-auto transition-all duration-700 delay-700 transform ${
                  isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                }`}
              >
                <div className="relative overflow-hidden rounded-lg group">
                  {/* Removed Link and replaced with div */}
                  <div className="block">
                    <div className="bg-gray-500 flex items-center justify-center gap-2 py-2 md:py-3 px-3 md:px-4 transition-transform duration-300 group-hover:-translate-y-full">
                      <Car className="w-4 h-4 md:w-5 md:h-5 text-white" />
                      <span className="text-white font-medium text-base">{t("soon")}</span>
                    </div>
                    <div className="bg-gray-700 flex items-center justify-center gap-2 py-2 md:py-3 px-3 md:px-4 absolute inset-0 transition-transform duration-300 translate-y-full group-hover:translate-y-0">
                      <Calendar className="w-4 h-4 md:w-5 md:h-5 text-white" />
                      <span className="text-white font-medium text-base">{t("maintenance")}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
