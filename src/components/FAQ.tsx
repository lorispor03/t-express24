'use client';

import { useState } from 'react';

const faqs = [
  {
    q: 'Wie lange dauert die Lieferung?',
    a: 'Die Lieferzeit beträgt in der Regel 2–3 Wochen. Unsere Trikots werden aus einem internationalen Lager in die Schweiz geliefert, hier von uns persönlich geprüft und anschliessend direkt zu dir nach Hause versendet.',
  },
  {
    q: 'Welche Grössen sind verfügbar?',
    a: 'Für Erwachsene bieten wir S bis XXL an, für Kinder die Grössen 116, 128, 140, 152 und 164. Bei Unsicherheiten beraten wir dich gerne über Instagram.',
  },
  {
    q: 'Wie bezahle ich?',
    a: 'Wir akzeptieren TWINT, PayPal und Banküberweisung. Die Zahlung erfolgt nach Bestellbestätigung.',
  },
  {
    q: 'Wie ist die Qualität der Trikots?',
    a: 'Jedes einzelne Trikot wird von uns in der Schweiz persönlich auf Qualität, Verarbeitung und Druckbild geprüft, bevor es versendet wird. Sollte etwas nicht unseren Standards entsprechen, versenden wir kostenlos Ersatz.',
  },
  {
    q: 'Kann ich ein Trikot zurückgeben?',
    a: 'Rückgaben sind leider nicht möglich. Bei nachweisbaren Mängeln liefern wir dir selbstverständlich kostenlos ein neues Trikot.',
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h2 className="text-2xl md:text-3xl font-black mb-8 text-center">Häufige Fragen</h2>
      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <div key={i} className="bg-[#1a1a1a] rounded-xl border border-white/5 overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left"
            >
              <span className="font-semibold text-sm pr-4">{faq.q}</span>
              <svg
                className={`w-5 h-5 flex-shrink-0 text-gray-500 transition-transform ${open === i ? 'rotate-180' : ''}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {open === i && (
              <div className="px-5 pb-4">
                <p className="text-sm text-gray-400 leading-relaxed">{faq.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
