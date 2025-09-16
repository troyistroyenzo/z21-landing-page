# Z21 Founders Landing Page

A production-ready landing page for Z21 Founders built with Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion, and Lenis smooth scrolling.

## 🚀 Features

- **Modern Stack**: Next.js 14 App Router, TypeScript, Tailwind CSS
- **Smooth Animations**: Framer Motion for scroll animations, Lenis for smooth scrolling
- **Responsive Design**: Mobile-first, works great on 390–1440px screens
- **SEO Optimized**: Full meta tags, OpenGraph, Twitter Cards
- **Analytics Ready**: Fathom, Meta Pixel, YouTube tracking placeholders
- **Accessible**: WCAG compliant with keyboard navigation and screen reader support
- **Performance**: Optimized for Lighthouse scores ≥ 90

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd z21-v2
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file based on `.env.example`:
```bash
cp .env.example .env.local
```

4. Configure your environment variables in `.env.local`

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## 🔧 Environment Variables

Create a `.env.local` file with the following variables:

```env
# Application URLs
NEXT_PUBLIC_COHORT_URL=https://typeform.com/to/YOUR_FORM_ID
NEXT_PUBLIC_FOUNDERS_URL=https://skool.com/YOUR_COMMUNITY
NEXT_PUBLIC_MANYCHAT_BUILD=https://m.me/YOUR_PAGE?ref=BUILD
NEXT_PUBLIC_MANYCHAT_COHORT=https://m.me/YOUR_PAGE?ref=COHORT
NEXT_PUBLIC_MANYCHAT_FOUNDERS=https://m.me/YOUR_PAGE?ref=FOUNDERS

# Analytics
NEXT_PUBLIC_FATHOM_SITE_ID=YOUR_FATHOM_SITE_ID
NEXT_PUBLIC_META_PIXEL=YOUR_META_PIXEL_ID
NEXT_PUBLIC_YOUTUBE_TRACKING=YOUR_YOUTUBE_TRACKING_ID

# Email Service (for production)
CONVERTKIT_API_KEY=YOUR_CONVERTKIT_API_KEY
CONVERTKIT_FORM_ID=YOUR_FORM_ID
# OR
BEEHIIV_API_KEY=YOUR_BEEHIIV_API_KEY
BEEHIIV_PUBLICATION_ID=YOUR_PUBLICATION_ID
```

## 📁 Project Structure

```
z21-v2/
├── app/
│   ├── api/
│   │   └── subscribe/      # Newsletter subscription endpoint
│   ├── components/          # React components
│   │   ├── Container.tsx
│   │   ├── CTAButton.tsx
│   │   ├── FAQ.tsx
│   │   ├── Features.tsx
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   ├── Proof.tsx
│   │   ├── Section.tsx
│   │   └── VSL.tsx
│   ├── content/
│   │   └── z21.json        # Centralized copy/content
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout with SEO
│   └── page.tsx            # Homepage
├── lib/
│   └── analytics.ts        # Analytics utilities
├── public/                 # Static assets
└── tailwind.config.ts      # Tailwind configuration
```

## 🎨 Design System

### Colors
- **Emerald-950**: `#0F3B2E` (Deep emerald)
- **Paper**: `#F7F5EE` (Off-white)
- **Ink**: `#0B0B0B` (Near black)
- **Rust**: `#C56B36` (Accent rust)

### Typography
- **Display Large**: 64px (mobile) / 80px (desktop)
- **Display**: 48px
- **Display Small**: 32px
- **Body Large**: 20px
- **Body**: 16px
- **Body Small**: 14px

### Spacing
- Container max-width: 1280px
- Container padding: 24px
- Section padding: 80px (mobile) / 128px (desktop)

## 📝 Content Management

All text content is centralized in `/app/content/z21.json`. To update copy:

1. Edit `/app/content/z21.json`
2. Changes will automatically reflect throughout the site
3. No need to modify component files

## 🎥 Video Setup

1. Add your VSL video to `/public/video/z21-vsl.mp4`
2. Add a poster image to `/public/video/poster.jpg`
3. Update the paths in `/app/content/z21.json` if different

## 🖼️ Social Preview Images

Add the following images to `/public/`:
- `favicon.ico` - Browser favicon
- `favicon-16x16.png` - Small favicon
- `apple-touch-icon.png` - Apple devices icon
- `og-image.jpg` - OpenGraph preview (1200x630px)
- `twitter-image.jpg` - Twitter card preview (1200x630px)

## 📊 Analytics Integration

### Fathom Analytics
1. Sign up at [usefathom.com](https://usefathom.com)
2. Create a new site
3. Add your Site ID to `NEXT_PUBLIC_FATHOM_SITE_ID`

### Meta Pixel
1. Create a Meta Pixel in Facebook Business Manager
2. Add your Pixel ID to `NEXT_PUBLIC_META_PIXEL`

### Newsletter Integration
The `/api/subscribe` endpoint is a stub. For production:

**ConvertKit:**
- Uncomment the ConvertKit code in `/app/api/subscribe/route.ts`
- Add your API key and Form ID to environment variables

**Beehiiv:**
- Uncomment the Beehiiv code in `/app/api/subscribe/route.ts`
- Add your API key and Publication ID to environment variables

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

### Manual Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🧪 Testing

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Run production build locally
npm start

# Type checking
npm run type-check

# Linting
npm run lint
```

## 📈 Performance Checklist

- [ ] Lighthouse Performance ≥ 90
- [ ] Lighthouse Accessibility ≥ 90
- [ ] Lighthouse Best Practices ≥ 90
- [ ] Lighthouse SEO ≥ 90
- [ ] CLS < 0.05
- [ ] Mobile responsive (390-1440px)
- [ ] Keyboard navigable
- [ ] Screen reader compatible

## 🛟 Support

For issues or questions, contact: hello@z21founders.hq

## 📄 License

© 2025 Z21 Founders HQ. All rights reserved.
# z21-landing-page
