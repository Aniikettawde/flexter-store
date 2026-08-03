import type { Metadata, Viewport } from "next";
import { Unbounded, Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";

import "./globals.css";
import GrainOverlay from "@/components/GrainOverlay";
import { PRODUCT } from "@/lib/product";

const display = Unbounded({
  subsets: ["latin"],
  weight: ["500", "700", "900"],
  variable: "--font-display",
  display: "swap",
});
const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

const BASE_URL = "https://flexter.in";
const OG_IMAGE = `${BASE_URL}${PRODUCT.images[0]}`;

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: `${PRODUCT.name} — ₹${PRODUCT.price}`,
    template: `%s — Flexter`,
  },
  description: PRODUCT.description,
  keywords: [
    "compression tee",
    "gym t-shirt",
    "workout compression shirt",
    "4-way stretch t-shirt",
    "sweat wicking t-shirt India",
    "Flexter",
  ],
  applicationName: "Flexter",
  authors: [{ name: "Flexter" }],
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: BASE_URL,
    siteName: "Flexter",
    title: `${PRODUCT.name} — ₹${PRODUCT.price}`,
    description: PRODUCT.description,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 1200,
        alt: PRODUCT.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${PRODUCT.name} — ₹${PRODUCT.price}`,
    description: PRODUCT.description,
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  icons: {
    icon: "/images/logo.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: PRODUCT.name,
    image: PRODUCT.images.map((img) => `${BASE_URL}${img}`),
    description: PRODUCT.description,
    sku: PRODUCT.sku,
    brand: {
      "@type": "Brand",
      name: "Flexter",
    },
    offers: {
      "@type": "Offer",
      url: BASE_URL,
      priceCurrency: PRODUCT.currency,
      price: PRODUCT.price,
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    },
    // No aggregateRating/review block — the current reviews are hardcoded
    // placeholder data, not verified customer submissions. Add this back
    // once reviews are backed by real, stored purchases.
  };

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Flexter",
    url: BASE_URL,
    logo: `${BASE_URL}/images/logo.png`,
  };

  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className="bg-ink text-paper font-body antialiased selection:bg-paper selection:text-ink">
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-HBT8XEBVEW"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-HBT8XEBVEW');
          `}
        </Script>

        <GrainOverlay />
        {children}
      </body>
    </html>
  );
}