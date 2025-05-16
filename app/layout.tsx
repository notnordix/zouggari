import type React from "react"
import type { Metadata } from "next"
import { Roboto } from "next/font/google"
import "./globals.css"
import FloatingContact from "@/components/floating-contact"
import Script from "next/script"

const roboto = Roboto({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
})

export const metadata: Metadata = {
  title: "Zouggari Transport",
  description: "Premium transport services"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className={`${roboto.variable} font-sans antialiased`}>
        {children}
        <FloatingContact />
        <Script id="viewport-height-fix" strategy="afterInteractive">
          {`
            // Fix for mobile browser viewport height
            function setVH() {
              let vh = window.innerHeight * 0.01;
              document.documentElement.style.setProperty('--vh', \`\${vh}px\`);
            }
            
            // Set the height initially
            setVH();
            
            // Reset the height whenever the window's resized
            window.addEventListener('resize', setVH);
            
            // Reset when the orientation changes
            window.addEventListener('orientationchange', setVH);
          `}
        </Script>
      </body>
    </html>
  )
}
