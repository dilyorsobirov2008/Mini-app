import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('categoryId');

    const products = await prisma.product.findMany({
      where: categoryId ? { categoryId } : {},
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Serverda xatolik' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: parseFloat(data.price) || 0,
        image: data.image,
        categoryId: data.categoryId,
      },
    });
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Serverda xatolik' }, { status: 500 });
  }
}
