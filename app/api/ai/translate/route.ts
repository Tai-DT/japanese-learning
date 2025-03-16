// app/api/ai/translate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { translateText } from "@/lib/google-ai";
import { z } from "zod";

// Schema validation
const translationSchema = z.object({
  text: z.string().min(1).max(1000),
  sourceLang: z.string().min(2).max(5),
  targetLang: z.string().min(2).max(5),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate request body
    const validatedData = translationSchema.parse(body);
    
    const translatedText = await translateText(
      validatedData.text,
      validatedData.sourceLang,
      validatedData.targetLang
    );
    
    return NextResponse.json({ translatedText }, { status: 200 });
  } catch (error) {
    console.error("Translation error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to translate text" }, { status: 500 });
  }
}
