import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import OpenChatButton from '@/components/OpenChatButton';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Seite nicht gefunden',
  description: 'Die angefragte Seite existiert nicht oder wurde verschoben.',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <>
      <Header />
      <section className="relative overflow-hidden min-h-[70vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-[#111] via-[var(--red-dark)] to-[#111]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(196,34,46,0.3),transparent_70%)]" />

        <div className="relative max-w-3xl mx-auto px-4 py-16 md:py-24 text-center w-full">
          {/* Glitch 404 */}
          <div className="relative inline-block mb-6">
            <div className="text-[100px] md:text-[160px] font-black leading-none tracking-tighter bg-gradient-to-b from-white via-white to-[var(--gold)] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(196,34,46,0.4)]">
              404
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 mb-4">
            <Image
              src="/logo.png"
              alt="T-EXPRESS24"
              width={44}
              height={44}
              className="rounded-lg"
            />
            <span className="font-extrabold text-xl text-white">
              T-EXPRESS<span className="text-[var(--gold)]">24</span>
            </span>
          </div>

          <h1 className="text-2xl md:text-4xl font-black text-white mb-4">
            Offside! Diese Seite gibts nicht.
          </h1>
          <p className="text-sm md:text-base text-gray-300 max-w-xl mx-auto mb-10 leading-relaxed">
            Die URL existiert nicht, wurde verschoben oder das Produkt ist nicht mehr im Sortiment.
            Kein Problem — zurück zum Shop und weiter durch unsere Trikots stöbern.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link
              href="/"
              className="w-full sm:w-auto bg-[#1a1a1a] hover:bg-[#222] border border-white/15 text-white text-sm font-bold px-8 py-4 rounded-lg transition-colors"
            >
              Zurück zum Shop
            </Link>
            <Link
              href="/#ligen"
              className="w-full sm:w-auto bg-white/5 hover:bg-white/10 border border-white/15 text-white text-sm font-bold px-8 py-4 rounded-lg transition-colors"
            >
              Alle Ligen ansehen
            </Link>
          </div>

          <p className="text-xs text-gray-500 mt-10">
            Suchst du ein bestimmtes Trikot? Frag unseren{' '}
            <OpenChatButton />{' '}
            unten rechts — er hilft dir direkt weiter.
          </p>
        </div>
      </section>
      <Footer dark />
    </>
  );
}
