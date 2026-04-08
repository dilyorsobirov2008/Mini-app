import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const [products, categories, orders] = await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.order.count(),
    ]);

    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      products,
      categories,
      orders,
      recentOrders,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Statistikani yuklab bo‘lmadi' }, { status: 500 });
  }
}
