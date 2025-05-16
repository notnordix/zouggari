"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Phone, Mail, MapPin, Instagram, Facebook, Twitter, ArrowRight } from "lucide-react"

export default function Footer() {
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
      {/* Background Image with reduced overlay */}
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1966&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
          }}
        ></div>
        {/* Reduced dark overlay */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid md:grid-cols-3 gap-10">
          {/* Company Info */}
          <div
            className={`transition-all duration-700 transform ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"}`}
          >
            <Link
              href="/"
              className="text-3xl font-bold text-white hover:text-[#fcb040] transition-colors mb-6 inline-block"
            >
              zouggari
            </Link>
            <p className="text-white/80 mb-6">
              Solutions de transport et location de véhicules haut de gamme pour tous vos besoins professionnels et
              personnels.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="bg-white/10 hover:bg-[#fcb040] w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="bg-white/10 hover:bg-[#fcb040] w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="bg-white/10 hover:bg-[#fcb040] w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div
            className={`transition-all duration-700 delay-150 transform ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"}`}
          >
            <h3 className="text-xl font-bold mb-6 relative">
              Liens Rapides
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-[#fcb040]"></span>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-white/80 hover:text-[#fcb040] transition-colors flex items-center gap-2 group"
                >
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  <span>Accueil</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/services/location"
                  className="text-white/80 hover:text-[#fcb040] transition-colors flex items-center gap-2 group"
                >
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  <span>Location</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/services/transport"
                  className="text-white/80 hover:text-[#fcb040] transition-colors flex items-center gap-2 group"
                >
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  <span>Transport</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-white/80 hover:text-[#fcb040] transition-colors flex items-center gap-2 group"
                >
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  <span>À propos</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-white/80 hover:text-[#fcb040] transition-colors flex items-center gap-2 group"
                >
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  <span>Contact</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div
            className={`transition-all duration-700 delay-300 transform ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"}`}
          >
            <h3 className="text-xl font-bold mb-6 relative">
              Contact
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-[#fcb040]"></span>
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#fcb040] mt-1 flex-shrink-0" />
                <span className="text-white/80">123 Avenue des Champs-Élysées, 75008 Paris, France</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#fcb040] flex-shrink-0" />
                <a href="tel:+33123456789" className="text-white/80 hover:text-[#fcb040] transition-colors">
                  +33 1 23 45 67 89
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#fcb040] flex-shrink-0" />
                <a href="mailto:contact@zouggari.com" className="text-white/80 hover:text-[#fcb040] transition-colors">
                  contact@zouggari.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className={`mt-12 pt-6 border-t border-white/20 text-center transition-all duration-700 delay-450 transform ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"}`}
        >
          <p className="text-white/60">© {new Date().getFullYear()} Zouggari Transport. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}
