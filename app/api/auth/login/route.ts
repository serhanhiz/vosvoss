import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { comparePassword, generateToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // 1. Doğrulama
    if (!email || !password) {
      return NextResponse.json(
        { error: 'E-posta ve şifre zorunludur.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 2. Kullanıcıyı bul
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'E-posta veya şifre hatalı.' },
        { status: 401 }
      );
    }

    // 3. Şifre kontrolü
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'E-posta veya şifre hatalı.' },
        { status: 401 }
      );
    }

    // 4. Token üretimi
    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    return NextResponse.json(
      {
        message: 'Giriş başarılı.',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          createdAt: user.createdAt,
        },
        token,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[API /api/auth/login Hatası]:', error);
    return NextResponse.json(
      { error: 'Giriş sırasında bir sunucu hatası oluştu.' },
      { status: 500 }
    );
  }
}
