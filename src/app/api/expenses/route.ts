import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  try {
    const expenses = await redis.lrange('expenses', 0, -1);
    return NextResponse.json(expenses, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch expenses' },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { kategorie, beschreibung, betrag } = await req.json();

    const id = await redis.incr('expense_id_counter');

    const expense = {
      id,
      kategorie,
      beschreibung,
      betrag,
      timestamp: new Date().toISOString(),
    };

    await redis.lpush('expenses', JSON.stringify(expense));

    return NextResponse.json({ status: 'ok' }, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to add expense' },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    const expenses: string[] = await redis.lrange('expenses', 0, -1);

    const filtered = expenses.filter((entry) => {
      const parsed = typeof entry === 'string' ? JSON.parse(entry) : entry;
      return parsed.id !== id;
    });

    await redis.del('expenses');

    if (filtered.length > 0) {
      await redis.rpush('expenses', ...filtered.map((e) => (typeof e === 'string' ? e : JSON.stringify(e))));
    }

    return NextResponse.json({ status: 'ok' }, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete expense' },
      { status: 500, headers: corsHeaders }
    );
  }
}
