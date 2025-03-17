module.exports = {

"[project]/.next-internal/server/app/api/ai/recognize-kanji/route/actions.js [app-rsc] (server actions loader, ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
}}),
"[externals]/next/dist/compiled/next-server/app-route.runtime.dev.js [external] (next/dist/compiled/next-server/app-route.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/next-server/app-page.runtime.dev.js [external] (next/dist/compiled/next-server/app-page.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}}),
"[project]/lib/google-ai.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "chatWithAI": (()=>chatWithAI),
    "generateVocabulary": (()=>generateVocabulary),
    "recognizeKanji": (()=>recognizeKanji),
    "recognizeKanjiFromImage": (()=>recognizeKanjiFromImage),
    "translateText": (()=>translateText)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$google$2f$generative$2d$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@google/generative-ai/dist/index.mjs [app-route] (ecmascript)");
;
// Initialize Google AI API key
const apiKey = process.env.GOOGLE_AI_API_KEY;
// Keep the SDK initialization for compatibility
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const genAI = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$google$2f$generative$2d$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["GoogleGenerativeAI"](apiKey);
// Update to use Gemini 2.0-flash model
const MODEL_NAME = "gemini-2.0-flash";
// Base URL for direct API calls
const API_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";
// Direct API call helper function - FIXED to match exact API format
async function callGeminiAPI(prompt, imageData) {
    // Prepare the endpoint URL
    const endpoint = `${API_BASE_URL}/models/${MODEL_NAME}:generateContent?key=${apiKey}`;
    // Prepare the request parts according to Gemini API format
    const parts = [
        {
            text: prompt
        }
    ];
    // Add image data if provided - FIXED format for inline_data
    if (imageData) {
        const base64Data = imageData.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
        const mimeType = imageData.startsWith('data:image/jpeg') ? 'image/jpeg' : imageData.startsWith('data:image/jpg') ? 'image/jpg' : 'image/png';
        parts.push({
            inlineData: {
                mimeType: mimeType,
                data: base64Data
            }
        });
    }
    // Thiết lập cấu hình riêng cho nhận dạng hình ảnh
    const generationConfig = imageData ? {
        temperature: 0.01,
        topP: 0.90,
        topK: 10,
        maxOutputTokens: 2048
    } : {
        temperature: 0.05,
        topP: 0.95,
        topK: 16,
        maxOutputTokens: 2048
    };
    // FIXED: Prepare the request body according to the exact API format
    const requestBody = {
        contents: [
            {
                parts: parts
            }
        ],
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
    try {
        console.log("Sending direct API request to Gemini...");
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });
        if (!response.ok) {
            const errorData = await response.text();
            console.error("Gemini API error:", errorData);
            throw new Error(`API call failed: ${response.status} ${response.statusText} - ${errorData}`);
        }
        const data = await response.json();
        // FIXED: Improved response validation
        if (!data.candidates || data.candidates.length === 0) {
            console.error("Empty response from Gemini API:", data);
            throw new Error("No candidates in Gemini API response");
        }
        const candidate = data.candidates[0];
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
        const textParts = candidate.content.parts.filter((part)=>part.text).map((part)=>part.text);
        if (textParts.length === 0) {
            console.error("No text content in response:", candidate.content);
            throw new Error("No text content in Gemini API response");
        }
        return textParts.join("");
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw error;
    }
}
// Improve JSON extraction function for better parsing
function extractJsonFromText(text) {
    // Loại bỏ các ký tự không cần thiết có thể gây lỗi parse
    text = text.trim();
    // First try direct parsing
    try {
        return JSON.parse(text);
    } catch  {
        console.log("Initial JSON parsing failed, trying to extract JSON...");
        // Try to extract JSON from code blocks or find JSON pattern
        const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || text.match(/({[\s\S]*})/);
        if (!jsonMatch) {
            console.error("No JSON pattern found in response");
            throw new Error("Could not extract JSON from the response");
        }
        let jsonContent = jsonMatch[1] || jsonMatch[0];
        jsonContent = jsonContent.trim();
        // Thử sửa lỗi JSON không hợp lệ
        try {
            return JSON.parse(jsonContent);
        } catch  {
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
async function chatWithAI(prompt, context = "") {
    try {
        // Enhanced prompt with clear instructions
        let fullPrompt;
        if (context) {
            fullPrompt = `You are a helpful Japanese language assistant. Respond in the same language the user is using.

Previous conversation:
${context}

New message from user: ${prompt}

Give a clear, accurate response without unnecessary explanations unless requested.`;
        } else {
            fullPrompt = `You are a helpful Japanese language assistant. Respond in the same language the user is using.

Message from user: ${prompt}

Give a clear, accurate response without unnecessary explanations unless requested.`;
        }
        const response = await callGeminiAPI(fullPrompt);
        return response;
    } catch (error) {
        console.error("Error chatting with AI:", error);
        throw new Error(`Failed to generate response from AI: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
}
async function translateText(text, sourceLang = "en", targetLang = "ja") {
    try {
        // Enhanced prompt with strict instructions
        const prompt = `Translate the following text from ${sourceLang} to ${targetLang}.
    
Input text: "${text}"

Rules:
1. Provide ONLY the translation, with no explanations or additional text
2. Maintain the original tone and formality level
3. Preserve proper names as they are unless they have standard translations
4. Ensure natural sounding output in the target language

Translation:`;
        const response = await callGeminiAPI(prompt);
        return response.trim();
    } catch (error) {
        console.error("Error translating text:", error);
        throw new Error("Failed to translate text");
    }
}
async function recognizeKanji(kanjiCharacter) {
    try {
        // Enhanced structured prompt with CORRECTED PROPERTY NAMES
        const prompt = `Analyze this Japanese kanji character: ${kanjiCharacter}

Return ONLY a valid JSON object with EXACTLY this structure and nothing else:
{
  "character": "${kanjiCharacter}",
  "onReading": ["Array of ON readings in katakana"],
  "kunReading": ["Array of KUN readings in hiragana"],
  "meaning": ["Array of Vietnamese meanings"],
  "strokeCount": number,
  "jlptLevel": "N5/N4/N3/N2/N1",
  "examples": [
    {"word": "example compound word", "reading": "reading in hiragana", "meaning": "Vietnamese meaning"},
    {"word": "example compound word", "reading": "reading in hiragana", "meaning": "Vietnamese meaning"}
  ]
}

Include common and useful examples. Make sure all Japanese text is properly formatted with correct kana.
Do not include any explanations or text outside the JSON object.`;
        const jsonStr = await callGeminiAPI(prompt);
        return extractJsonFromText(jsonStr);
    } catch (error) {
        console.error("Error analyzing kanji:", error);
        throw new Error("Failed to analyze kanji");
    }
}
async function recognizeKanjiFromImage(imageBase64) {
    try {
        // Validate input
        if (!imageBase64) {
            throw new Error("No image data provided");
        }
        // Validate that we have actual image data
        if (!imageBase64.startsWith('data:image/')) {
            throw new Error("Invalid image format. Expected data URL format.");
        }
        console.log(`Processing image data of length: ${imageBase64.length}`);
        // Enhanced prompt for more accurate kanji recognition with specific instructions
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
        console.log("Sending kanji image to Gemini API...");
        // Thiết lập tham số API với nhiệt độ thấp hơn để kết quả nhất quán
        const textContent = await callGeminiAPI(prompt, imageBase64);
        console.log("Response text length:", textContent.length);
        // Xử lý JSON và kiểm tra kết quả
        try {
            const parsedData = extractJsonFromText(textContent);
            // Enhanced validation for the response structure
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
            parsedData.examples.forEach((example, index)=>{
                if (!example.word || !example.reading || !example.meaning) {
                    throw new Error(`Invalid kanji data: missing properties in example ${index + 1}`);
                }
            });
            console.log("Successfully recognized kanji:", parsedData.character);
            return parsedData;
        } catch (parseError) {
            console.error("JSON parsing error:", parseError);
            console.error("Raw response excerpt:", textContent.substring(0, 200) + "...");
            throw new Error(`Failed to parse AI response: ${parseError instanceof Error ? parseError.message : "Unknown error"}`);
        }
    } catch (error) {
        console.error("Error recognizing kanji from image:", error);
        throw new Error(`Failed to analyze kanji image: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
}
async function generateVocabulary(query = "", level = "N5", count = 6) {
    try {
        // Enhanced structured prompt
        const prompt = `Generate ${count} accurate Japanese vocabulary items ${query ? "related to '" + query + "'" : ""} 
for JLPT level ${level === "all" ? "N5 to N1" : level}.

RESPONSE FORMAT: Return ONLY a valid JSON array with EXACTLY this structure:
[
  {
    "id": "1",
    "japanese": "単語",
    "hiragana": "たんご",
    "romaji": "tango",
    "meaning": "Precise Vietnamese translation",
    "example": {
      "japanese": "Natural Japanese example sentence with correct grammar",
      "meaning": "Accurate Vietnamese translation of the example"
    },
    "level": "${level === "all" ? "N5/N4/N3/N2/N1" : level}"
  },
  {... next item}
]

IMPORTANT RULES:
1. Ensure all vocabulary is actually at the specified JLPT level
2. Provide accurate hiragana readings and romaji
3. Include natural, useful example sentences
4. Ensure all Japanese text uses correct characters and grammar
5. Maintain the exact JSON structure requested
6. Return ONLY the JSON array, no explanations or additional text`;
        const jsonStr = await callGeminiAPI(prompt);
        return extractJsonFromText(jsonStr);
    } catch (error) {
        console.error("Error generating vocabulary:", error);
        throw new Error("Failed to generate vocabulary data");
    }
}
}}),
"[project]/app/api/ai/recognize-kanji/route.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// app/api/ai/recognize-kanji/route.ts
__turbopack_context__.s({
    "POST": (()=>POST)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$google$2d$ai$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/google-ai.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zod/lib/index.mjs [app-route] (ecmascript)");
;
;
;
const recognizeSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["z"].object({
    image: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["z"].string().min(1)
});
// Thiết lập timeout dài hơn cho nhận dạng kanji (30 giây)
const RECOGNITION_TIMEOUT_MS = 30000;
async function POST(req) {
    try {
        const body = await req.json();
        // Validate request body
        const validatedData = recognizeSchema.parse(body);
        // Check for valid image data
        if (!validatedData.image || !validatedData.image.startsWith('data:image/')) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: "Invalid image format. Expected data URL format."
            }, {
                status: 400
            });
        }
        console.log("Processing kanji recognition request...");
        // Tạo promise timeout để hủy nếu quá lâu
        const timeoutPromise = new Promise((_, reject)=>{
            setTimeout(()=>reject(new Error("Recognition request timed out")), RECOGNITION_TIMEOUT_MS);
        });
        // Chạy nhận diện với promise race
        const kanjiData = await Promise.race([
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$google$2d$ai$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["recognizeKanjiFromImage"])(validatedData.image),
            timeoutPromise
        ]);
        // Validate response data structure
        if (!kanjiData || !kanjiData.character) {
            throw new Error("Invalid response from AI service");
        }
        console.log("Successfully recognized kanji:", kanjiData.character);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            kanji: kanjiData
        }, {
            status: 200
        });
    } catch (error) {
        console.error("Kanji recognition error:", error);
        if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["z"].ZodError) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: "Invalid request data",
                details: error.errors
            }, {
                status: 400
            });
        }
        // Handle specific errors more gracefully
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        if (errorMessage.includes('timed out')) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'Quá thời gian xử lý. Vui lòng thử lại với hình ảnh rõ ràng hơn.',
                details: errorMessage
            }, {
                status: 504
            });
        } else if (errorMessage.includes('deprecated')) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'AI model has been deprecated. Please contact admin for an update.',
                details: errorMessage
            }, {
                status: 500
            });
        } else if (errorMessage.includes('Invalid image')) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: errorMessage
            }, {
                status: 400
            });
        } else if (errorMessage.includes('parse')) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'Failed to process the AI response',
                details: errorMessage
            }, {
                status: 500
            });
        } else if (errorMessage.includes('Invalid kanji data')) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'Invalid response format from AI service',
                details: errorMessage
            }, {
                status: 500
            });
        } else if (errorMessage.includes('Invalid kanji')) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'Không thể nhận dạng chữ Kanji hợp lệ. Vui lòng vẽ rõ ràng hơn.',
                details: errorMessage
            }, {
                status: 422
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: "Failed to recognize kanji",
            details: errorMessage
        }, {
            status: 500
        });
    }
}
}}),

};

//# sourceMappingURL=%5Broot%20of%20the%20server%5D__f0f09c30._.js.map