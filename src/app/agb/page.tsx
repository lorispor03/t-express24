import Header from '@/components/Header';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Geschäftsbedingungen | T-EXPRESS24',
  description: 'Geschäftsbedingungen von T-EXPRESS24 – Lieferung, Zahlung, Rückgabe und mehr.',
};

export default function AGBPage() {
  return (
    <>
      <Header />
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#111] via-[var(--red-dark)] to-[#111]" />
        <div className="relative max-w-3xl mx-auto px-4 py-10 md:py-16">
          <h1 className="text-2xl md:text-4xl font-black mb-8">Geschäftsbedingungen</h1>

          <div className="space-y-8 text-sm text-gray-300 leading-relaxed">

            <div>
              <h2 className="text-lg font-bold text-white mb-2">1. Allgemeines</h2>
              <p>
                Diese Geschäftsbedingungen gelten für alle Bestellungen über den Online-Shop von T-EXPRESS24.
                Mit der Nutzung des Shops und der Aufgabe einer Bestellung akzeptierst du diese Bedingungen.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-white mb-2">2. Sortiment</h2>
              <p>
                T-EXPRESS24 bietet Fussball-Trikots und verwandte Artikel an. Alle Artikel werden vor dem Versand
                einzeln auf Qualität geprüft.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-white mb-2">3. Preise & Währung</h2>
              <p>
                Alle Preise sind in Schweizer Franken (CHF) angegeben. T-EXPRESS24 ist nicht mehrwertsteuerpflichtig,
                daher wird keine MwSt. ausgewiesen.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-white mb-2">4. Zahlung</h2>
              <p>
                Folgende Zahlungsmethoden stehen zur Verfügung:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>PayPal</li>
                <li>Twint</li>
              </ul>
              <p className="mt-2">
                Die Zahlung erfolgt vor dem Versand der Ware.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-white mb-2">5. Lieferung & Versand</h2>
              <p>
                Der Versand ist kostenlos. Die Lieferzeit beträgt in der Regel 2–3 Wochen.
                Verzögerungen durch externe Faktoren (Zoll, Logistik) sind möglich und liegen ausserhalb
                unserer Kontrolle.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-white mb-2">6. Rückgabe & Ersatz</h2>
              <p>
                Eine Rückgabe ist grundsätzlich ausgeschlossen. Jeder Artikel wird vor dem Versand
                einem sorgfältigen Qualitätscheck unterzogen und gilt nach dieser Prüfung als einwandfrei.
              </p>
              <p className="mt-2">
                Ein Ersatz wird ausschliesslich dann gewährt, wenn bei Erhalt der Ware ein nachweislicher Schaden
                vorliegt, der eindeutig auf den Transport zurückzuführen ist. Der Schaden muss innerhalb von
                48 Stunden nach Erhalt mit Fotos dokumentiert und gemeldet werden.
              </p>
              <p className="mt-2">
                Da jeder Artikel vor dem Versand geprüft wird, sind nachträgliche Reklamationen bezüglich
                des Artikelzustands nach Ablauf dieser Frist nicht mehr möglich.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-white mb-2">7. Kontakt</h2>
              <p>
                Bei Fragen oder Anliegen erreichst du uns über folgende Kanäle:
              </p>
              <div className="flex items-center gap-4 mt-3">
                <a href="https://instagram.com/T_express247" target="_blank" rel="noopener noreferrer" className="text-[var(--gold)] hover:underline">
                  Instagram: @T_express247
                </a>
                <a href="https://t.me/T24Express_bot?start=1" target="_blank" rel="noopener noreferrer" className="text-[var(--gold)] hover:underline">
                  Telegram Bot
                </a>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold text-white mb-2">8. Änderungen</h2>
              <p>
                T-EXPRESS24 behält sich das Recht vor, diese Geschäftsbedingungen jederzeit anzupassen.
                Es gelten jeweils die zum Zeitpunkt der Bestellung gültigen Bedingungen.
              </p>
            </div>

          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
