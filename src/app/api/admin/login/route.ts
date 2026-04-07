import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import * as jose from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'bozorcha-secret-key-2026';

export async function POST(req: Request) {
  try {
    const { phone, password } = await req.json();

    const admin = await prisma.admin.findUnique({
      where: { phone },
    });

    if (!admin) {
      return NextResponse.json({ error: 'Admin topilmadi' }, { status: 404 });
    }

    const isValid = await bcrypt.compare(password, admin.password);

    if (!isValid) {
      return NextResponse.json({ error: 'Noto\'g\'ri parol' }, { status: 401 });
    }

    const token = await new jose.SignJWT({ id: admin.id, phone: admin.phone })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .sign(new TextEncoder().encode(JWT_SECRET));

    const response = NextResponse.json({ success: true });
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Serverda xatolik' }, { status: 500 });
  }
}
