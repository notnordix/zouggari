"use client"

import { useState, useEffect } from "react"
import Header from "./header"
import HeroSection from "./hero-section"

export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [pageLoaded, setPageLoaded] = useState(false)

  useEffect(() => {
    // Set initial scroll state
    const initialScrollY = window.scrollY
    setIsScrolled(initialScrollY > 10)
    console.log("Initial scroll position:", initialScrollY, "isScrolled:", initialScrollY > 10)

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const shouldBeScrolled = currentScrollY > 10
      console.log("Scroll position:", currentScrollY, "shouldBeScrolled:", shouldBeScrolled)
      setIsScrolled(shouldBeScrolled)
    }

    window.addEventListener("scroll", handleScroll)

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
    <main className={`w-full relative transition-opacity duration-500 ${pageLoaded ? "opacity-100" : "opacity-0"}`}>
      <Header isScrolled={isScrolled} />
      <HeroSection />
    </main>
  )
}
