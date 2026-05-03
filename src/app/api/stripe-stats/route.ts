import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

function getRedis() {
  return new Redis({
    url: process.env.KV_REST_API_URL!,
    token: process.env.KV_REST_API_TOKEN!,
  });
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  try {
    const redis = getRedis();
    const raw = await redis.lrange('orders', 0, -1);

    const orders: any[] = raw.map((entry: any) =>
      typeof entry === 'string' ? JSON.parse(entry) : entry,
    );

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Zahlungen der letzten 30 Tage
    const recentOrders = orders.filter(
      (o) => o.bezahlt && new Date(o.datum) >= thirtyDaysAgo,
    );

    // Tägliche Daten
    const dailyData: Record<string, { succeeded: number; failed: number; amount: number; count: number }> = {};
    for (const order of recentOrders) {
      const date = new Date(order.datum).toISOString().slice(0, 10);
      if (!dailyData[date]) {
        dailyData[date] = { succeeded: 0, failed: 0, amount: 0, count: 0 };
      }
      dailyData[date].count++;
      dailyData[date].succeeded++;
      dailyData[date].amount += order.gesamtpreis || 0;
    }

    // Zusammenfassung
    const totalVolume = recentOrders.reduce((s, o) => s + (o.gesamtpreis || 0), 0);
    const totalCount = recentOrders.length;
    const avgPayment = totalCount > 0 ? totalVolume / totalCount : 0;

    // Letzte 10 Zahlungen
    const recentPayments = recentOrders.slice(0, 10).map((o) => ({
      id: o.payrexx_transaction_id || o.stripe_session_id || o.bestell_nr,
      amount: o.gesamtpreis || 0,
      currency: 'chf',
      status: o.bezahlt ? 'succeeded' : 'pending',
      created: o.datum,
      description: o.bestell_nr,
      metadata: { kunde: o.kunde_name },
    }));

    return NextResponse.json(
      {
        daily: dailyData,
        summary: {
          totalVolume,
          totalCount,
          avgPayment,
          balanceAvailable: totalVolume,
          balancePending: 0,
        },
        recentPayments,
      },
      { headers: corsHeaders },
    );
  } catch (err: any) {
    console.error('Payment stats error:', err);
    return NextResponse.json(
      { error: err.message || 'Fehler beim Laden der Statistiken' },
      { status: 500, headers: corsHeaders },
    );
  }
}
