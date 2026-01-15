import type { Metadata, Viewport } from 'next';
import { Inter, Oswald, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const oswald = Oswald({
  subsets: ['latin'],
  variable: '--font-oswald',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

// ============================================================================
// VIEWPORT CONFIGURATION (Updated: Jan 2026)
// ============================================================================
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8fafc' },
    { media: '(prefers-color-scheme: dark)', color: '#172554' },
  ],
};

// ============================================================================
// METADATA CONFIGURATION
// ============================================================================
const siteConfig = {
  name: 'Mountain Goats CDMX',
  title: 'Mountain Goats CDMX | Conquista las Montañas de CDMX y alrededores',
  description: 'Entrenamiento. Comunidad. Aventura.',
  url: process.env.NEXT_PUBLIC_BASE_URL || 'https://mountaingoats.mx',
  ogImage: '/og-image.jpg',
};

export const metadata: Metadata = {
  // Base URL for resolving relative URLs
  metadataBase: new URL(siteConfig.url),

  // Title configuration
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },

  // Description
  description: siteConfig.description,

  // Keywords for SEO
  keywords: [
    'senderismo',
    'CDMX',
    'hiking',
    'alta montaña',
    'entrenamiento',
    'Iztaccíhuatl',
    'Nevado de Toluca',
    'La Malinche',
    'Ajusco',
    'trekking México',
    'expediciones',
    'montañismo',
  ],

  // Authors
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Icons
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },

  // Manifest
  manifest: '/site.webmanifest',

  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} - Expediciones de Alta Montaña`,
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: '@mountaingoatscdmx',
  },

  // Verification (add your own IDs when ready)
  // verification: {
  //   google: 'your-google-verification-code',
  //   yandex: 'your-yandex-verification-code',
  // },

  // Alternate languages (if you add English version later)
  alternates: {
    canonical: siteConfig.url,
    languages: {
      'es-MX': siteConfig.url,
    },
  },

  // Category
  category: 'sports',
};

// ============================================================================
// ROOT LAYOUT
// ============================================================================
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html 
      lang="es" 
      className={`${inter.variable} ${oswald.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        
        {/* DNS Prefetch for Supabase */}
        <link rel="dns-prefetch" href="https://dwdhmitjgsnzoyeibvfy.supabase.co" />
      </head>
      <body className="font-sans antialiased bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
