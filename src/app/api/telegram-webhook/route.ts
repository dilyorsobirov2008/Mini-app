import { NextResponse } from 'next/server';
import { getBot } from '@/lib/telegram';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const bot = getBot();

    if (bot) {
      // Telegram bot instance uses internal event emitters to process updates
      bot.processUpdate(body);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: 'Webhook is running' });
}
