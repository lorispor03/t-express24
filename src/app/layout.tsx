import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";
import BundleBar from "@/components/BundleBar";
import ConsentBanner from "@/components/ConsentBanner";
import ChatWidget from "@/components/ChatWidget";

export const metadata: Metadata = {
  title: "T-EXPRESS24 | Premium Fussball Trikots",
  description: "Dein Shop für Premium Fussball Trikots aus der Schweiz. Alle Ligen, alle Teams.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
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
