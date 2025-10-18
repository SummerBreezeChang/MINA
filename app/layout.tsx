import type React from "react"
import type { Metadata } from "next"

import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

import { Space_Grotesk, JetBrains_Mono, Archivo as V0_Font_Archivo, Geist_Mono as V0_Font_Geist_Mono, Noto_Serif as V0_Font_Noto_Serif } from 'next/font/google'

// Initialize fonts
const _archivo = V0_Font_Archivo({ subsets: ['latin'], weight: ["100","200","300","400","500","600","700","800","900"] })
const _geistMono = V0_Font_Geist_Mono({ subsets: ['latin'], weight: ["100","200","300","400","500","600","700","800","900"] })
const _notoSerif = V0_Font_Noto_Serif({ subsets: ['latin'], weight: ["100","200","300","400","500","600","700","800","900"] })

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-serif" })
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-serif" })

export const metadata: Metadata = {
  title: "Mina - Your Intelligent Shopping Agent",
  description:
    "Find, compare, and recommend the best products for your business — fast, smart, and beautifully simple.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} font-serif antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
