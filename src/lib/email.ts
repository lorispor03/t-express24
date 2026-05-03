import { Resend } from 'resend';

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('RESEND_API_KEY not set');
  return new Resend(key);
}

const FROM_EMAIL = process.env.FROM_EMAIL || 'T-EXPRESS24 <onboarding@resend.dev>';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || '';

type OrderItem = {
  produkt_name: string;
  produkt_preis: number;
  team?: string;
  groesse?: string;
  beflockung_name?: string;
  beflockung_nummer?: string;
  patches?: { name: string }[];
  extras?: string;
  extras_preis?: number;
  menge: number;
};

type OrderLieferadresse = {
  strasse?: string;
  plz?: string;
  ort?: string;
  land?: string;
} | null;

type OrderData = {
  bestell_nr: string;
  datum: string;
  kunde_name: string;
  kunde_telefon?: string;
  kunde_kontakt: string;
  lieferadresse: OrderLieferadresse;
  nachricht?: string;
  zahlungsart: string;
  items: OrderItem[];
  gesamtpreis: number;
};

function formatCHF(amount: number): string {
  return `CHF ${amount.toFixed(2)}`;
}

function renderItemsHtml(items: OrderItem[]): string {
  return items
    .map((item) => {
      const extras: string[] = [];
      if (item.team) extras.push(`<strong>Team:</strong> ${item.team}`);
      if (item.groesse) extras.push(`<strong>Grösse:</strong> ${item.groesse}`);
      if (item.beflockung_name || item.beflockung_nummer) {
        const bName = item.beflockung_name || '';
        const bNum = item.beflockung_nummer || '';
        extras.push(`<strong>Beflockung:</strong> ${bName} ${bNum}`.trim());
      }
      if (item.patches && item.patches.length > 0) {
        extras.push(`<strong>Patches:</strong> ${item.patches.map((p) => p.name).join(', ')}`);
      }
      if (item.extras && item.extras !== 'none') {
        extras.push(`<strong>Extras:</strong> ${item.extras}`);
      }

      const lineTotal = (item.produkt_preis + (item.extras_preis || 0)) * item.menge;

      return `
        <tr>
          <td style="padding:16px; border-bottom:1px solid #eee; color:#111; font-size:14px;">
            <div style="font-weight:700; margin-bottom:4px;">${item.produkt_name}</div>
            ${extras.map((e) => `<div style="color:#666; font-size:13px; margin-top:2px;">${e}</div>`).join('')}
            <div style="color:#666; font-size:13px; margin-top:4px;">Menge: ${item.menge}</div>
          </td>
          <td style="padding:16px; border-bottom:1px solid #eee; color:#111; font-size:14px; text-align:right; white-space:nowrap; vertical-align:top;">
            ${formatCHF(lineTotal)}
          </td>
        </tr>
      `;
    })
    .join('');
}

function renderLieferadresseHtml(addr: OrderLieferadresse): string {
  if (!addr) return '<em style="color:#999;">Keine Adresse angegeben</em>';
  const lines = [addr.strasse, `${addr.plz || ''} ${addr.ort || ''}`.trim(), addr.land].filter(Boolean);
  return lines.join('<br>');
}

export async function sendOrderConfirmationToCustomer(order: OrderData) {
  if (!order.kunde_kontakt || !order.kunde_kontakt.includes('@')) {
    console.log(`Skipping customer email for ${order.bestell_nr}: no valid email`);
    return;
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Bestellbestätigung ${order.bestell_nr}</title>
    </head>
    <body style="margin:0; padding:0; background:#f5f5f5; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5; padding:32px 16px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 16px rgba(0,0,0,0.06);">

              <!-- Header -->
              <tr>
                <td style="background:linear-gradient(135deg,#111 0%,#c4222e 100%); padding:32px 24px; text-align:center;">
                  <div style="color:#ffffff; font-size:28px; font-weight:900; letter-spacing:-0.5px;">
                    T-EXPRESS<span style="color:#d4af37;">24</span>
                  </div>
                  <div style="color:#ffffff; font-size:14px; margin-top:8px; opacity:0.85;">
                    Premium Fussball Trikots aus der Schweiz
                  </div>
                </td>
              </tr>

              <!-- Hauptinhalt -->
              <tr>
                <td style="padding:32px 24px;">
                  <h1 style="color:#111; font-size:22px; margin:0 0 8px 0;">Hey ${order.kunde_name || 'du'} 👋</h1>
                  <p style="color:#444; font-size:15px; line-height:1.6; margin:0 0 24px 0;">
                    Vielen Dank für deine Bestellung! Wir haben sie erhalten und prüfen sie jetzt. Sobald dein Trikot versandbereit ist, melden wir uns bei dir.
                  </p>

                  <!-- Bestellnummer -->
                  <div style="background:#f8f8f8; border-radius:8px; padding:16px; margin-bottom:24px; border-left:4px solid #c4222e;">
                    <div style="color:#666; font-size:13px; text-transform:uppercase; letter-spacing:0.5px;">Bestellnummer</div>
                    <div style="color:#111; font-size:18px; font-weight:700; margin-top:4px;">${order.bestell_nr}</div>
                  </div>

                  <!-- Artikel -->
                  <h2 style="color:#111; font-size:16px; text-transform:uppercase; letter-spacing:0.5px; margin:0 0 12px 0;">Deine Artikel</h2>
                  <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #eee; margin-bottom:24px;">
                    ${renderItemsHtml(order.items)}
                    <tr>
                      <td style="padding:16px; color:#111; font-size:16px; font-weight:700;">Gesamtbetrag</td>
                      <td style="padding:16px; color:#c4222e; font-size:18px; font-weight:900; text-align:right;">${formatCHF(order.gesamtpreis)}</td>
                    </tr>
                  </table>

                  <!-- Lieferadresse -->
                  <h2 style="color:#111; font-size:16px; text-transform:uppercase; letter-spacing:0.5px; margin:0 0 12px 0;">Lieferadresse</h2>
                  <div style="background:#f8f8f8; border-radius:8px; padding:16px; margin-bottom:24px; color:#444; font-size:14px; line-height:1.6;">
                    <strong style="color:#111;">${order.kunde_name}</strong><br>
                    ${renderLieferadresseHtml(order.lieferadresse)}
                  </div>

                  <!-- Zahlung -->
                  <h2 style="color:#111; font-size:16px; text-transform:uppercase; letter-spacing:0.5px; margin:0 0 12px 0;">Zahlung</h2>
                  <div style="background:#f8f8f8; border-radius:8px; padding:16px; margin-bottom:24px; color:#444; font-size:14px;">
                    <strong style="color:#111;">${order.zahlungsart || 'Kreditkarte'}</strong> · <span style="color:#16a34a; font-weight:700;">Bezahlt ✓</span>
                  </div>

                  <!-- Next Steps -->
                  <div style="background:linear-gradient(135deg,#fff8e7 0%,#ffeacc 100%); border-radius:8px; padding:20px; margin-bottom:24px;">
                    <h3 style="color:#111; font-size:15px; margin:0 0 8px 0;">📦 Wie gehts weiter?</h3>
                    <p style="color:#444; font-size:14px; line-height:1.6; margin:0;">
                      Jedes Trikot wird von uns persönlich geprüft bevor es rausgeht. Das sichert Top-Qualität, braucht aber ein paar Tage. Wir informieren dich per E-Mail sobald dein Paket auf dem Weg ist.
                    </p>
                  </div>

                  <!-- Support -->
                  <p style="color:#666; font-size:13px; line-height:1.6; margin:24px 0 0 0;">
                    Fragen zur Bestellung? Schreib uns einfach auf <a href="https://instagram.com/T_express247" style="color:#c4222e; text-decoration:none; font-weight:600;">Instagram</a> oder per <a href="mailto:kontakt@t-express24.shop" style="color:#c4222e; text-decoration:none; font-weight:600;">E-Mail</a>.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background:#0d0d0d; padding:24px; text-align:center;">
                  <div style="color:#ffffff; font-size:14px; font-weight:700; margin-bottom:4px;">T-EXPRESS24</div>
                  <div style="color:#888; font-size:12px;">Premium Trikots · Schweiz</div>
                  <div style="color:#555; font-size:11px; margin-top:12px;">
                    © ${new Date().getFullYear()} T-EXPRESS24 · <a href="https://t-express24.shop/agb" style="color:#888; text-decoration:none;">AGB</a> · <a href="https://t-express24.shop/datenschutz" style="color:#888; text-decoration:none;">Datenschutz</a>
                  </div>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  try {
    const result = await getResend().emails.send({
      from: FROM_EMAIL,
      to: order.kunde_kontakt,
      subject: `Bestellbestätigung ${order.bestell_nr} · T-EXPRESS24`,
      html,
    });
    console.log(`Customer confirmation sent for ${order.bestell_nr}:`, result.data?.id);
  } catch (err) {
    console.error(`Failed to send customer email for ${order.bestell_nr}:`, err);
  }
}

export async function sendOrderNotificationToAdmin(order: OrderData) {
  if (!ADMIN_EMAIL) {
    console.log(`Skipping admin email for ${order.bestell_nr}: ADMIN_EMAIL not set`);
    return;
  }

  const itemsSummary = order.items
    .map((item) => {
      const parts = [
        `${item.menge}× ${item.produkt_name}`,
        item.team && `(${item.team})`,
        item.groesse && `Grösse ${item.groesse}`,
        (item.beflockung_name || item.beflockung_nummer) && `→ ${item.beflockung_name || ''} ${item.beflockung_nummer || ''}`.trim(),
        item.patches && item.patches.length > 0 && `Patches: ${item.patches.map((p) => p.name).join(', ')}`,
      ]
        .filter(Boolean)
        .join(' · ');
      return `<li style="margin-bottom:8px;">${parts}</li>`;
    })
    .join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="margin:0; padding:0; background:#f5f5f5; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5; padding:32px 16px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px; background:#ffffff; border-radius:12px; overflow:hidden;">

              <tr>
                <td style="background:#16a34a; padding:24px; text-align:center;">
                  <div style="color:#ffffff; font-size:20px; font-weight:900;">💰 Neue Bestellung!</div>
                  <div style="color:#ffffff; font-size:14px; margin-top:4px; opacity:0.9;">${order.bestell_nr} · ${formatCHF(order.gesamtpreis)}</div>
                </td>
              </tr>

              <tr>
                <td style="padding:24px;">
                  <h2 style="color:#111; font-size:16px; margin:0 0 12px 0;">Kunde</h2>
                  <div style="background:#f8f8f8; border-radius:8px; padding:12px; margin-bottom:16px; font-size:14px; line-height:1.6; color:#444;">
                    <strong style="color:#111;">${order.kunde_name}</strong><br>
                    📧 ${order.kunde_kontakt}<br>
                    ${order.kunde_telefon ? `📱 ${order.kunde_telefon}<br>` : ''}
                  </div>

                  <h2 style="color:#111; font-size:16px; margin:0 0 12px 0;">Lieferadresse</h2>
                  <div style="background:#f8f8f8; border-radius:8px; padding:12px; margin-bottom:16px; font-size:14px; line-height:1.6; color:#444;">
                    ${renderLieferadresseHtml(order.lieferadresse)}
                  </div>

                  <h2 style="color:#111; font-size:16px; margin:0 0 12px 0;">Artikel</h2>
                  <ul style="margin:0 0 16px 0; padding-left:20px; color:#444; font-size:14px;">
                    ${itemsSummary}
                  </ul>

                  <div style="background:#fff8e7; border-left:4px solid #d4af37; padding:12px; margin-bottom:16px; font-size:14px;">
                    <strong style="color:#111;">Gesamtbetrag:</strong> <span style="color:#c4222e; font-weight:900; font-size:16px;">${formatCHF(order.gesamtpreis)}</span><br>
                    <strong style="color:#111;">Zahlung:</strong> ${order.zahlungsart} ✓
                  </div>

                  ${order.nachricht ? `
                  <h2 style="color:#111; font-size:16px; margin:0 0 12px 0;">Nachricht vom Kunden</h2>
                  <div style="background:#f8f8f8; border-radius:8px; padding:12px; margin-bottom:16px; font-size:14px; color:#444; font-style:italic;">
                    "${order.nachricht}"
                  </div>
                  ` : ''}

                  <div style="margin-top:24px; padding-top:16px; border-top:1px solid #eee; color:#999; font-size:12px;">
                    Eingegangen: ${new Date(order.datum).toLocaleString('de-CH')}
                  </div>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  try {
    const result = await getResend().emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `💰 Neue Bestellung ${order.bestell_nr} · ${formatCHF(order.gesamtpreis)}`,
      html,
    });
    console.log(`Admin notification sent for ${order.bestell_nr}:`, result.data?.id);
  } catch (err) {
    console.error(`Failed to send admin email for ${order.bestell_nr}:`, err);
  }
}
