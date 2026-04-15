'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';

export default function CheckoutSuccessPage() {
  const { clearCart } = useCart();

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
        <h1 className="text-3xl font-bold mb-3" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Zahlung erfolgreich!</h1>
        <p className="text-gray-400 mb-2">Vielen Dank für deine Bestellung bei T-EXPRESS24.</p>
        <p className="text-gray-500 text-sm mb-8">Du erhältst in Kürze eine Bestätigung per E-Mail.</p>
        <a href="/" className="inline-block bg-[var(--red-main)] hover:bg-[#a81d27] text-white font-bold py-3 px-8 rounded-lg text-sm transition-colors">
          Zurück zum Shop
        </a>
      </section>
      <Footer />
    </>
  );
}
