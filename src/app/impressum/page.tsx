import Header from '@/components/Header';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Impressum | T-EXPRESS24',
  description: 'Impressum von T-EXPRESS24 – Kontaktinformationen und Angaben zum Betreiber.',
};

export default function ImpressumPage() {
  return (
    <>
      <Header />
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#111] via-[var(--red-dark)] to-[#111]" />
        <div className="relative max-w-3xl mx-auto px-4 py-10 md:py-16">
          <h1 className="text-2xl md:text-4xl font-black mb-8">Impressum</h1>

          <div className="space-y-6 text-sm text-gray-300 leading-relaxed">

            <div>
              <h2 className="text-lg font-bold text-white mb-2">Angaben zum Betreiber</h2>
              <p>
                T-EXPRESS24<br />
                Loris Porreca<br />
                Vogelsangstrasse 1a<br />
                5620 Bremgarten<br />
                Schweiz
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-white mb-2">Kontakt</h2>
              <p>
                E-Mail: <a href="mailto:kontakt@t-express24.shop" className="text-[var(--gold)] hover:underline">kontakt@t-express24.shop</a><br />
                Instagram: <a href="https://instagram.com/T_express247" target="_blank" rel="noopener noreferrer" className="text-[var(--gold)] hover:underline">@T_express247</a>
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-white mb-2">Unternehmensform</h2>
              <p>Einzelunternehmen (nicht im Handelsregister eingetragen)</p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-white mb-2">Haftungsausschluss</h2>
              <p>
                T-EXPRESS24 übernimmt keine Gewähr für die Richtigkeit, Vollständigkeit und Aktualität der
                bereitgestellten Informationen auf dieser Webseite. Haftungsansprüche, die sich auf Schäden
                materieller oder ideeller Art beziehen, die durch die Nutzung oder Nichtnutzung der dargebotenen
                Informationen verursacht wurden, sind grundsätzlich ausgeschlossen.
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
