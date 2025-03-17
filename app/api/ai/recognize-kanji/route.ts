// app/api/ai/recognize-kanji/route.ts
import { NextRequest, NextResponse } from "next/server";
import { recognizeKanjiFromImage } from "@/lib/google-ai";
import { z } from "zod";
import { KanjiItem } from "@/types";

const recognizeSchema = z.object({
  image: z.string().min(1),
});

// Thiết lập timeout dài hơn cho nhận dạng kanji (30 giây)
const RECOGNITION_TIMEOUT_MS = 30000;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate request body
    const validatedData = recognizeSchema.parse(body);
    
    // Check for valid image data
    if (!validatedData.image || 
        !validatedData.image.startsWith('data:image/')) {
      return NextResponse.json(
        { 
          success: false,
          error: "Invalid image format. Expected data URL format." 
        },
        { status: 400 }
      );
    }
    
    console.log("Processing kanji recognition request...");
    
    // Tạo promise timeout để hủy nếu quá lâu
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("Recognition request timed out")), RECOGNITION_TIMEOUT_MS);
    });
    
    // Chạy nhận diện với promise race
    const kanjiData = await Promise.race<KanjiItem>([
      recognizeKanjiFromImage(validatedData.image),
      timeoutPromise
    ]);
    
    // Validate response data structure
    if (!kanjiData || !kanjiData.character) {
      throw new Error("Invalid response from AI service");
    }
    
    console.log("Successfully recognized kanji:", kanjiData.character);
    
    return NextResponse.json({ 
      success: true,
      kanji: kanjiData 
    }, { status: 200 });
  } catch (error) {
    console.error("Kanji recognition error:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Invalid request data", 
          details: error.errors 
        },
        { status: 400 }
      );
    }
    
    // Handle specific errors more gracefully
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    
    if (errorMessage.includes('timed out')) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Quá thời gian xử lý. Vui lòng thử lại với hình ảnh rõ ràng hơn.',
          details: errorMessage
        },
        { status: 504 }
      );
    }
    else if (errorMessage.includes('deprecated')) {
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
        { 
          success: false, 
          error: errorMessage 
        },
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
    else if (errorMessage.includes('Invalid kanji data')) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid response format from AI service',
          details: errorMessage 
        },
        { status: 500 }
      );
    }
    else if (errorMessage.includes('Invalid kanji')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Không thể nhận dạng chữ Kanji hợp lệ. Vui lòng vẽ rõ ràng hơn.',
          details: errorMessage
        },
        { status: 422 }
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
