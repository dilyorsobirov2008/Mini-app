import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { name } = await req.json();
    const slug = name.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
    
    const category = await prisma.category.update({
      where: { id },
      data: { name, slug },
    });
    
    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json({ error: 'Kategoriyani yangilab bo‘lmadi' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.category.delete({
      where: { id },
    });
    return NextResponse.json({ message: 'Kategoriya o‘chirildi' });
  } catch (error) {
    return NextResponse.json({ error: 'Kategoriyani o‘chirib bo‘lmadi' }, { status: 500 });
  }
}
