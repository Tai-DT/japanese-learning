// types/index.ts
export interface VocabularyItem {
    id: string;
    japanese: string;
    hiragana: string;
    romaji: string;
    meaning: string;
    example: {
      japanese: string;
      meaning: string;
    };
    level: "N5" | "N4" | "N3" | "N2" | "N1";
  }
  
  export interface KanjiItem {
    character: string;
    onReading: string[];
    kunReading: string[];
    meaning: string[];
    strokeCount: number;
    jlptLevel: "N5" | "N4" | "N3" | "N2" | "N1";
    examples: {
      word: string;
      reading: string;
      meaning: string;
    }[];
  }
  
  export interface ChatMessage {
    role: "user" | "assistant";
    content: string;
  }
  
  export interface TranslationRequest {
    text: string;
    sourceLang: string;
    targetLang: string;
  }
  
  export interface TranslationResponse {
    translatedText: string;
    pronunciation?: string;
  }
  