// components/features/kanji-recognition/KanjiDetails.tsx
import { KanjiItem } from "@/types";

interface KanjiDetailsProps {
  kanji: KanjiItem | null;
  isLoading?: boolean;
}

export default function KanjiDetails({ kanji, isLoading = false }: KanjiDetailsProps) {
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
    <div className="border rounded-lg p-6 space-y-4">
      <div className="text-center">
        <span className="text-7xl font-japanese">
          {kanji.character}
        </span>
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
