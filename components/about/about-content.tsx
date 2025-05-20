"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Shield, Award, Users, ThumbsUp } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export default function AboutContent() {
  const { t } = useLanguage()
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Trigger animations after component mounts with a slight delay
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 300)

    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="py-8 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Company Overview - Made more compact for mobile */}
          <div
            className={`mb-10 md:mb-24 transition-all duration-700 transform ${
              isLoaded ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
            }`}
          >
            <div className="grid md:grid-cols-2 gap-6 md:gap-12 items-center">
              <div>
                <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6 text-gray-900">{t("our_story")}</h2>
                <p className="text-sm md:text-base text-gray-700 mb-3 md:mb-4">{t("founded_text")}</p>
                <p className="text-sm md:text-base text-gray-700 mb-3 md:mb-4">{t("growth_text")}</p>
                <p className="text-sm md:text-base text-gray-700">{t("today_text")}</p>
              </div>
              <div className="relative rounded-xl overflow-hidden shadow-xl h-64 md:h-96 mt-4 md:mt-0">
                <Image
                  src="https://i.ibb.co/sdKswFGQ/Whats-App-Image-2025-05-17-at-17-06-12-478c2aa0.jpg"
                  alt="Zouggari Transport History"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* Our Values - Made more compact for mobile */}
          <div
            className={`mb-10 md:mb-24 transition-all duration-700 delay-200 transform ${
              isLoaded ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
            }`}
          >
            <h2 className="text-2xl md:text-4xl font-bold mb-6 md:mb-10 text-center text-gray-900">
              {t("our_values")}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
              {/* Value 1 - More compact for mobile */}
              <div className="bg-gray-50 p-4 md:p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="bg-[#fcb040]/10 w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center mb-3 md:mb-4">
                  <Shield className="w-5 h-5 md:w-7 md:h-7 text-[#fcb040]" />
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-gray-900">{t("reliability")}</h3>
                <p className="text-xs md:text-base text-gray-700">{t("reliability_text")}</p>
              </div>

              {/* Value 2 - More compact for mobile */}
              <div className="bg-gray-50 p-4 md:p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="bg-[#fcb040]/10 w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center mb-3 md:mb-4">
                  <Award className="w-5 h-5 md:w-7 md:h-7 text-[#fcb040]" />
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-gray-900">{t("excellence")}</h3>
                <p className="text-xs md:text-base text-gray-700">{t("excellence_text")}</p>
              </div>

              {/* Value 3 - More compact for mobile */}
              <div className="bg-gray-50 p-4 md:p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="bg-[#fcb040]/10 w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center mb-3 md:mb-4">
                  <Users className="w-5 h-5 md:w-7 md:h-7 text-[#fcb040]" />
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-gray-900">{t("respect")}</h3>
                <p className="text-xs md:text-base text-gray-700">{t("respect_text")}</p>
              </div>

              {/* Value 4 - More compact for mobile */}
              <div className="bg-gray-50 p-4 md:p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="bg-[#fcb040]/10 w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center mb-3 md:mb-4">
                  <ThumbsUp className="w-5 h-5 md:w-7 md:h-7 text-[#fcb040]" />
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-gray-900">{t("satisfaction")}</h3>
                <p className="text-xs md:text-base text-gray-700">{t("satisfaction_text")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
