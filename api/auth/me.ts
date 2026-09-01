import type { VercelRequest, VercelResponse } from "@vercel/node";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient({ log: ["error"] });
const JWT_SECRET = process.env.JWT_SECRET || "vosvos_secret_jwt_key_2026_super_secure";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Content-Type", "application/json");

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Yetkilendirme başlığı eksik veya geçersiz." });
    }

    const token = authHeader.split(" ")[1];
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch {
      return res.status(401).json({ error: "Geçersiz veya süresi dolmuş oturum." });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı." });
    }

    return res.status(200).json({ user });
  } catch (error: any) {
    console.error("[API /api/auth/me Hatası]:", error);
    return res.status(500).json({ error: error.message || "Kullanıcı bilgisi alınırken hata oluştu." });
  }
}
