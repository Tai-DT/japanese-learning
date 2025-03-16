// app/api/ai/recognize/route.ts
import { NextRequest, NextResponse } from "next/server";
import { recognizeKanji } from "@/lib/google-ai";
import { z } from "zod";

const recognizeSchema = z.object({
  kanjiCharacter: z.string().min(1).max(1),
});

// Set a timeout for the API request
const TIMEOUT_MS = 10000;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate request body
    const validatedData = recognizeSchema.parse(body);
    
    // Ensure input is actually a kanji character (optional additional validation)
    if (!/[\u4e00-\u9faf]/.test(validatedData.kanjiCharacter)) {
      return NextResponse.json({ 
        error: "Invalid input", 
        message: "The provided character is not a kanji" 
      }, { status: 400 });
    }
    
    // Create a promise that rejects after the timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Request timed out")), TIMEOUT_MS);
    });
    
    // Race the actual request against the timeout
    const kanjiData = await Promise.race([
      recognizeKanji(validatedData.kanjiCharacter),
      timeoutPromise
    ]);
    
    return NextResponse.json({ kanji: kanjiData }, { status: 200 });
  } catch (error) {
    console.error("Kanji recognition error:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: "Invalid request data", 
        details: error.errors 
      }, { status: 400 });
    }
    
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ 
      error: "Failed to recognize kanji",
      message: errorMessage 
    }, { status: 500 });
  }
}
