"use client"
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { trpc } from '@/utils/trpc'

const inter = Inter({ subsets: ['latin'] })



function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}

export default RootLayout