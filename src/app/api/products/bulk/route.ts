import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { products } = await req.json();

    if (!Array.isArray(products)) {
      return NextResponse.json({ error: 'Mahsulotlar ro‘yxati massiv bo‘lishi kerak' }, { status: 400 });
    }

    // Process products to add slugs and ensure types
    const dataToInsert = products.map((p: any) => ({
      name: p.name,
      slug: p.slug || p.name.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '') + '-' + Math.random().toString(36).substring(2, 7),
      description: p.description || null,
      price: parseFloat(p.price) || 0,
      image: p.image || null,
      stock: parseInt(p.stock) || 0,
      categoryId: p.categoryId,
    }));

    const result = await prisma.product.createMany({
      data: dataToInsert,
      skipDuplicates: true,
    });

    return NextResponse.json({
      message: `${result.count} ta mahsulot muvaffaqiyatli qo‘shildi`,
      count: result.count
    });
  } catch (error) {
    console.error('Error in bulk upload:', error);
    return NextResponse.json({ error: 'Serverda xatolik yuz berdi' }, { status: 500 });
  }
}
