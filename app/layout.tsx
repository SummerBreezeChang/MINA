import type React from "react"
import type { Metadata } from "next"

import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

import {
  Space_Grotesk,
  JetBrains_Mono,
  Space_Grotesk as V0_Font_Space_Grotesk,
  Geist_Mono as V0_Font_Geist_Mono,
  Noto_Serif as V0_Font_Noto_Serif,
} from "next/font/google"

// Initialize fonts
const _spaceGrotesk = V0_Font_Space_Grotesk({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] })
const _geistMono = V0_Font_Geist_Mono({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
})
const _notoSerif = V0_Font_Noto_Serif({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
})

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-sans" })
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
  title: "Mina - Startup Career Scout",
  description:
    "Discover startup insights in real-time. Mina helps founders, creators, and investors track trends, startups, and funding with AI-powered research.",
  generator: "v0.app",
  metadataBase: new URL("https://mina-startup-scout.vercel.app"),
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    type: "website",
    title: "Mina - Discover Startup Insights in Real-Time",
    description:
      "AI-powered startup research assistant. Track trends, discover new companies, and monitor funding rounds — all in one dashboard.",
    images: [
      {
        url: "/mina-social.png",
        width: 1200,
        height: 630,
        alt: "Mina - Startup Intelligence Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mina - Discover Startup Insights in Real-Time",
    description:
      "AI-powered startup research assistant. Track trends, discover new companies, and monitor funding rounds.",
    images: ["/mina-social.png"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
