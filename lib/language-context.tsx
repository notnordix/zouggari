"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type LanguageContextType = {
  language: string
  setLanguage: (lang: string) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType>({
  language: "fr",
  setLanguage: () => {},
  t: (key: string) => key,
})

export const useLanguage = () => useContext(LanguageContext)

type LanguageProviderProps = {
  children: ReactNode
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState("fr")
  const [translations, setTranslations] = useState<Record<string, Record<string, string>>>({})
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Load translations
    const loadTranslations = async () => {
      try {
        const { translations } = await import("@/lib/translations")
        setTranslations(translations)

        // Check for stored language preference
        const storedLanguage = localStorage.getItem("language")
        if (storedLanguage && (storedLanguage === "fr" || storedLanguage === "en")) {
          setLanguage(storedLanguage)
        }

        setIsLoaded(true)
      } catch (error) {
        console.error("Failed to load translations:", error)
        setIsLoaded(true)
      }
    }

    loadTranslations()
  }, [])

  // Update localStorage when language changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("language", language)

      // Update html lang attribute
      document.documentElement.lang = language
    }
  }, [language, isLoaded])

  // Translation function
  const t = (key: string): string => {
    if (!translations[language]) return key
    return translations[language][key] || translations["fr"][key] || key
  }

  const handleSetLanguage = (lang: string) => {
    if (lang === "fr" || lang === "en") {
      setLanguage(lang)
    }
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}
