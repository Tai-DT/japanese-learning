// components/features/kanji-recognition/KanjiRecognition.tsx
"use client";

import { useState } from "react";
import KanjiCanvas from "./KanjiCanvas";
import KanjiDetails from "./KanjiDetails";
import { KanjiItem } from "@/types";

export default function KanjiRecognition() {
  const [recognizedKanji, setRecognizedKanji] = useState<KanjiItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="md:w-1/2">
        <KanjiCanvas 
          onRecognizeKanji={setRecognizedKanji}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      </div>
      
      <div className="md:w-1/2">
        <KanjiDetails 
          kanji={recognizedKanji} 
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
