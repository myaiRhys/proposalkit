import type { Metadata } from 'next'
import { Inter, Syne } from 'next/font/google'
import { AppProvider } from '@/context/AppContext'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
})

export const metadata: Metadata = {
  title: 'ProposalKit — Professional proposals in 30 seconds',
  description: 'AI-powered proposal generator. Fill in a brief, get a complete professional proposal written by Claude in under 30 seconds.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${syne.variable}`}>
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  )
}
