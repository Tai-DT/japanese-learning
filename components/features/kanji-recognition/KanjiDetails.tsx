// components/features/kanji-recognition/KanjiDetails.tsx
import { KanjiItem } from "@/types";

interface KanjiDetailsProps {
  kanji: KanjiItem | null;
  isLoading?: boolean;
  imageData?: string | null;
  isGeneratingImage?: boolean;
  imageError?: string | null;
  onRegenerateImage?: () => void;
}

export default function KanjiDetails({ 
  kanji, 
  isLoading = false, 
  imageData = null,
  isGeneratingImage = false,
  imageError = null,
  onRegenerateImage
}: KanjiDetailsProps) {
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center border rounded-lg p-12">
        <div className="text-center">
          <div className="inline-block animate-pulse">
            <span className="text-7xl font-japanese text-gray-300">字</span>
          </div>
          <p className="mt-4 text-gray-500">Đang nhận dạng chữ Kanji...</p>
        </div>
      </div>
    );
  }

  if (!kanji) {
    return (
      <div className="h-full flex items-center justify-center border rounded-lg p-12">
        <div className="text-center text-gray-500">
          <p className="text-lg mb-2">Vẽ một chữ Kanji để nhận dạng</p>
          <p className="text-sm">Hệ thống AI sẽ phân tích và cung cấp thông tin chi tiết về chữ Kanji của bạn</p>
          <p className="text-xs mt-4 text-gray-400">Hệ thống sẽ tự động nhận dạng sau khi bạn hoàn thành nét vẽ</p>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-6 space-y-4 overflow-auto max-h-[85vh]">
      <div className="text-center">
        <span className="text-7xl font-japanese">
          {kanji.character}
        </span>
      </div>
      
      {/* Phần hiển thị hình ảnh minh họa */}
      <div className="mt-4 border rounded-lg overflow-hidden">
        {isGeneratingImage ? (
          <div className="h-48 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="inline-block animate-pulse">
                <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              <p className="mt-2 text-sm text-gray-500">Đang tạo hình ảnh minh họa...</p>
            </div>
          </div>
        ) : imageError ? (
          <div className="h-48 flex items-center justify-center bg-red-50">
            <div className="text-center p-4">
              <svg className="w-10 h-10 text-red-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p className="text-sm font-medium text-red-600">
                {imageError.includes("Không thể tạo hình ảnh tự động") ? "Lỗi tạo hình ảnh" : "Không thể tạo hình ảnh"}
              </p>
              <p className="text-xs text-red-500 mt-1 mb-3">
                {imageError.includes("Rất tiếc") 
                  ? imageError 
                  : imageError.includes("Không thể tạo hình ảnh tự động")
                    ? "Không thể tạo hình ảnh cho Kanji này. Vui lòng thử lại sau hoặc thử một Kanji khác."
                    : imageError}
              </p>
              <button 
                onClick={onRegenerateImage}
                className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-600 text-xs rounded-full"
              >
                Thử lại
              </button>
            </div>
          </div>
        ) : imageData ? (
          <div className="relative">
            <div className="relative h-48 w-full">
              <img 
                src={imageData} 
                alt={`Hình ảnh minh họa cho kanji ${kanji.character}`} 
                className="w-full h-full object-contain"
                onError={(e) => {
                  console.error("Lỗi khi tải hình ảnh:", e);
                  // Fallback khi không tải được hình ảnh
                  if (imageData.startsWith('data:')) {
                    // Nếu là base64 bị lỗi, có thể thử biện pháp khác
                    e.currentTarget.onerror = null; // Tránh vòng lặp vô hạn
                  }
                }}
              />
            </div>
            <button 
              onClick={onRegenerateImage}
              className="absolute bottom-2 right-2 bg-white bg-opacity-80 rounded-full p-2 shadow-sm hover:bg-opacity-100"
              title="Tạo lại hình ảnh"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
            </button>
          </div>
        ) : (
          <div className="h-48 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <svg className="w-12 h-12 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <p className="mt-2 text-sm text-gray-500">Chưa có hình ảnh minh họa</p>
              <button 
                onClick={onRegenerateImage}
                className="mt-2 text-xs text-blue-600 underline"
              >
                Tạo hình ảnh minh họa
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div>
          <h3 className="font-medium text-gray-500">Âm On:</h3>
          <p>{kanji.onReading.join(", ")}</p>
        </div>
        <div>
          <h3 className="font-medium text-gray-500">Âm Kun:</h3>
          <p>{kanji.kunReading.join(", ")}</p>
        </div>
        <div>
          <h3 className="font-medium text-gray-500">Số nét:</h3>
          <p>{kanji.strokeCount}</p>
        </div>
        <div>
          <h3 className="font-medium text-gray-500">JLPT:</h3>
          <p>{kanji.jlptLevel}</p>
        </div>
      </div>
      
      <div>
        <h3 className="font-medium text-gray-500">Nghĩa:</h3>
        <p>{kanji.meaning.join(", ")}</p>
      </div>
      
      <div>
        <h3 className="font-medium text-gray-500">Ví dụ:</h3>
        <ul className="space-y-2 mt-2">
          {kanji.examples.map((example, index) => (
            <li key={index} className="border-b pb-2">
              <p className="font-medium">{example.word}</p>
              <p className="text-sm">{example.reading}</p>
              <p className="text-sm text-gray-600">{example.meaning}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
