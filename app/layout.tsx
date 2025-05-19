import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Nunito } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "VibeAPI - Workflow Automator",
  description: "A minimal workflow automator with step-based automation",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={nunito.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
