"use client";

import { useState } from "react";

export default function TranslationTool() {
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [sourceLang, setSourceLang] = useState("vi");
  const [targetLang, setTargetLang] = useState("ja");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const translateText = async () => {
    if (!sourceText.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Trong video thực tế, sẽ gọi API
      // const response = await fetch('/api/ai/translate', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     text: sourceText,
      //     sourceLang,
      //     targetLang
      //   }),
      // });
      
      // if (!response.ok) {
      //   throw new Error('Translation failed');
      // }
      
      // const data = await response.json();
      // setTranslatedText(data.translatedText);
      
      // Giả lập kết quả dịch cho video demo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (sourceLang === "vi" && targetLang === "ja") {
        if (sourceText.toLowerCase().includes("xin chào")) {
          setTranslatedText("こんにちは");
        } else if (sourceText.toLowerCase().includes("cảm ơn")) {
          setTranslatedText("ありがとうございます");
        } else if (sourceText.toLowerCase().includes("tôi tên là")) {
          setTranslatedText("私の名前は...です");
        } else {
          setTranslatedText("日本語で翻訳されたテキスト");
        }
      } else if (sourceLang === "ja" && targetLang === "vi") {
        if (sourceText.includes("こんにちは")) {
          setTranslatedText("Xin chào");
        } else if (sourceText.includes("ありがとう")) {
          setTranslatedText("Cảm ơn");
        } else if (sourceText.includes("私の名前は")) {
          setTranslatedText("Tôi tên là...");
        } else {
          setTranslatedText("Văn bản được dịch sang tiếng Việt");
        }
      } else {
        setTranslatedText("Translated text will appear here");
      }
    } catch (error) {
      console.error("Translation error:", error);
      setError("Có lỗi xảy ra khi dịch. Vui lòng thử lại sau!");
    } finally {
      setIsLoading(false);
    }
  };

  const swapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  return (
    <div className="border rounded-lg p-6 space-y-6">
      <div className="flex justify-center items-center space-x-2">
        <select
          value={sourceLang}
          onChange={(e) => setSourceLang(e.target.value)}
          className="p-2 border rounded"
          aria-label="Source language"
        >
          <option value="vi">Tiếng Việt</option>
          <option value="ja">Tiếng Nhật</option>
          <option value="en">Tiếng Anh</option>
        </select>
        
        <button 
          onClick={swapLanguages}
          className="p-2 border rounded hover:bg-gray-100"
        >
          ⇄
        </button>
        <select
          value={targetLang}
          onChange={(e) => setTargetLang(e.target.value)}
          className="p-2 border rounded"
          aria-label="Target language"
        >
          <option value="ja">Tiếng Nhật</option>
          <option value="vi">Tiếng Việt</option>
          <option value="en">Tiếng Anh</option>
        </select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <textarea
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            placeholder="Nhập văn bản cần dịch..."
            className="w-full h-48 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
        
        <div>
          <div className="w-full h-48 p-3 border rounded-lg bg-gray-50 overflow-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                <span className="ml-2">Đang dịch...</span>
              </div>
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : translatedText ? (
              <div>{translatedText}</div>
            ) : (
              <div className="text-gray-400 h-full flex items-center justify-center">
                Bản dịch sẽ xuất hiện ở đây
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex justify-center">
        <button
          onClick={translateText}
          disabled={isLoading || !sourceText.trim()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
        >
          {isLoading ? "Đang dịch..." : "Dịch"}
        </button>
      </div>
    </div>
  );
}
