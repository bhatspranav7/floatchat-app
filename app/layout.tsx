import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "OceanScope AI - Advanced Ocean Intelligence Platform",
  description:
    "AI-Powered Ocean Data Discovery and Visualization Platform. Explore ARGO floats, satellite altimetry, sea surface temperature, ocean color, sea ice, and biogeochemical data through intelligent conversations.",
  keywords:
    "ocean data, ARGO floats, satellite altimetry, sea surface temperature, ocean color, sea ice, biogeochemical data, oceanography, AI assistant, marine science",
  authors: [{ name: "OceanScope AI Team" }],
  creator: "OceanScope AI",
  publisher: "OceanScope AI",
  generator: "v0.app",
  applicationName: "OceanScope AI",
  referrer: "origin-when-cross-origin",
  category: "Science & Technology",
  classification: "Oceanographic Data Platform",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1e40af" },
    { media: "(prefers-color-scheme: dark)", color: "#3b82f6" },
  ],
  colorScheme: "light dark",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://oceanscope-ai.vercel.app",
    title: "OceanScope AI - Advanced Ocean Intelligence Platform",
    description:
      "Explore comprehensive oceanographic data through AI-powered conversations. Access ARGO floats, satellite data, and marine insights.",
    siteName: "OceanScope AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "OceanScope AI - Advanced Ocean Intelligence Platform",
    description: "AI-powered ocean data discovery and visualization platform",
    creator: "@oceanscope_ai",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} antialiased dark`}>
      <body className="font-sans bg-background text-foreground">
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
