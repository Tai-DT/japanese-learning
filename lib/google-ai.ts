import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, Part } from "@google/generative-ai";
import { KanjiItem, VocabularyItem } from "@/types";

// Initialize Google AI with API key
const apiKey = process.env.GOOGLE_AI_API_KEY!;
const genAI = new GoogleGenerativeAI(apiKey);

// Safety settings configuration
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

// Update to use Gemini 2.0-flash model
const MODEL_NAME = "gemini-2.0-flash";

// Improve JSON extraction function for better parsing
function extractJsonFromText<T>(text: string): T {
  // First try direct parsing
  try {
    return JSON.parse(text.trim());
  } catch {
    // Try to extract JSON from code blocks or find JSON pattern
    const jsonMatch = 
      text.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || 
      text.match(/({[\s\S]*?})/);
    
    if (!jsonMatch) {
      throw new Error("Could not extract JSON from the response");
    }
    
    const jsonContent = jsonMatch[1] || jsonMatch[0];
    try {
      return JSON.parse(jsonContent.trim());
    } catch (parseError) {
      throw new Error(`Failed to parse extracted JSON: ${parseError instanceof Error ? parseError.message : "Unknown error"}`);
    }
  }
}

// Enhanced chatWithAI function with better prompting
export async function chatWithAI(prompt: string, context: string = ""): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME, safetySettings });

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

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
    });

    if (!result || !result.response) {
      throw new Error("Invalid AI response");
    }

    return result.response.text();
  } catch (error) {
    console.error("Error chatting with AI:", error);
    throw new Error(`Failed to generate response from AI: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

// Enhanced translation function with better prompting
export async function translateText(
  text: string, 
  sourceLang: string = "en", 
  targetLang: string = "ja"
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME, safetySettings });

    // Enhanced prompt with strict instructions
    const prompt = `Translate the following text from ${sourceLang} to ${targetLang}.
    
Input text: "${text}"

Rules:
1. Provide ONLY the translation, with no explanations or additional text
2. Maintain the original tone and formality level
3. Preserve proper names as they are unless they have standard translations
4. Ensure natural sounding output in the target language

Translation:`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    if (!result || !result.response) {
      throw new Error("Invalid AI response");
    }

    return result.response.text().trim();
  } catch (error) {
    console.error("Error translating text:", error);
    throw new Error("Failed to translate text");
  }
}

// Enhanced kanji recognition function with better prompting
export async function recognizeKanji(kanjiCharacter: string): Promise<KanjiAnalysis> {
  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME, safetySettings });

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

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    if (!result || !result.response) {
      throw new Error("Invalid AI response");
    }

    const jsonStr = result.response.text();
    return extractJsonFromText<KanjiAnalysis>(jsonStr);
  } catch (error) {
    console.error("Error analyzing kanji:", error);
    throw new Error("Failed to analyze kanji");
  }
}

// Kanji Analysis Type Definition
interface KanjiAnalysis {
  character: string;
  onReading: string[];
  kunReading: string[];
  meaning: string[];
  strokeCount: number;
  jlptLevel: string;
  examples: {
    word: string;
    reading: string;
    meaning: string;
  }[];
}

// Enhanced image recognition function with better prompting
export async function recognizeKanjiFromImage(imageBase64: string): Promise<KanjiItem> {
  try {
    // Validate input
    if (!imageBase64) {
      throw new Error("No image data provided");
    }

    // Determine image type from data URL
    let mimeType = 'image/png';
    if (imageBase64.startsWith('data:image/jpeg')) {
      mimeType = 'image/jpeg';
    } else if (imageBase64.startsWith('data:image/jpg')) {
      mimeType = 'image/jpg';
    }

    // Remove the data URL prefix
    const base64Data = imageBase64.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');

    // Validate that we have actual image data
    if (!base64Data || base64Data.length < 100) {
      throw new Error("Invalid or empty image data");
    }

    console.log(`Processing image with MIME type: ${mimeType}, data length: ${base64Data.length}`);

    // Prepare the image part for the model
    const imagePart: Part = {
      inlineData: {
        data: base64Data,
        mimeType: mimeType,
      },
    };

      // Enhanced prompt for better image recognition with CORRECTED PROPERTY NAMES
      const prompt = `Analyze the kanji character in this image and return ONLY a valid JSON object with this structure:
  {
    "character": "the kanji character",
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
  
  Do not include any text outside the JSON object.`;
  
      // Initialize the model with proper parameters for vision tasks
    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      generationConfig: {
        temperature: 0.1,  // More deterministic results
        topP: 0.95,
        topK: 32,
        maxOutputTokens: 2048,
      },
      safetySettings,
    });
    
    // Generate content
    console.log("Sending request to AI model...");
    const result = await model.generateContent({
      contents: [
        { 
          role: "user", 
          parts: [
            { text: prompt },
            imagePart
          ] 
        }
      ],
    });
    
    if (!result || !result.response) {
      throw new Error("Empty response from AI model");
    }
    
    const response = result.response;
    console.log("Received response from AI model");
    
    // Process the result
    const textContent = response.text();
    console.log("Response text length:", textContent.length);
    
    // Use the improved JSON extraction function
    try {
      const parsedData = extractJsonFromText<KanjiItem>(textContent);
      
      // Validate the response structure
      if (!parsedData || !parsedData.character) {
        console.error("Invalid kanji data structure:", parsedData);
        throw new Error("Invalid kanji data: missing character");
      }
      
      return parsedData as KanjiItem;
    } catch (parseError) {
      console.error("JSON parsing error:", parseError);
      console.error("Raw response:", textContent);
      throw new Error(`Failed to parse AI response: ${parseError instanceof Error ? parseError.message : "Unknown error"}`);
    }
  } catch (error) {
    console.error("Error recognizing kanji from image:", error);
    throw new Error(`Failed to analyze kanji image: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

// Enhanced vocabulary generation with better prompting
export async function generateVocabulary(
  query: string = "", 
  level: string = "N5", 
  count: number = 6
): Promise<VocabularyItem[]> {
  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME, safetySettings });

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

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    if (!result || !result.response) {
      throw new Error("Invalid AI response");
    }

    const jsonStr = result.response.text();
    return extractJsonFromText<VocabularyItem[]>(jsonStr);
  } catch (error) {
    console.error("Error generating vocabulary:", error);
    throw new Error("Failed to generate vocabulary data");
  }
}
