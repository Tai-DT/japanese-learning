// components/features/vocabulary/VocabularyCard.tsx
"use client";

import { useState } from "react";
import { VocabularyItem } from "@/types";

interface VocabularyCardProps {
  item: VocabularyItem;
}

export default function VocabularyCard({ item }: VocabularyCardProps) {
  const [showMeaning, setShowMeaning] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const playAudio = async () => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    
    try {
      // Sử dụng Web Speech API để phát âm
      const utterance = new SpeechSynthesisUtterance(item.japanese);
      utterance.lang = "ja-JP";
      utterance.onend = () => setIsPlaying(false);
      speechSynthesis.speak(utterance);
    } catch (error) {
      console.error("Error playing audio:", error);
      setIsPlaying(false);
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-bold">{item.japanese}</h3>
          <span className="text-xs bg-blue-100 px-2 py-1 rounded">{item.level}</span>
        </div>
        <p className="text-gray-600">{item.hiragana}</p>
        <p className="text-gray-500 text-sm">{item.romaji}</p>
      </div>

      <div className="p-4 border-t bg-gray-50">
        {showMeaning ? (
          <div className="space-y-2">
            <p className="font-medium">{item.meaning}</p>
            <div className="mt-4 p-3 bg-gray-100 rounded-md">
              <p className="text-sm font-medium">Ví dụ:</p>
              <p className="mt-1">{item.example.japanese}</p>
              <p className="text-sm text-gray-600">{item.example.meaning}</p>
            </div>
          </div>
        ) : (
          <div className="h-24 flex items-center justify-center">
            <p className="text-gray-400">Nhấn để hiển thị nghĩa</p>
          </div>
        )}
      </div>

      <div className="flex border-t">
        <button 
          className="flex-1 py-2 text-center hover:bg-gray-100 transition-colors"
          onClick={() => setShowMeaning(!showMeaning)}
        >
          {showMeaning ? "Ẩn nghĩa" : "Hiện nghĩa"}
        </button>
        <button 
     className="flex-1 py-2 text-center bg-blue-50 hover:bg-blue-100 transition-colors"
     onClick={playAudio}
     disabled={isPlaying}
   >
     {isPlaying ? "Đang phát..." : "Phát âm"}
   </button>
 </div>
</div>
);
}