// app/api/ai/recognize-kanji/route.ts
import { NextRequest, NextResponse } from "next/server";
import { recognizeKanjiFromImage } from "@/lib/google-ai";
import { z } from "zod";

const recognizeSchema = z.object({
  image: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate request body
    const validatedData = recognizeSchema.parse(body);
    
    // Check for valid image data
    if (!validatedData.image || 
        !validatedData.image.startsWith('data:image/')) {
      return NextResponse.json(
        { error: "Invalid image format. Expected data URL format." },
        { status: 400 }
      );
    }
    
    console.log("Processing kanji recognition request...");
    const kanjiData = await recognizeKanjiFromImage(validatedData.image);
    console.log("Successfully recognized kanji:", kanjiData.character);
    
    return NextResponse.json({ kanji: kanjiData, success: true }, { status: 200 });
  } catch (error) {
    console.error("Kanji recognition error:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }
    
    // Handle specific errors more gracefully
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    
    if (errorMessage.includes('deprecated')) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'AI model has been deprecated. Please contact admin for an update.',
          details: errorMessage
        },
        { status: 500 }
      );
    } 
    else if (errorMessage.includes('Invalid image')) {
      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 400 }
      );
    }
    else if (errorMessage.includes('parse')) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to process the AI response',
          details: errorMessage 
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to recognize kanji", 
        details: errorMessage
      },
      { status: 500 }
    );
  }
}
