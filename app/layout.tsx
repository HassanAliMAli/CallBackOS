import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/lib/stores/auth-context'
import { BusinessProvider } from '@/lib/stores/business-context'
import { LeadProvider } from '@/lib/stores/lead-context'
import { NotificationProvider } from '@/lib/stores/notification-context'
import { SidebarProvider } from '@/lib/stores/sidebar-context'
import './globals.css'

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
});

export const metadata: Metadata = {
  title: 'CallbackOS — Never Miss a Lead Again',
  description: 'AI-powered missed call management. CallbackOS automatically calls back your missed customers, handles the conversation, and delivers qualified leads.',
  generator: 'Next.js',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider>
          <BusinessProvider>
            <LeadProvider>
              <NotificationProvider>
                <SidebarProvider>
                  {children}
                </SidebarProvider>
              </NotificationProvider>
            </LeadProvider>
          </BusinessProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
