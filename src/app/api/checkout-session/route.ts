import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { Redis } from '@upstash/redis';

function getRedis() {
  return new Redis({
    url: process.env.KV_REST_API_URL!,
    token: process.env.KV_REST_API_TOKEN!,
  });
}

const PAYREXX_INSTANCE = process.env.PAYREXX_INSTANCE!;
const PAYREXX_API_SECRET = process.env.PAYREXX_API_SECRET!;

function buildSignature(params: URLSearchParams): string {
  return crypto
    .createHmac('sha256', PAYREXX_API_SECRET)
    .update(params.toString())
    .digest('base64');
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, kunde, lieferadresse, nachricht, zahlungsart, bundle, bundleDiscount } = body;

    if (!items?.length || !kunde?.vorname || !kunde?.nachname || !kunde?.email || !zahlungsart) {
      return NextResponse.json({ error: 'Fehlende Daten' }, { status: 400 });
    }

    // Gesamtbetrag berechnen (in Rappen)
    let totalCents = 0;
    for (const item of items) {
      const basePrice = parseFloat(item.produkt_preis);
      const extraPrice = item.extras_preis || 0;
      const unitPrice = basePrice + extraPrice;
      totalCents += Math.round(unitPrice * 100) * (item.menge || 1);
    }

    // Bundle-Rabatt abziehen
    if (bundleDiscount && bundleDiscount > 0) {
      totalCents -= Math.round(bundleDiscount * 100);
    }

    // Eindeutige Referenz-ID generieren
    const refId = `pending-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;

    // Bestelldaten temporär in Redis speichern (2h TTL)
    const redis = getRedis();
    await redis.set(refId, JSON.stringify({
      items,
      kunde,
      lieferadresse,
      nachricht,
      zahlungsart,
      bundle,
      bundleDiscount,
      totalCents,
    }), { ex: 7200 });

    // Payrexx Gateway erstellen
    const origin = req.headers.get('origin') || 'https://t-express24.shop';

    const params = new URLSearchParams();
    params.append('amount', String(totalCents));
    params.append('currency', 'CHF');
    params.append('referenceId', refId);
    params.append('successRedirectUrl', `${origin}/checkout/success`);
    params.append('failedRedirectUrl', `${origin}/checkout`);
    params.append('cancelRedirectUrl', `${origin}/checkout`);
    params.append('skipResultPage', '0');

    // Zahlungsmethode
    if (zahlungsart === 'twint') {
      params.append('pm[]', 'twint');
    } else {
      params.append('pm[]', 'visa');
      params.append('pm[]', 'mastercard');
    }

    // Kundendaten
    params.append('fields[forename][value]', kunde.vorname);
    params.append('fields[surname][value]', kunde.nachname);
    params.append('fields[email][value]', kunde.email);
    if (kunde.telefon) {
      params.append('fields[phone][value]', kunde.telefon);
    }

    // Beschreibung
    const itemNames = items.map((i: any) => `${i.menge || 1}× ${i.produkt_name}`).join(', ');
    params.append('purpose', itemNames.slice(0, 200));

    // HMAC-Signatur
    const signature = buildSignature(params);

    // Payrexx API aufrufen
    const response = await fetch(
      `https://api.payrexx.com/v1.14/Gateway/?instance=${PAYREXX_INSTANCE}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString() + '&ApiSignature=' + encodeURIComponent(signature),
      },
    );

    const result = await response.json();

    if (result.status !== 'success' || !result.data?.[0]?.link) {
      console.error('Payrexx Gateway error:', result);
      throw new Error('Zahlungsseite konnte nicht erstellt werden');
    }

    return NextResponse.json({ url: result.data[0].link });
  } catch (err: any) {
    console.error('Checkout error:', err);
    return NextResponse.json({ error: err.message || 'Zahlungsfehler' }, { status: 500 });
  }
}
