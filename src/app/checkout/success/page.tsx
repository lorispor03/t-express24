'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';

export default function CheckoutSuccessPage() {
  const { clearCart } = useCart();
  const searchParams = useSearchParams();
  const bestellNr = searchParams.get('nr') || '';
  const kontaktweg = searchParams.get('kontakt') || 'instagram';
  const [copied, setCopied] = useState(false);

  const copyNr = () => {
    navigator.clipboard.writeText(bestellNr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <>
      <Header />
      <section className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold mb-3 text-gray-900" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Bestellung eingegangen!</h1>
        <p className="text-gray-500 mb-2">Vielen Dank für deine Bestellung bei T-EXPRESS24.</p>

        {bestellNr && (
          <div className="bg-gray-100 rounded-xl px-6 py-4 inline-block my-4 border border-gray-200">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Deine Bestellnummer</p>
            <button onClick={copyNr} className="flex items-center gap-2 mx-auto">
              <span className="text-2xl font-black text-gray-900" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{bestellNr}</span>
              {copied ? (
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
              ) : (
                <svg className="w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></svg>
              )}
            </button>
          </div>
        )}

        {kontaktweg === 'instagram' ? (
          <>
            <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
              Wir melden uns bei dir auf Instagram zur Zahlungsabwicklung und zum Versand.
            </p>
            <a
              href="https://instagram.com/T_express247"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white font-bold py-3.5 px-8 rounded-lg text-sm transition-opacity hover:opacity-90"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              @T_express247 folgen
            </a>
          </>
        ) : (
          <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
            Wir melden uns bei dir per E-Mail zur Zahlungsabwicklung und zum Versand.
          </p>
        )}

        <div className="mt-8">
          <a href="/" className="inline-block bg-[var(--red-main)] hover:bg-[#a81d27] text-white font-bold py-3 px-8 rounded-lg text-sm transition-colors">
            Zurück zum Shop
          </a>
        </div>
      </section>
      <Footer />
    </>
  );
}
