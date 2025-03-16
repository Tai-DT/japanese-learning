// app/kanji/page.tsx
import KanjiRecognition from "@/components/features/kanji-recognition/KanjiRecognition";

export default function KanjiPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Học và Nhận Dạng Kanji</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Vẽ một chữ Kanji để nhận dạng và học thông tin chi tiết về nó.
          Hệ thống AI sẽ phân tích và cung cấp thông tin về cách đọc, nghĩa và ví dụ sử dụng.
        </p>
      </div>
      
      <KanjiRecognition />
      
      <div className="bg-gray-50 p-6 rounded-lg mt-8">
        <h2 className="text-xl font-bold mb-4">Cách Học Kanji Hiệu Quả</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Học Kanji theo bộ thủ (radical) để dễ nhớ cấu trúc</li>
          <li>Luyện viết thường xuyên để ghi nhớ nét chữ</li>
          <li>Học Kanji trong ngữ cảnh (từ và câu) thay vì riêng lẻ</li>
          <li>Sử dụng phương pháp nhắc lại cách quãng (spaced repetition)</li>
          <li>Kết hợp học On-yomi và Kun-yomi cùng với ví dụ thực tế</li>
        </ul>
      </div>
    </div>
  );
}
