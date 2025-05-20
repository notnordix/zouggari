"use client"

import { useState, useEffect } from "react"
import Header from "@/components/home/header"
import HeroSection from "./hero-section"
import ContactContent from "./contact-content"
import Footer from "@/components/footer"

export default function ContactPage() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [pageLoaded, setPageLoaded] = useState(false)

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

  return (
    <main
      className={`min-h-screen w-full relative transition-opacity duration-500 ${pageLoaded ? "opacity-100" : "opacity-0"}`}
    >
      <Header isScrolled={isScrolled} />
      <HeroSection />
      <ContactContent />
      <Footer />
    </main>
  )
}
