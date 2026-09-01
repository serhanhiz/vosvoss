import type { VercelRequest, VercelResponse } from "@vercel/node";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient({ log: ["error"] });
const JWT_SECRET = process.env.JWT_SECRET || "vosvos_secret_jwt_key_2026_super_secure";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS & JSON headers
  res.setHeader("Content-Type", "application/json");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { name, email, password } = req.body || {};

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return res.status(400).json({ error: "Lütfen geçerli bir e-posta adresi girin." });
    }

    if (!password || typeof password !== "string" || password.length < 6) {
      return res.status(400).json({ error: "Şifreniz en az 6 karakter olmalıdır." });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return res.status(409).json({ error: "Bu e-posta adresi ile zaten bir hesap bulunmaktadır." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        name: name ? name.trim() : null,
        password: hashedPassword,
      },
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      message: "Kayıt işlemi başarıyla tamamlandı.",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (error: any) {
    console.error("[API /api/auth/register Hatası]:", error);
    return res.status(500).json({ error: error.message || "Kayıt sırasında bir hata oluştu." });
  }
}
