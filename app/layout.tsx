import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { initAnalytics } from '@/lib/analytics';
import Script from 'next/script';
import content from '@/app/content/z21.json';
import AnalyticsInit from '@/app/components/AnalyticsInit';

export const metadata: Metadata = {
  title: content.seo.title,
  description: content.seo.description,
  keywords: 'AI workflows, productivity, founders, cohort, automation, Z21, modern startup',
  authors: [{ name: 'Z21 Founders' }],
  creator: 'Z21 Founders',
  publisher: 'Z21 Founders',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://z21founders.hq'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: content.seo.title,
    description: content.seo.description,
    url: 'https://z21founders.hq',
    siteName: 'Z21 Founders',
    images: [
      {
        url: content.seo.ogImage,
        width: 1200,
        height: 630,
        alt: 'Z21 Founders - Transform AI potential into production power',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: content.seo.title,
    description: content.seo.description,
    images: [content.seo.ogImage],
    creator: content.seo.twitter,
  },
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
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="canonical" href="https://z21founders.hq" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Favicons */}
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96.png" />
        <link rel="icon" type="image/png" sizes="180x180" href="/favicon-180.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/favicon-512.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon-180.png" />
        {/* Optionally keep .ico for legacy support */}
        <link rel="shortcut icon" href="/favicon.ico" />

        {/* Preload critical fonts */}
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          as="style"
        />
        
        {/* Organization Schema */}
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Z21 Founders",
              "url": "https://z21founders.hq",
              "logo": "https://z21founders.hq/og/z21-og.jpg",
              "sameAs": [content.seo.twitter],
              "description": content.seo.description
            })
          }}
        />
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-QXV287SDEN"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-QXV287SDEN');
          `}
        </Script>
      </head>
      <body className="font-sans antialiased selection:bg-accent/10">
        {children}
      </body>
    </html>
  );
}
