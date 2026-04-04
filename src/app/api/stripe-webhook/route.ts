import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Redis } from '@upstash/redis';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  let event: Stripe.Event;

  try {
    if (process.env.STRIPE_WEBHOOK_SECRET && sig) {
      event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } else {
      // Fallback for testing without webhook secret
      event = JSON.parse(body) as Stripe.Event;
    }
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const metadata = session.metadata || {};

    try {
      const items = metadata.items_json ? JSON.parse(metadata.items_json) : [];
      const lieferadresse = metadata.lieferadresse ? JSON.parse(metadata.lieferadresse) : null;

      const id = await redis.incr('order_id_counter');
      const bestell_nr = 'B-' + String(id).padStart(4, '0');

      const orderData = {
        id,
        bestell_nr,
        datum: new Date().toISOString(),
        kunde_name: metadata.kunde_name || '',
        kunde_telefon: metadata.kunde_telefon || '',
        kunde_kontakt: metadata.kunde_email || '',
        lieferadresse,
        nachricht: metadata.nachricht || '',
        zahlungsart: metadata.zahlungsart || '',
        stripe_session_id: session.id,
        stripe_payment_status: session.payment_status,
        quelle: 'website',
        status: 'neu',
        bezahlt: true,
        lieferant_bestellt: false,
        items: items.map((item: any) => ({
          produkt_name: item.produkt_name,
          produkt_preis: item.produkt_preis,
          team: item.team || '',
          groesse: item.groesse || '',
          beflockung_name: item.beflockung_name || '',
          beflockung_nummer: item.beflockung_nummer || '',
          patches: item.patches || [],
          extras: item.extras || 'none',
          extras_preis: item.extras_preis || 0,
          menge: item.menge || 1,
        })),
        gesamtpreis: (session.amount_total || 0) / 100,
      };

      await redis.lpush('orders', JSON.stringify(orderData));
      console.log(`Order ${bestell_nr} created from Stripe payment`);
    } catch (err) {
      console.error('Error creating order from webhook:', err);
    }
  }

  return NextResponse.json({ received: true });
}
