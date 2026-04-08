import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const BOT_TOKEN = '8689146953:AAHS8tsZHnRvAXDiF3LX_OjnZnwjGlPBvCg';
const ADMIN_CHAT_ID = '585724214'; // User's chat ID or a config. For now, I'll use a placeholder or let the user set it.

async function sendTelegramNotification(order: any) {
  const text = `🛍 **YANGI BUYURTMA!**\n\n` +
    `👤 **Mijoz:** ${order.customer}\n` +
    `📞 **Tel:** ${order.phone}\n` +
    `📍 **Manzil:** ${order.address}\n\n` +
    `📦 **Mahsulotlar:**\n${order.items.map((i: any) => `• ${i.name} (${i.quantity}x)`).join('\n')}\n\n` +
    `💰 **Jami:** ${order.total.toLocaleString()} so'm`;

  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: ADMIN_CHAT_ID,
        text: text,
        parse_mode: 'Markdown',
      }),
    });
  } catch (e) {
    console.error('Telegram notification error:', e);
  }
}

export async function POST(req: Request) {
  try {
    const { name, phone, address, items, total } = await req.json();

    const order = await prisma.order.create({
      data: {
        customer: name,
        phone,
        address,
        items,
        total: parseFloat(total),
      },
    });

    // Notify Admin
    await sendTelegramNotification(order);

    return NextResponse.json(order);
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: 'Buyurtmani saqlab bo‘lmadi' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: 'Buyurtmalarni yuklab bo‘lmadi' }, { status: 500 });
  }
}
