"use client"

import { useEffect, useState } from "react"

export default function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Trigger animations after component mounts
    setIsLoaded(true)
  }, [])

  return (
    <section className="relative h-[50vh] w-full flex items-center overflow-hidden">
      {/* Background Image with fade-in effect */}
      <div className={`hero-background transition-opacity duration-1000 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
        <div className="absolute inset-0 bg-black/60 z-10"></div>
      </div>

      {/* Content - Changed max-w-6xl to max-w-7xl */}
      <div className="container mx-auto px-4 z-20 relative mt-16 md:mt-0 pt-16">
        <div className="max-w-7xl mx-auto">
          <div
            className={`transition-all duration-700 transform ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"}`}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-4">
              Location de Véhicules
            </h1>

            {/* Paragraph with text reveal animation */}
            <div
              className={`relative max-w-lg transition-all duration-700 delay-300 transform ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
            >
              <div className="text-container justify-start">
                <p className="text-base md:text-lg text-white/90 text-reveal">
                  Véhicules haut de gamme à votre service.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
