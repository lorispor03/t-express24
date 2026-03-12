'use client';

import { useState } from 'react';

const faqs = [
  {
    q: 'Wie bestelle ich ein Trikot?',
    a: 'Wähle dein Trikot auf unserer Seite aus und schreib uns per Instagram DM oder Telegram. Teile uns das gewünschte Trikot, die Grösse und optional eine Beflockung mit – wir kümmern uns um den Rest.',
  },
  {
    q: 'Wie lange dauert die Lieferung?',
    a: 'Die Lieferzeit beträgt in der Regel 2-3 Wochen. Jedes Trikot wird von uns persönlich qualitätsgeprüft, bevor es versendet wird.',
  },
  {
    q: 'Welche Grössen sind verfügbar?',
    a: 'Wir bieten die Grössen S bis XXL für Erwachsene an. Für Kinder haben wir die Grössen 116, 128, 140, 152 und 164. Schreib uns bei Unsicherheiten – wir beraten dich gerne.',
  },
  {
    q: 'Wie bezahle ich?',
    a: 'Wir akzeptieren TWINT, Banküberweisung und Barzahlung bei Abholung. Die Zahlung erfolgt nach Bestellbestätigung.',
  },
  {
    q: 'Kann ich eine Beflockung (Name/Nummer) bestellen?',
    a: 'Ja! Teile uns einfach den gewünschten Namen und die Nummer mit. Beflockungen sind bei den meisten Trikots möglich.',
  },
  {
    q: 'Sind die Trikots original?',
    a: 'Wir verkaufen hochwertige Trikots, die wir direkt von unserem Lieferanten beziehen. Jedes Trikot wird von uns in der Schweiz einzeln auf Qualität geprüft, bevor es an dich versendet wird.',
  },
  {
    q: 'Kann ich ein Trikot zurückgeben oder umtauschen?',
    a: 'Da jedes Trikot individuell bestellt wird, sind Rückgaben grundsätzlich nicht möglich. Bei Qualitätsmängeln finden wir selbstverständlich eine Lösung – schreib uns einfach.',
  },
  {
    q: 'Versendet ihr auch ausserhalb der Schweiz?',
    a: 'Aktuell versenden wir hauptsächlich innerhalb der Schweiz. Für Anfragen aus dem Ausland schreib uns gerne – wir schauen, was möglich ist.',
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h2 className="text-2xl md:text-3xl font-black mb-10 text-center">Häufige Fragen</h2>
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
