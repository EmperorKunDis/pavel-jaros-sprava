import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../global.css";
import ClientBody from "../ClientBody";
import {NextIntlClientProvider} from 'next-intl';
import {getMessages, getTranslations} from 'next-intl/server';
import {routing} from '../../../i18n/routing';
import {notFound} from 'next/navigation';
import {ErrorBoundary} from '../../components/ErrorBoundary';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata({params}: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale});

  const title = "PJ Správa - Správa nemovitostí | Pavel Jaroš";
  const description = "Profesionální správa pronájmů v Karlovarském kraji. Garantovaný příjem z nájmu, prověření nájemníci, kompletní servis. Váš byt, naše starost.";

  return {
    title,
    description,
    keywords: ['správa nemovitostí', 'pronájem bytu', 'správa pronájmu', 'Karlovarský kraj', 'Karel Vary', 'garantovaný nájem', 'Pavel Jaroš', 'property management'],
    authors: [{name: 'Pavel Jaroš'}],
    creator: 'Pavel Jaroš',
    publisher: 'PJ Správa',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL('https://pjsprava.cz'),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        'cs': '/cs',
        'en': '/en',
        'de': '/de',
        'pl': '/pl',
        'sk': '/sk',
        'ru': '/ru',
      },
    },
    openGraph: {
      title,
      description,
      url: `https://pjsprava.cz/${locale}`,
      siteName: 'PJ Správa',
      locale: locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
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
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export const dynamic = 'force-static';

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}>) {
  const {locale} = await params;

  if (!routing.locales.includes(locale as typeof routing.locales[number])) {
    notFound();
  }

  const messages = await getMessages();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "PJ Správa - Pavel Jaroš",
    "telephone": "+420 777 558 730",
    "email": "pavel.jaros@kwcz.cz",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Kaprova 52/6",
      "addressLocality": "Praha 1",
      "addressCountry": "CZ"
    },
    "url": `https://pjsprava.cz/${locale}`,
    "description": "Profesionální správa pronájmů v Karlovarském kraji. Garantovaný příjem z nájmu, prověření nájemníci, kompletní servis.",
    "areaServed": {
      "@type": "AdministrativeArea",
      "name": "Karlovarský kraj"
    },
    "knowsAbout": ["Property Management", "Rental Management", "Tenant Screening", "Property Maintenance"],
    "priceRange": "12-20% z nájemného",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Tarify správy pronájmu",
      "itemListElement": [
        {"@type": "Offer", "name": "Tarif START", "price": "12%"},
        {"@type": "Offer", "name": "Tarif PLUS", "price": "15%"},
        {"@type": "Offer", "name": "Tarif PREMIUM", "price": "20%"}
      ]
    }
  };

  return (
    <html lang={locale} className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body suppressHydrationWarning className="antialiased">
        <NextIntlClientProvider messages={messages}>
          <ErrorBoundary>
            <ClientBody>{children}</ClientBody>
          </ErrorBoundary>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
