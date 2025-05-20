"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { useLanguage } from "@/lib/language-context"

type Language = {
  code: string
  name: string
  flag: string
}

const languages: Language[] = [
  {
    code: "fr",
    name: "Français",
    flag: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Flag_of_France.svg",
  },
  {
    code: "en",
    name: "English",
    flag: "https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg",
  },
]

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const currentLanguage = languages.find((lang) => lang.code === language) || languages[0]

  useEffect(() => {
    // Delay appearance for a smoother page load
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 1500)

    // Handle clicks outside the dropdown
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      clearTimeout(timer)
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const changeLanguage = (language: Language) => {
    setLanguage(language.code)
    setIsOpen(false)
  }

  return (
    <div
      ref={dropdownRef}
      className={`fixed bottom-6 right-6 z-50 transition-all duration-700 transform ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
      }`}
    >
      {/* Language options that appear when opened */}
      <div
        className={`flex flex-col gap-3 mb-3 transition-all duration-500 ${
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
        }`}
      >
        {languages
          .filter((lang) => lang.code !== currentLanguage.code)
          .map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang)}
              className="relative group"
              aria-label={`Switch to ${lang.name}`}
            >
              {/* Language name tooltip */}
              <div className="absolute right-14 top-1/2 -translate-y-1/2 bg-white text-gray-800 px-3 py-1.5 rounded-lg shadow-md text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-50">
                {lang.name}
                <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-white transform rotate-45"></div>
              </div>

              <div className="rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center w-10 h-10 group-hover:scale-105 transform-gpu overflow-hidden">
                <div className="relative w-10 h-10">
                  <Image src={lang.flag || "/placeholder.svg"} alt={lang.name} fill className="object-cover" />
                </div>
              </div>
            </button>
          ))}
      </div>

      {/* Main language button */}
      <button
        onClick={toggleDropdown}
        className="rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center relative overflow-hidden w-10 h-10"
        aria-label="Change language"
        aria-expanded={isOpen}
      >
        <div className="relative w-10 h-10">
          <Image
            src={currentLanguage.flag || "/placeholder.svg"}
            alt={currentLanguage.name}
            fill
            className="object-cover"
          />
        </div>
      </button>
    </div>
  )
}
