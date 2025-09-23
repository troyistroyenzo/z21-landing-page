import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { initAnalytics } from '@/lib/analytics';
import Script from 'next/script';
import content from '@/app/content/z21.json';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: content.seo.title,
  description: content.seo.description,
  keywords: 'AI workflows, productivity, founders, cohort, automation, Z21',
  authors: [{ name: 'Z21 Founders HQ' }],
  creator: 'Z21 Founders HQ',
  publisher: 'Z21 Founders HQ',
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
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="canonical" href="https://z21founders.hq" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Organization Schema */}
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Z21 Founders HQ",
              "url": "https://z21founders.hq",
              "logo": "https://z21founders.hq/og/z21-og.jpg",
              "sameAs": [
                content.seo.twitter
              ],
              "description": content.seo.description
            })
          }}
        />
        
        {/* Course Schema */}
        <Script
          id="course-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Course",
              "name": "Z21 Cohort — Zero→One AI Shipping (6 weeks)",
              "description": "Install one production AI workflow, publish a 90s VSL, launch an offer page, and book 2+ qualified calls in 6 weeks.",
              "provider": {
                "@type": "Organization",
                "name": "Z21",
                "sameAs": "https://z21founders.hq"
              },
              "hasCourseInstance": {
                "@type": "CourseInstance",
                "courseMode": "online",
                "duration": "P6W",
                "courseWorkload": "PT6H"
              }
            })
          }}
        />
        
        {/* FAQ Schema */}
        <Script
          id="faq-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": content.faq.items.map(item => ({
                "@type": "Question",
                "name": item.q,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": item.a
                }
              }))
            })
          }}
        />
      </head>
      <body className="font-sans antialiased">
        {children}
        <Script
          id="analytics-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                ${initAnalytics.toString()}
                initAnalytics();
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}
