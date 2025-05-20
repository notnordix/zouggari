"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Phone, Mail, MapPin, Instagram, Facebook, Twitter } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export default function Footer() {
  const { t } = useLanguage()
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Trigger animations after component mounts
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <footer className="relative bg-transparent text-white overflow-hidden">
      {/* Background Image with reduced overlay - Updated background position to bottom */}
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-bottom bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1609337512091-261827e0adc8?q=80&w=1925&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
          }}
        ></div>
        {/* Reduced dark overlay */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content - Increased vertical padding */}
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="grid md:grid-cols-3 gap-8 md:gap-10">
          {/* Company Info */}
          <div
            className={`transition-all duration-700 transform ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"}`}
          >
            {/* Logo - Replaced text with image */}
            <Link href="/" className="inline-block mb-4 md:mb-6">
              <Image
                src="/logo.png"
                alt="Zouggari Transport"
                width={160}
                height={45}
                className="h-16 w-auto object-contain"
              />
            </Link>
            <p className="text-white/80 mb-4 md:mb-6 text-sm md:text-base">{t("solutions_text")}</p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="bg-white/10 hover:bg-[#fcb040] w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4 md:w-5 md:h-5" />
              </a>
              <a
                href="#"
                className="bg-white/10 hover:bg-[#fcb040] w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4 md:w-5 md:h-5" />
              </a>
              <a
                href="#"
                className="bg-white/10 hover:bg-[#fcb040] w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-300"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4 md:w-5 md:h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links - Updated underline animation to start from left */}
          <div
            className={`transition-all duration-700 delay-150 transform ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"}`}
          >
            <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6">{t("quick_links")}</h3>
            <ul className="space-y-2 md:space-y-3">
              <li>
                <Link
                  href="/"
                  className="nav-link group relative text-white/80 hover:text-[#fcb040] transition-colors inline-block"
                >
                  <span>{t("home")}</span>
                  <span className="nav-underline absolute -bottom-1 left-0 w-0 h-0.5 bg-[#fcb040] group-hover:w-full transition-all duration-300 ease-in-out"></span>
                </Link>
              </li>
              <li>
                <Link
                  href="/services/location"
                  className="nav-link group relative text-white/80 hover:text-[#fcb040] transition-colors inline-block"
                >
                  <span>{t("location")}</span>
                  <span className="nav-underline absolute -bottom-1 left-0 w-0 h-0.5 bg-[#fcb040] group-hover:w-full transition-all duration-300 ease-in-out"></span>
                </Link>
              </li>
              <li>
                {/* Transport link - Disabled */}
                <span className="text-white/50 cursor-not-allowed inline-block">{t("transport")}</span>
                <span className="text-white/50 text-xs ml-2">({t("coming_soon")})</span>
              </li>
              <li>
                <Link
                  href="/about"
                  className="nav-link group relative text-white/80 hover:text-[#fcb040] transition-colors inline-block"
                >
                  <span>{t("about")}</span>
                  <span className="nav-underline absolute -bottom-1 left-0 w-0 h-0.5 bg-[#fcb040] group-hover:w-full transition-all duration-300 ease-in-out"></span>
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="nav-link group relative text-white/80 hover:text-[#fcb040] transition-colors inline-block"
                >
                  <span>{t("contact")}</span>
                  <span className="nav-underline absolute -bottom-1 left-0 w-0 h-0.5 bg-[#fcb040] group-hover:w-full transition-all duration-300 ease-in-out"></span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div
            className={`transition-all duration-700 delay-300 transform ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"}`}
          >
            <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6">{t("contact")}</h3>
            <ul className="space-y-2 md:space-y-4">
              <li className="flex items-start gap-2 md:gap-3">
                <MapPin className="w-4 h-4 md:w-5 md:h-5 text-[#fcb040] mt-1 flex-shrink-0" />
                <span className="text-white/80 text-sm md:text-base">Marrakesh</span>
              </li>
              <li className="flex items-center gap-2 md:gap-3">
                <Phone className="w-4 h-4 md:w-5 md:h-5 text-[#fcb040] flex-shrink-0" />
                <a
                  href="tel:+212661482890"
                  className="text-white/80 hover:text-[#fcb040] transition-colors text-sm md:text-base"
                >
                  +212661482890
                </a>
              </li>
              <li className="flex items-center gap-2 md:gap-3">
                <Mail className="w-4 h-4 md:w-5 md:h-5 text-[#fcb040] flex-shrink-0" />
                <a
                  href="mailto:zouggarizakaria19@gmail.com"
                  className="text-white/80 hover:text-[#fcb040] transition-colors text-sm md:text-base"
                >
                  zouggarizakaria19@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className={`mt-8 md:mt-12 pt-4 md:pt-6 border-t border-white/20 flex flex-col md:flex-row md:justify-between items-center text-center md:text-left transition-all duration-700 delay-450 transform ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"}`}
        >
          <p className="text-white/60 text-xs md:text-sm mb-2 md:mb-0">{t("copyright")}</p>
          <p className="text-white/60 text-xs md:text-sm">
            {t("developed_by")}{" "}
            <a
              href="https://ouz.ma"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#fcb040] hover:underline"
            >
              Ouz.ma
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
