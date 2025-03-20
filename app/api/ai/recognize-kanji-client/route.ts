import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { KanjiItem } from "@/types";

const recognizeSchema = z.object({
  image: z.string().min(1),
  apiKey: z.string().min(1)
});

// Thiết lập timeout dài hơn cho nhận dạng kanji (30 giây)
const RECOGNITION_TIMEOUT_MS = 30000;

// Base URL cho API Gemini 
const API_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";
const MODEL_NAME = "gemini-2.0-flash";

interface GeminiResponsePart {
  text: string;
}

interface GeminiResponseContent {
  parts: GeminiResponsePart[];
}

interface GeminiResponseCandidate {
  content: GeminiResponseContent;
  finishReason?: string;
}

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
    
    console.log("Processing client-side kanji recognition request...");
    
    // Sử dụng API key của người dùng
    const apiKey = validatedData.apiKey;
    
    // Tạo promise timeout để hủy nếu quá lâu
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("Recognition request timed out")), RECOGNITION_TIMEOUT_MS);
    });
    
    // Chạy nhận diện với promise race
    const kanjiData = await Promise.race<KanjiItem>([
      recognizeKanjiFromImage(validatedData.image, apiKey),
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
    console.error("Client kanji recognition error:", error);
    
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
    else if (errorMessage.includes('API key')) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'API key không hợp lệ hoặc đã hết hạn.',
          details: errorMessage
        },
        { status: 401 }
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

// Hàm trích xuất JSON từ text
function extractJsonFromText<T>(text: string): T {
  // Loại bỏ các ký tự không cần thiết có thể gây lỗi parse
  text = text.trim();
  
  // First try direct parsing
  try {
    return JSON.parse(text);
  } catch {
    console.log("Initial JSON parsing failed, trying to extract JSON...");
    
    // Try to extract JSON from code blocks or find JSON pattern
    const jsonMatch = 
      text.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || 
      text.match(/({[\s\S]*})/);
    
    if (!jsonMatch) {
      console.error("No JSON pattern found in response");
      throw new Error("Could not extract JSON from the response");
    }
    
    let jsonContent = jsonMatch[1] || jsonMatch[0];
    jsonContent = jsonContent.trim();
    
    // Thử sửa lỗi JSON không hợp lệ
    try {
      return JSON.parse(jsonContent);
    } catch {
      console.log("JSON extraction failed, attempting to fix JSON...");
      
      // Cố gắng sửa các lỗi phổ biến trong JSON
      
      // 1. Sửa dấu phẩy thừa ở cuối mảng/object
      jsonContent = jsonContent.replace(/,(\s*[}\]])/g, '$1');
      
      // 2. Sửa dấu nháy không hợp lệ
      jsonContent = jsonContent.replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":');
      
      // 3. Thêm dấu nháy cho các giá trị chuỗi không có dấu nháy
      jsonContent = jsonContent.replace(/:\s*([^[{"},\s][^,}\]]*?)([,}\]])/g, ':"$1"$2');
      
      try {
        const fixedJson = JSON.parse(jsonContent);
        console.log("Successfully fixed JSON format");
        return fixedJson;
      } catch (finalError) {
        console.error("Failed to fix JSON format:", finalError);
        console.error("Problematic JSON string:", jsonContent);
        throw new Error(`Failed to parse extracted JSON after cleanup attempts: ${finalError instanceof Error ? finalError.message : "Unknown error"}`);
      }
    }
  }
}

// Gọi API Gemini trực tiếp từ client với API key người dùng
async function recognizeKanjiFromImage(imageBase64: string, apiKey: string): Promise<KanjiItem> {
  try {
    if (!imageBase64) {
      throw new Error("No image data provided");
    }

    if (!imageBase64.startsWith('data:image/')) {
      throw new Error("Invalid image format. Expected data URL format.");
    }

    console.log(`Processing image data for client API call...`);

    // Xử lý dữ liệu hình ảnh cho API
    const base64Data = imageBase64.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
    const mimeType = imageBase64.startsWith('data:image/jpeg') ? 'image/jpeg' :
                      imageBase64.startsWith('data:image/jpg') ? 'image/jpg' : 'image/png';

    // Tạo prompt để nhận dạng kanji
    const prompt = `Bạn là một chuyên gia về nhận dạng chữ Kanji với độ chính xác cao. Hãy phân tích hình ảnh được cung cấp.

NHIỆM VỤ CHÍNH: Nhận diện CHÍNH XÁC một ký tự Kanji duy nhất trong hình vẽ tay và cung cấp thông tin chi tiết.

Quy trình phân tích (thực hiện nghiêm ngặt):
1. Quan sát kỹ hình ảnh, tách biệt nét chữ khỏi nền
2. Xem xét cấu trúc của các nét vẽ, thứ tự nét, và tỷ lệ giữa các phần
3. Phân tích bộ thủ (radicals) để xác định chính xác ký tự Kanji
4. Xác định một và CHỈ MỘT ký tự Kanji duy nhất
5. Đối chiếu với từ điển kanji chuẩn để lấy thông tin chính xác

CẢNH BÁO: Nhiều hệ thống AI có xu hướng nhận dạng sai ký tự Kanji, đặc biệt với chữ viết tay. Hãy đánh giá THẬN TRỌNG và so sánh với danh sách Kanji phổ biến.

CHỈ trả về một đối tượng JSON hợp lệ với cấu trúc CHÍNH XÁC sau:
{
  "character": "漢", // MỘT ký tự Kanji duy nhất, đảm bảo là ký tự Kanji thực sự
  "onReading": ["カン"], // âm ON trong katakana, đầy đủ và chính xác
  "kunReading": [""], // âm KUN trong hiragana, có thể trống nếu không có
  "meaning": ["Hán", "người Hán", "Trung Quốc"], // nghĩa tiếng Việt đầy đủ
  "strokeCount": 13, // số nét CHÍNH XÁC
  "jlptLevel": "N3", // cấp độ JLPT chính xác (N5, N4, N3, N2, hoặc N1)
  "examples": [
    {"word": "漢字", "reading": "かんじ", "meaning": "chữ Hán"},
    {"word": "漢方", "reading": "かんぽう", "meaning": "y học cổ truyền Trung Quốc"},
    {"word": "漢文", "reading": "かんぶん", "meaning": "văn ngôn Hán văn"}
  ]
}

QUY TẮC NGHIÊM NGẶT:
- Ký tự trong trường "character" PHẢI nằm trong bảng mã kanji Unicode (CJK Unified Ideographs)
- Thông tin âm đọc, nghĩa và số nét PHẢI CHÍNH XÁC theo từ điển chuẩn
- Kiểm tra lại kỹ rằng ký tự được nhận dạng là kanji thực sự, không phải kana hoặc ký tự khác
- Trường "examples" phải chứa các từ vựng thông dụng, thực tế có sử dụng ký tự kanji đó
- KHÔNG bao gồm bất kỳ văn bản giải thích nào ngoài đối tượng JSON

Nếu HOÀN TOÀN không thể nhận ra chữ Kanji nào rõ ràng, hãy trả về kanji cơ bản N5 có cấu trúc nét tương tự nhất.`;

    // Thiết lập cấu hình tối ưu cho nhận dạng 
    const generationConfig = {
      temperature: 0.1,
      topP: 0.8,
      topK: 10,
      maxOutputTokens: 2048,
    };

    // Tạo request body
    const requestBody = {
      contents: [{
        parts: [
          { text: prompt },
          { 
            inlineData: {
              mimeType: mimeType,
              data: base64Data
            }
          }
        ]
      }],
      generationConfig: generationConfig,
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    };

    // Endpoint API
    const endpoint = `${API_BASE_URL}/models/${MODEL_NAME}:generateContent?key=${apiKey}`;

    console.log("Sending direct API request to Gemini with client key...");
    
    // Gọi API
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Gemini API error:", errorData);
      
      if (response.status === 400 && errorData.includes("API key")) {
        throw new Error("Invalid API key");
      }
      
      throw new Error(`API call failed: ${response.status} ${response.statusText} - ${errorData}`);
    }

    const data = await response.json();
    
    // FIXED: Improved response validation
    if (!data.candidates || data.candidates.length === 0) {
      console.error("Empty response from Gemini API:", data);
      throw new Error("No candidates in Gemini API response");
    }
    
    const candidate = data.candidates[0] as GeminiResponseCandidate;
    
    // Check for finish reason other than STOP
    if (candidate.finishReason && candidate.finishReason !== "STOP") {
      console.warn(`Gemini API finished with reason: ${candidate.finishReason}`);
      if (candidate.finishReason === "SAFETY") {
        throw new Error("Content blocked by safety settings");
      }
    }
    
    if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
      console.error("Invalid content structure in response:", candidate);
      throw new Error("Invalid response structure from Gemini API");
    }
    
    // Extract text from all parts
    const textParts = candidate.content.parts
      .filter((part: GeminiResponsePart) => part.text)
      .map((part: GeminiResponsePart) => part.text);
    
    if (textParts.length === 0) {
      console.error("No text content in response:", candidate.content);
      throw new Error("No text content in Gemini API response");
    }
    
    const textContent = textParts.join("");
    console.log("Response text length:", textContent.length);
    
    // Parse JSON from response
    try {
      const parsedData = extractJsonFromText<KanjiItem>(textContent);
      
      // Validation
      if (!parsedData || !parsedData.character) {
        console.error("Invalid kanji data structure:", parsedData);
        throw new Error("Invalid kanji data: missing character");
      }
      
      // Validate that we're returning exactly one kanji character using strict Unicode range
      if (parsedData.character.length !== 1 || !/[\u4e00-\u9faf]/.test(parsedData.character)) {
        console.error("Invalid kanji character detected:", parsedData.character);
        throw new Error("Invalid kanji: The detected character is not a single valid kanji");
      }
      
      // Validate all required fields with strict checking
      if (!Array.isArray(parsedData.onReading) || !parsedData.onReading.length) {
        throw new Error("Invalid kanji data: missing onReading");
      }
      
      if (!Array.isArray(parsedData.kunReading)) {
        throw new Error("Invalid kanji data: missing kunReading");
      }
      
      if (!Array.isArray(parsedData.meaning) || !parsedData.meaning.length) {
        throw new Error("Invalid kanji data: missing meaning");
      }
      
      if (typeof parsedData.strokeCount !== 'number' || parsedData.strokeCount <= 0) {
        throw new Error("Invalid kanji data: invalid strokeCount");
      }
      
      if (!parsedData.jlptLevel || !/^N[1-5]$/.test(parsedData.jlptLevel)) {
        throw new Error("Invalid kanji data: invalid jlptLevel");
      }
      
      if (!Array.isArray(parsedData.examples) || parsedData.examples.length === 0) {
        throw new Error("Invalid kanji data: missing examples");
      }
      
      // Validate format of each example
      parsedData.examples.forEach((example, index) => {
        if (!example.word || !example.reading || !example.meaning) {
          throw new Error(`Invalid kanji data: missing properties in example ${index + 1}`);
        }
      });
      
      console.log("Successfully recognized kanji:", parsedData.character);
      return parsedData as KanjiItem;
    } catch (parseError) {
      console.error("JSON parsing error:", parseError);
      console.error("Raw response excerpt:", textContent.substring(0, 200) + "...");
      throw new Error(`Failed to parse AI response: ${parseError instanceof Error ? parseError.message : "Unknown error"}`);
    }
  } catch (error) {
    console.error("Error recognizing kanji from image with client API key:", error);
    throw new Error(`Failed to analyze kanji image: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
} 