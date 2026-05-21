import Header from '@/components/Header';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lieferung & Versand | T-EXPRESS24',
  description: 'Informationen zu Liefermöglichkeiten, Versandkosten und Lieferzeiten bei T-EXPRESS24.',
};

export default function LieferungPage() {
  return (
    <>
      <Header />
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#111] via-[var(--red-dark)] to-[#111]" />
        <div className="relative max-w-3xl mx-auto px-4 py-10 md:py-16">
          <h1 className="text-2xl md:text-4xl font-black mb-8">Lieferung & Versand</h1>

          <div className="space-y-8 text-sm text-gray-300 leading-relaxed">

            <div>
              <h2 className="text-lg font-bold text-white mb-2">Liefergebiet</h2>
              <p>
                Wir liefern in die Schweiz sowie in angrenzende Länder. Der Versand erfolgt aus der Schweiz.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-white mb-2">Versandkosten</h2>
              <p>Der Versand innerhalb der Schweiz ist kostenlos.</p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-white mb-2">Lieferzeit</h2>
              <p>
                Die voraussichtliche Lieferzeit beträgt in der Regel <strong className="text-white">2–3 Wochen</strong> ab
                Zahlungseingang. Die Ware wird aus einem internationalen Lager zu uns in die Schweiz geliefert,
                einer Qualitätskontrolle unterzogen und anschliessend an dich versendet.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-white mb-2">Versandart</h2>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li><strong className="text-white">Einzelne Trikots:</strong> Vakuumverpackt im Briefumschlag, Versand per A-Post</li>
                <li><strong className="text-white">Bundles (mehrere Trikots):</strong> Versand als Paket per A-Post</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-bold text-white mb-2">Qualitätskontrolle</h2>
              <p>
                Jedes Trikot wird vor dem Versand von uns persönlich auf Material, Verarbeitung und Bedruckung
                geprüft. Erst nach bestandener Kontrolle wird die Ware an dich versendet.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-white mb-2">Sendungsverfolgung</h2>
              <p>
                Nach dem Versand erhältst du per E-Mail eine Bestätigung. Bei Fragen zum Lieferstatus
                kontaktiere uns jederzeit über <a href="mailto:kontakt@t-express24.shop" className="text-[var(--gold)] hover:underline">kontakt@t-express24.shop</a> oder
                {' '}<a href="https://instagram.com/T_express247" target="_blank" rel="noopener noreferrer" className="text-[var(--gold)] hover:underline">Instagram</a>.
              </p>
            </div>

            <p className="text-xs text-gray-500 pt-4 border-t border-white/10">
              Stand: {new Date().toLocaleDateString('de-CH', { year: 'numeric', month: 'long' })}
            </p>

          </div>
        </div>
      </section>
      <Footer dark />
    </>
  );
}
