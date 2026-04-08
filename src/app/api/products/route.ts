import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('categoryId') || undefined;
    const search = searchParams.get('search') || '';
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where = {
      AND: [
        categoryId && categoryId !== 'all' ? { categoryId } : {},
        search ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { description: { contains: search, mode: 'insensitive' as const } }
          ]
        } : {}
      ]
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        take: limit,
        skip: offset,
        include: { category: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where })
    ]);

    return NextResponse.json({
      products,
      total,
      limit,
      offset,
      hasMore: offset + limit < total
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Serverda xatolik' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // Generate slug if not provided
    const slug = data.slug || data.name.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');

    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        price: parseFloat(data.price) || 0,
        image: data.image,
        stock: parseInt(data.stock) || 0,
        categoryId: data.categoryId,
      },
    });
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Serverda xatolik' }, { status: 500 });
  }
}
