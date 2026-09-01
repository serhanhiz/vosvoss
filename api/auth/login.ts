import type { VercelRequest, VercelResponse } from "@vercel/node";
import prisma from "../../lib/prisma";
import { comparePassword, generateToken } from "../../lib/auth";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ error: "E-posta ve şifre zorunludur." });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return res.status(401).json({ error: "E-posta veya şifre hatalı." });
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "E-posta veya şifre hatalı." });
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    return res.status(200).json({
      message: "Giriş başarılı.",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (error: any) {
    console.error("[API /api/auth/login Hatası]:", error);
    return res.status(500).json({ error: error.message || "Giriş sırasında bir hata oluştu." });
  }
}
