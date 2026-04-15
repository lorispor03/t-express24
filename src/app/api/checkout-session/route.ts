import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

export async function POST(req: NextRequest) {
  try {
    const stripe = getStripe();
    const body = await req.json();
    const { items, kunde, lieferadresse, nachricht, zahlungsart, bundle, bundleDiscount } = body;

    if (!items?.length || !kunde?.vorname || !kunde?.nachname || !kunde?.email || !zahlungsart) {
      return NextResponse.json({ error: 'Fehlende Daten' }, { status: 400 });
    }

    // Map payment method types
    const paymentMethodMap: Record<string, string[]> = {
      kreditkarte: ['card'],
      twint: ['twint'],
      paypal: ['paypal'],
    };
    const paymentMethods = paymentMethodMap[zahlungsart] || ['card'];

    // Build line items for Stripe
    const lineItems: any[] = items.map((item: any) => {
      const basePrice = parseFloat(item.produkt_preis);
      const extraPrice = item.extras_preis || 0;
      const unitPrice = basePrice + extraPrice;

      // Build description
      const descParts = [
        item.team,
        `Grösse: ${item.groesse}`,
      ];
      if (item.beflockung_name || item.beflockung_nummer) {
        descParts.push(`Aufdruck: ${[item.beflockung_name, item.beflockung_nummer].filter(Boolean).join(' ')}`);
      }
      if (item.patches?.length) {
        descParts.push(`Patches: ${item.patches.map((p: any) => p.name).join(', ')}`);
      }
      if (item.extras && item.extras !== 'none') {
        descParts.push(`Extra: ${item.extras === 'komplett' ? 'Komplett-Paket' : item.extras === 'aufdruck' ? 'Aufdruck' : 'Patches'}`);
      }

      return {
        price_data: {
          currency: 'chf',
          product_data: {
            name: item.produkt_name,
            description: descParts.join(' · '),
            ...(item.produkt_bild ? { images: [item.produkt_bild] } : {}),
          },
          unit_amount: Math.round(unitPrice * 100), // Stripe uses cents
        },
        quantity: item.menge || 1,
      };
    });

    // Create Stripe coupon for bundle discount
    let discounts: any[] = [];
    if (bundleDiscount && bundleDiscount > 0) {
      const coupon = await stripe.coupons.create({
        amount_off: Math.round(bundleDiscount * 100),
        currency: 'chf',
        name: `Bundle-Rabatt (${bundle === '3plus' ? '15%' : '20%'})`,
        duration: 'once',
      });
      discounts = [{ coupon: coupon.id }];
    }

    // Build metadata for order processing (Stripe max 500 chars per value)
    // Kompakte Items: nur nötige Felder
    const compactItems = items.map((item: any) => ({
      n: item.produkt_name,
      p: item.produkt_preis,
      t: item.team || '',
      g: item.groesse || '',
      bn: item.beflockung_name || '',
      bx: item.beflockung_nummer || '',
      pa: (item.patches || []).map((p: any) => p.name),
      e: item.extras || 'none',
      ep: item.extras_preis || 0,
      m: item.menge || 1,
    }));

    // Items auf mehrere Keys aufteilen (max 500 Zeichen pro Wert)
    const itemChunks: string[] = [];
    let currentChunk: any[] = [];
    for (const item of compactItems) {
      const test = JSON.stringify([...currentChunk, item]);
      if (test.length > 490 && currentChunk.length > 0) {
        itemChunks.push(JSON.stringify(currentChunk));
        currentChunk = [item];
      } else {
        currentChunk.push(item);
      }
    }
    if (currentChunk.length > 0) itemChunks.push(JSON.stringify(currentChunk));

    const metadata: Record<string, string> = {
      kunde_name: `${kunde.vorname} ${kunde.nachname}`,
      kunde_email: kunde.email,
      kunde_telefon: kunde.telefon || '',
      lieferadresse: JSON.stringify(lieferadresse).slice(0, 500),
      nachricht: (nachricht || '').slice(0, 500),
      zahlungsart,
      bundle: bundle || '',
      items_count: String(itemChunks.length),
    };
    itemChunks.forEach((chunk, i) => { metadata[`items_${i}`] = chunk; });

    const origin = req.headers.get('origin') || 'https://t-express24.vercel.app';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: paymentMethods as any[],
      mode: 'payment',
      line_items: lineItems,
      ...(discounts.length > 0 ? { discounts } : {}),
      customer_email: kunde.email,
      metadata,
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Stripe checkout error:', err);
    return NextResponse.json({ error: err.message || 'Stripe Fehler' }, { status: 500 });
  }
}
