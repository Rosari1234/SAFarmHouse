import type { Metadata } from 'next'
import './globals.css'
import ExternalStyles from '../components/ExternalStyles'

export const metadata: Metadata = {
  title: 'Safaram Shop',
  description: 'Farm shop management system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ExternalStyles />
        {children}
      </body>
    </html>
  )
}