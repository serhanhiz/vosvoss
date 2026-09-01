import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { message } = req.body || {};

    if (!message || typeof message !== "string" || message.trim() === "") {
      return res.status(400).json({ error: "Geçersiz veya boş mesaj gönderildi." });
    }

    if (!apiKey) {
      return res.status(500).json({ error: "GEMINI_API_KEY ortam değişkeni tanımlanmamış." });
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message.trim(),
      config: {
        systemInstruction: "Sen yardımsever, kibar ve teknik konularda uzman bir yapay zeka asistanısın.",
        temperature: 0.7,
      },
    });

    const reply = response.text || "Yanıt üretilemedi.";
    return res.status(200).json({ reply });
  } catch (error: any) {
    console.error("[API /api/chat Hatası]:", error);
    return res.status(500).json({ error: error.message || "Yapay zeka yanıtı üretilemedi." });
  }
}
