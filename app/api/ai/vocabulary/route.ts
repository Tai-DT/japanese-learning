import { NextRequest, NextResponse } from "next/server";
import { generateVocabulary } from "@/lib/google-ai";
import { z } from "zod";

// Schema validation
const vocabularySchema = z.object({
  query: z.string().optional(),
  level: z.string().optional(),
  count: z.number().optional().default(6),
});

// Timeout duration (in ms)
const TIMEOUT_MS = 15000;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate request body
    const validatedData = vocabularySchema.parse(body);
    
    // Create a promise that rejects after the timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Request timed out")), TIMEOUT_MS);
    });
    
    // Race the actual request against the timeout
    const vocabularyData = await Promise.race([
      generateVocabulary(
        validatedData.query || "", 
        validatedData.level || "N5", 
        validatedData.count
      ),
      timeoutPromise
    ]);
    
    return NextResponse.json({ vocabulary: vocabularyData, success: true }, { status: 200 });
  } catch (error) {
    console.error("Vocabulary generation error:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: "Invalid request data", 
        details: error.errors 
      }, { status: 400 });
    }
    
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    
    // Handle specific API errors
    if (errorMessage.includes('429') || errorMessage.includes('rate limit')) {
      return NextResponse.json({ 
        error: "Rate limit reached",
        message: "API rate limit exceeded. Please try again later."
      }, { status: 429 });
    }
    
    if (errorMessage.includes('Request timed out')) {
      return NextResponse.json({ 
        error: "Request timeout",
        message: "The AI service took too long to respond. Please try again."
      }, { status: 504 });
    }
    
    return NextResponse.json({ 
      error: "Failed to generate vocabulary",
      message: errorMessage 
    }, { status: 500 });
  }
}
