"use client"

import { useState, useEffect, type ChangeEvent, type FormEvent } from "react"
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { sendContactEmail } from "@/lib/email-service"

interface FormData {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

export default function ContactContent() {
  const { t } = useLanguage()
  const [isLoaded, setIsLoaded] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    // Trigger animations after component mounts with a slight delay
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 300)

    return () => clearTimeout(timer)
  }, [])

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitSuccess(false)
    setSubmitError(false)

    try {
      // Send email using the server action
      const result = await sendContactEmail(formData)

      if (result.success) {
        setSubmitSuccess(true)
        // Reset form after successful submission
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        })
      } else {
        setSubmitError(true)
        setErrorMessage(result.message || t("error_message"))
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      setSubmitError(true)
      setErrorMessage(t("error_message"))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="py-8 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6 md:gap-16">
            {/* Contact Information - More compact for mobile */}
            <div
              className={`transition-all duration-700 transform ${
                isLoaded ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
              }`}
            >
              <h2 className="text-2xl md:text-4xl font-bold mb-5 md:mb-8 text-gray-900">{t("contact_information")}</h2>

              {/* Contact Cards - More compact for mobile */}
              <div className="space-y-3 md:space-y-6">
                {/* Address */}
                <div className="bg-gray-50 p-3 md:p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow flex items-start gap-3 md:gap-4">
                  <div className="bg-[#fcb040]/10 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 md:w-6 md:h-6 text-[#fcb040]" />
                  </div>
                  <div>
                    <h3 className="text-base md:text-lg font-bold mb-0.5 md:mb-1 text-gray-900">{t("our_address")}</h3>
                    <p className="text-sm md:text-base text-gray-700">Marrakesh</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="bg-gray-50 p-3 md:p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow flex items-start gap-3 md:gap-4">
                  <div className="bg-[#fcb040]/10 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 md:w-6 md:h-6 text-[#fcb040]" />
                  </div>
                  <div>
                    <h3 className="text-base md:text-lg font-bold mb-0.5 md:mb-1 text-gray-900">{t("phone")}</h3>
                    <p className="text-sm md:text-base text-gray-700">
                      <a href="tel:+212661482890" className="hover:text-[#fcb040] transition-colors">
                        +212661482890
                      </a>
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="bg-gray-50 p-3 md:p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow flex items-start gap-3 md:gap-4">
                  <div className="bg-[#fcb040]/10 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 md:w-6 md:h-6 text-[#fcb040]" />
                  </div>
                  <div>
                    <h3 className="text-base md:text-lg font-bold mb-0.5 md:mb-1 text-gray-900">{t("email")}</h3>
                    <p className="text-sm md:text-base text-gray-700">
                      <a href="mailto:zouggarizakaria19@gmail.com" className="hover:text-[#fcb040] transition-colors">
                        zouggarizakaria19@gmail.com
                      </a>
                    </p>
                  </div>
                </div>

                {/* Hours */}
                <div className="bg-gray-50 p-3 md:p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow flex items-start gap-3 md:gap-4">
                  <div className="bg-[#fcb040]/10 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 md:w-6 md:h-6 text-[#fcb040]" />
                  </div>
                  <div>
                    <h3 className="text-base md:text-lg font-bold mb-0.5 md:mb-1 text-gray-900">
                      {t("opening_hours")}
                    </h3>
                    <p className="text-sm md:text-base text-gray-700">{t("monday_friday")}</p>
                    <p className="text-sm md:text-base text-gray-700">{t("saturday")}</p>
                    <p className="text-sm md:text-base text-gray-700">{t("sunday")}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form - More compact for mobile */}
            <div
              className={`transition-all duration-700 delay-200 transform ${
                isLoaded ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
              }`}
            >
              <h2 className="text-2xl md:text-4xl font-bold mb-5 md:mb-8 text-gray-900">{t("send_message")}</h2>

              {/* Success Message */}
              {submitSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-3 md:px-4 py-2 md:py-3 rounded-lg mb-4 md:mb-6 flex items-center text-sm md:text-base">
                  <svg className="w-4 h-4 md:w-5 md:h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{t("success_message")}</span>
                </div>
              )}

              {/* Error Message */}
              {submitError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 md:px-4 py-2 md:py-3 rounded-lg mb-4 md:mb-6 flex items-center text-sm md:text-base">
                  <svg className="w-4 h-4 md:w-5 md:h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{errorMessage || t("error_message")}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3 md:space-y-5">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                    {t("full_name")} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 md:px-4 py-2 md:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fcb040] focus:border-transparent text-sm md:text-base"
                    placeholder={t("your_name")}
                  />
                </div>

                {/* Email and Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5">
                  <div>
                    <label htmlFor="email" className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                      {t("email")} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-3 md:px-4 py-2 md:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fcb040] focus:border-transparent text-sm md:text-base"
                      placeholder={t("your_email")}
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                      {t("phone")}
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 md:px-4 py-2 md:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fcb040] focus:border-transparent text-sm md:text-base"
                      placeholder={t("your_phone")}
                    />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                    {t("subject")} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-3 md:px-4 py-2 md:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fcb040] focus:border-transparent text-sm md:text-base"
                    placeholder={t("message_subject")}
                  />
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                    {t("message")} <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-3 md:px-4 py-2 md:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fcb040] focus:border-transparent resize-none text-sm md:text-base"
                    placeholder={t("your_message")}
                  ></textarea>
                </div>

                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#fcb040] hover:bg-[#e9a439] text-white font-medium py-2 md:py-2.5 px-3 md:px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed text-sm md:text-base"
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 md:h-5 md:w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        {t("sending")}
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 md:w-5 md:h-5" />
                        {t("send")}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Map - More compact for mobile */}
          <div
            className={`mt-10 md:mt-16 transition-all duration-700 delay-400 transform ${
              isLoaded ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
            }`}
          >
            <h2 className="text-2xl md:text-4xl font-bold mb-5 md:mb-8 text-gray-900">{t("our_location")}</h2>
            <div className="rounded-xl overflow-hidden shadow-lg h-60 md:h-96">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d108703.59798161705!2d-8.0780426!3d31.6346023!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xdafee8d96179e51%3A0x5950b6534f87adb8!2sMarrakesh%2C%20Morocco!5e0!3m2!1sen!2sus!4v1621436761410!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Zouggari Transport Location"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
