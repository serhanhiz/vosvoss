import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword, generateToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    // 1. Doğrulama
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Lütfen geçerli bir e-posta adresi girin.' },
        { status: 400 }
      );
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return NextResponse.json(
        { error: 'Şifreniz en az 6 karakter olmalıdır.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 2. Mevcut kullanıcı kontrolü
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Bu e-posta adresi ile zaten bir hesap bulunmaktadır.' },
        { status: 409 }
      );
    }

    // 3. Şifre hashleme ve kullanıcı oluşturma
    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        name: name ? name.trim() : null,
        password: hashedPassword,
      },
    });

    // 4. Token üretimi
    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    return NextResponse.json(
      {
        message: 'Kayıt işlemi başarıyla tamamlandı.',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          createdAt: user.createdAt,
        },
        token,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('[API /api/auth/register Hatası]:', error);
    return NextResponse.json(
      { error: 'Kayıt sırasında bir sunucu hatası oluştu.' },
      { status: 500 }
    );
  }
}
