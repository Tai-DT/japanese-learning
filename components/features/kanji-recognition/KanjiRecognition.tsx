// components/features/kanji-recognition/KanjiRecognition.tsx
"use client";

import { useState } from "react";
import KanjiCanvas from "./KanjiCanvas";
import KanjiDetails from "./KanjiDetails";
import { KanjiItem } from "@/types";

export default function KanjiRecognition() {
  const [recognizedKanji, setRecognizedKanji] = useState<KanjiItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageData, setImageData] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  // Hàm để tạo hình ảnh minh họa khi có Kanji được nhận dạng
  const generateImage = async (kanji: string) => {
    if (!kanji) return;
    
    // Reset trạng thái lỗi trước đó
    setImageError(null);
    
    try {
      console.log("Bắt đầu tạo hình ảnh cho Kanji:", kanji);
      setIsGeneratingImage(true);
      
      const formData = new FormData();
      formData.append("kanji", kanji);
      formData.append("prompt", "Tạo hình ảnh minh họa sáng tạo để giúp nhớ ý nghĩa của Kanji này");
      
      console.log("Đang gửi yêu cầu đến API...");
      const response = await fetch("/api/ai/kanji-image", {
        method: "POST",
        body: formData,
      });
      
      // Lấy phản hồi dưới dạng text để debug
      const responseText = await response.text();
      console.log("Phản hồi từ API (text):", responseText);
      
      // Nếu không phải JSON hợp lệ, báo lỗi
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Lỗi phân tích JSON:", parseError);
        throw new Error("Phản hồi không phải định dạng JSON hợp lệ");
      }
      
      // Kiểm tra lỗi từ API
      if (!response.ok || data.error) {
        const errorMessage = data.error || `Lỗi API: ${response.status} ${response.statusText}`;
        console.error("Lỗi từ API:", errorMessage);
        throw new Error(errorMessage);
      }
      
      // Kiểm tra trường isError đã thêm
      if (data.isError) {
        console.log("Phát hiện lỗi từ API với trạng thái 200:", data);
        // Sử dụng thông báo từ server nếu có
        const errorMessage = data.fallbackMessage || "Không thể tạo hình ảnh. Vui lòng thử lại sau.";
        throw new Error(errorMessage);
      }
      
      // Kiểm tra xem có dữ liệu hình ảnh không
      if (!data.imageData) {
        console.error("API không trả về dữ liệu hình ảnh:", data);
        throw new Error("Không nhận được dữ liệu hình ảnh từ API");
      }
      
      console.log("Nhận thành công dữ liệu hình ảnh");
      
      // Xử lý imageData - có thể là URL hoặc base64
      if (typeof data.imageData === 'string') {
        if (data.imageData.startsWith('http')) {
          console.log("Nhận được URL hình ảnh");
        } else if (data.imageData.startsWith('data:')) {
          console.log("Nhận được hình ảnh base64, độ dài:", data.imageData.length);
        } else {
          console.log("Nhận được định dạng hình ảnh không xác định");
        }
      }
      
      setImageData(data.imageData);
    } catch (error) {
      console.error("Lỗi chi tiết khi tạo hình ảnh:", error);
      const errorMessage = error instanceof Error ? error.message : "Lỗi không xác định khi tạo hình ảnh";
      setImageError(errorMessage);
    } finally {
      setIsGeneratingImage(false);
    }
  };
  
  // Hàm xử lý khi nhận dạng Kanji thành công
  const handleRecognizeKanji = (kanji: KanjiItem | null) => {
    setRecognizedKanji(kanji);
    setImageData(null); // Reset hình ảnh khi có Kanji mới
    setImageError(null); // Reset lỗi
    
    // Tự động tạo hình ảnh nếu có Kanji
    if (kanji && kanji.character) {
      generateImage(kanji.character);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="md:w-1/2">
        <KanjiCanvas 
          onRecognizeKanji={handleRecognizeKanji}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      </div>
      
      <div className="md:w-1/2">
        <KanjiDetails 
          kanji={recognizedKanji} 
          isLoading={isLoading}
          imageData={imageData}
          isGeneratingImage={isGeneratingImage}
          imageError={imageError}
          onRegenerateImage={() => recognizedKanji && generateImage(recognizedKanji.character)}
        />
      </div>
    </div>
  );
}
