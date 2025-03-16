// app/api/ai/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import { chatWithAI } from "@/lib/google-ai";
import { z } from "zod";

// Schema validation with clear error messages
const chatSchema = z.object({
  message: z.string().min(1, "Message is required").max(1000, "Message too long, max 1000 characters"),
  context: z.string().optional(),
});

// Fallback response in case of a critical failure
const FALLBACK_RESPONSE = "Xin lỗi, tôi đang gặp vấn đề kỹ thuật. Vui lòng thử lại sau một lát.";

// Timeout duration (in ms)
const TIMEOUT_MS = 15000;

// Add API rate limiting notification
const RATE_LIMIT_MESSAGE = "API rate limit reached. Please try again in a few minutes.";

export async function POST(req: NextRequest) {
  try {
    // Check Content-Type
    const contentType = req.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return NextResponse.json({ error: "Content-Type must be application/json" }, { status: 415 });
    }

    // Parse body
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 });
    }

    // Validate request body
    let validatedData;
    try {
      validatedData = chatSchema.parse(body);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map(err => `${err.path}: ${err.message}`).join(", ");
        return NextResponse.json({ error: "Invalid request data", details: errors }, { status: 400 });
      }
      throw error; // Unexpected validation error
    }

    // Fixed: Use a single consistent timeout approach
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("Request timed out")), TIMEOUT_MS);
    });

    try {
      // Race the actual request against the timeout
      const response = await Promise.race([
        chatWithAI(validatedData.message, validatedData.context),
        timeoutPromise
      ]);
      
      return NextResponse.json({ response, success: true }, { status: 200 });
    } catch (error: unknown) {
      // Handle timeout errors
      if (error instanceof Error && error.message === "Request timed out") {
        return NextResponse.json(
          { error: "Request timeout", fallbackResponse: FALLBACK_RESPONSE },
          { status: 504 }
        );
      }

      console.error("Chat API error details:", error);
      
      // Handle rate limiting errors specifically
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('429') || errorMessage.includes('rate limit') || 
          errorMessage.includes('exhausted') || errorMessage.includes('quota')) {
        return NextResponse.json(
          { error: "API rate limited", message: RATE_LIMIT_MESSAGE, fallbackResponse: FALLBACK_RESPONSE },
          { status: 429 }
        );
      }

      // Handle model not found errors specifically
      if (errorMessage.includes('404') || errorMessage.includes('not found') || 
          errorMessage.includes('generateContent')) {
        return NextResponse.json(
          { 
            error: "AI models unavailable", 
            message: "The requested AI model is currently unavailable", 
            fallbackResponse: FALLBACK_RESPONSE 
          },
          { status: 503 }
        );
      }

      return NextResponse.json(
        { error: "Failed to generate response", fallbackResponse: FALLBACK_RESPONSE },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Unhandled exception in chat API:", error);
    return NextResponse.json({ error: "Server error", fallbackResponse: FALLBACK_RESPONSE }, { status: 500 });
  }
}
