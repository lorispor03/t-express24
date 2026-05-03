import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";
import BundleBar from "@/components/BundleBar";
import ConsentBanner from "@/components/ConsentBanner";
import ChatWidget from "@/components/ChatWidget";

const SITE_URL = "https://t-express24.shop";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "T-EXPRESS24 | Premium Fussball Trikots aus der Schweiz",
    template: "%s | T-EXPRESS24",
  },
  description:
    "Premium Fussballtrikots aus der Schweiz. Über 4'500 Artikel aus 10 Top-Ligen – Fan, Player, Retro, Kinder & Damen. Kostenloser Versand, 100% geprüfte Qualität.",
  keywords: [
    "Fussballtrikots",
    "Trikots Schweiz",
    "Premier League Trikot",
    "La Liga Trikot",
    "Bundesliga Trikot",
    "Serie A Trikot",
    "Retro Trikot",
    "Player Version",
    "T-EXPRESS24",
  ],
  authors: [{ name: "T-EXPRESS24" }],
  creator: "T-EXPRESS24",
  publisher: "T-EXPRESS24",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "de_CH",
    url: SITE_URL,
    siteName: "T-EXPRESS24",
    title: "T-EXPRESS24 | Premium Fussball Trikots aus der Schweiz",
    description:
      "Premium Fussballtrikots aus der Schweiz. Über 4'500 Artikel aus 10 Top-Ligen – Fan, Player, Retro, Kinder & Damen. Kostenloser Versand, 100% geprüfte Qualität.",
  },
  twitter: {
    card: "summary_large_image",
    title: "T-EXPRESS24 | Premium Fussball Trikots aus der Schweiz",
    description:
      "Premium Fussballtrikots aus der Schweiz. Über 4'500 Artikel aus 10 Top-Ligen. Kostenloser Versand, 100% geprüfte Qualität.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://img.wpassets-gamma.com" />
        <link rel="dns-prefetch" href="https://img.wpassets-gamma.com" />
        {/* Always start at the top on reload, never restore the previous scroll position. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `if('scrollRestoration' in history){history.scrollRestoration='manual';}window.scrollTo(0,0);`,
          }}
        />
      </head>
      <body className="antialiased">
        <CartProvider>
          {children}
          <CartDrawer />
          <BundleBar />
          <ConsentBanner />
          <ChatWidget />
        </CartProvider>
      </body>
    </html>
  );
}
