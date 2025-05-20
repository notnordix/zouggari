import type React from "react"
import type { Metadata } from "next"
import { Roboto } from "next/font/google"
import "./globals.css"
import FloatingContact from "@/components/floating-contact"
import LanguageSwitcher from "@/components/language-switcher"
import { LanguageProvider } from "@/lib/language-context"
import Script from "next/script"
import { incrementPageViews } from "@/lib/admin-auth"

const roboto = Roboto({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
})

export const metadata: Metadata = {
  title: "Zouggari Transport",
  description: "Premium transport services",
}

// Function to track page views - runs on the server for initial page load
async function trackPageView() {
  try {
    await incrementPageViews()
  } catch (error) {
    console.error("Failed to track page view:", error)
  }
  return null
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Track the page view on initial server render
  await trackPageView()

  return (
    <html lang="fr" className="scroll-smooth">
      <body className={`${roboto.variable} font-sans antialiased`}>
        <LanguageProvider>
          {children}
          {/* Client-side conditional rendering of FloatingContact and LanguageSwitcher */}
          <Script id="exclude-components-from-admin" strategy="afterInteractive">
            {`
              if (!window.location.pathname.startsWith('/admin')) {
                document.getElementById('floating-contact-container').style.display = 'block';
                document.getElementById('language-switcher-container').style.display = 'block';
              }
            `}
          </Script>
          <div id="floating-contact-container" style={{ display: "none" }}>
            <FloatingContact />
          </div>
          <div id="language-switcher-container" style={{ display: "none" }}>
            <LanguageSwitcher />
          </div>
          {/* Script to track client-side navigation */}
          <Script id="page-view-tracker" strategy="afterInteractive">
            {`
              // Track page views on client-side navigation
              let lastPath = window.location.pathname;
              let initialLoad = true;
              
              // Function to send page view to server
              async function sendPageView(path) {
                try {
                  // Skip the initial load since it's already counted server-side
                  if (initialLoad) {
                    initialLoad = false;
                    return;
                  }
                  
                  await fetch('/api/track-page-view', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ path }),
                  });
                } catch (error) {
                  // Silent fail - don't affect user experience
                  console.error('Failed to track page view:', error);
                }
              }
              
              // Check for path changes periodically (for SPA navigation)
              setInterval(() => {
                const currentPath = window.location.pathname;
                if (currentPath !== lastPath) {
                  lastPath = currentPath;
                  sendPageView(currentPath);
                }
              }, 1000);
            `}
          </Script>
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
        </LanguageProvider>
      </body>
    </html>
  )
}
