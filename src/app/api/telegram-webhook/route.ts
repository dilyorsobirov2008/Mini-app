import { NextResponse } from 'next/server';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL!;

async function sendMessage(chatId: number, text: string, reply_markup?: object) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
      ...(reply_markup ? { reply_markup } : {}),
    }),
  });
  const data = await res.json();
  console.log('sendMessage response:', JSON.stringify(data));
  return data;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('Webhook received:', JSON.stringify(body));

    const message = body.message;
    if (message && message.text) {
      const chatId = message.chat.id;
      const text = message.text;

      if (text === '/start') {
        await sendMessage(
          chatId,
          "Assalomu alaykum! Bozorcha botiga xush kelibsiz. \n\nPastdagi tugmani bosib do'konimizga kiring:",
          {
            inline_keyboard: [
              [
                {
                  text: '🛍 Do\'konni ochish',
                  web_app: { url: APP_URL }
                }
              ]
            ]
          }
        );
      }
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
