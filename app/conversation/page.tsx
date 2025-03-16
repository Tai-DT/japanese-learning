// app/conversation/page.tsx
import ChatInterface from "@/components/features/ai-chat/ChatInterface";

export default function ConversationPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Luyện Hội Thoại Tiếng Nhật</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Trò chuyện với AI để luyện kỹ năng hội thoại tiếng Nhật.
          AI sẽ điều chỉnh cấp độ phù hợp với trình độ của bạn.
        </p>
      </div>
      
      <ChatInterface />
    </div>
  );
}
