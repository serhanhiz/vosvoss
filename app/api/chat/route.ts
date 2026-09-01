import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

// API Anahtarı yalnızca sunucu tarafında okunur (process.env.GEMINI_API_KEY)
const apiKey = process.env.GEMINI_API_KEY;

const getGeminiClient = () => {
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY ortam değişkeni tanımlanmamış.');
  }
  return new GoogleGenAI({ apiKey });
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message } = body;

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return NextResponse.json(
        { error: 'Geçersiz veya boş mesaj gönderildi.' },
        { status: 400 }
      );
    }

    const ai = getGeminiClient();

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message.trim(),
      config: {
        systemInstruction: 'Sen yardımsever, kibar ve teknik konularda uzman bir yapay zeka asistanısın.',
        temperature: 0.7,
      },
    });

    const reply = response.text || 'Yanıt üretilemedi.';

    return NextResponse.json({ reply }, { status: 200 });
  } catch (error: any) {
    console.error('[API /api/chat Hatası]:', error);

    if (error.message?.includes('GEMINI_API_KEY')) {
      return NextResponse.json(
        { error: 'Sunucu yapılandırma hatası: API anahtarı eksik.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Yapay zeka yanıtı oluşturulurken bir hata meydana geldi.' },
      { status: 500 }
    );
  }
}
