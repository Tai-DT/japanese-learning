"use client";

import { useState, useEffect } from "react";
import VocabularyGrid from "@/components/features/vocabulary/VocabularyGrid";
import VocabularySearch from "@/components/features/vocabulary/VocabularySearch";
import { VocabularyItem } from "@/types";

export default function VocabularyPage() {
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initial fetch of vocabulary
  useEffect(() => {
    fetchVocabulary();
  }, []);

  const fetchVocabulary = async (term: string = "", level: string = "N5") => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/ai/vocabulary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: term, level, count: 6 }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch vocabulary data");
      }
      
      const data = await response.json();
      
      if (data.vocabulary && Array.isArray(data.vocabulary)) {
        setVocabulary(data.vocabulary);
      } else {
        throw new Error("Invalid vocabulary data received");
      }
    } catch (error) {
      console.error("Error fetching vocabulary:", error);
      setError(error instanceof Error ? error.message : "Unknown error occurred");
      // Keep the previous vocabulary if there's an error
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (term: string, level: string) => {
    await fetchVocabulary(term, level);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Học Từ Vựng Tiếng Nhật</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Học từ vựng tiếng Nhật với phát âm chuẩn xác và ví dụ thực tế.
          Tất cả được tạo và cập nhật bởi AI.
        </p>
      </div>
      
      <VocabularySearch onSearch={handleSearch} />
      
      {isLoading ? (
        <div className="text-center p-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-2">Đang tải từ vựng...</p>
        </div>
      ) : error ? (
        <div className="text-center p-12 text-red-500">
          <p>Lỗi: {error}</p>
          <button 
            onClick={() => fetchVocabulary()} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Thử lại
          </button>
        </div>
      ) : vocabulary.length === 0 ? (
        <div className="text-center p-12">
          <p>Không tìm thấy từ vựng nào phù hợp. Vui lòng thử lại với từ khóa khác.</p>
        </div>
      ) : (
        <VocabularyGrid vocabulary={vocabulary} />
      )}
    </div>
  );
}
