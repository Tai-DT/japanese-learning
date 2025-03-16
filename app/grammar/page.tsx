// app/grammar/page.tsx
import TranslationTool from "@/components/features/translation/TranslationTool";
// Có thể bổ sung thêm component bài tập ngữ pháp

export default function GrammarPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Học Ngữ Pháp và Dịch Thuật</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Sử dụng công cụ dịch thuật thông minh để học ngữ pháp tiếng Nhật.
          AI sẽ giúp bạn hiểu cấu trúc ngữ pháp và cách sử dụng từ vựng trong câu.
        </p>
      </div>
      
      <TranslationTool />
      
      {/* Có thể bổ sung thêm phần bài tập ngữ pháp */}
    </div>
  );
}
