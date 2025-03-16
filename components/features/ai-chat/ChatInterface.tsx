// components/features/ai-chat/ChatInterface.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "@/types";

export default function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "こんにちは！日本語を練習しましょう。何か話したいことがありますか？\n(Xin chào! Hãy cùng luyện tập tiếng Nhật. Bạn muốn nói về điều gì?)"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<string>("beginner");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    const userMessage: ChatMessage = {
      role: "user",
      content: input
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    try {
      // Tạo context dựa trên level
      const context = `You are a Japanese language tutor. The user is at ${selectedLevel} level. 
      Always respond in simple Japanese followed by Vietnamese translation in parentheses. 
      Keep responses short and helpful.`;
      
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          context: context
        }),
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      const aiResponse = data.response;
      
      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: aiResponse
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      
      const errorMessage: ChatMessage = {
        role: "assistant",
        content: "すみません、エラーが発生しました。もう一度お試しください。\n(Xin lỗi, đã xảy ra lỗi. Vui lòng thử lại.)"
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] border rounded-lg">
      <div className="border-b p-4">
        <div className="flex justify-between items-center">
          <h2 className="font-bold">Trò Chuyện Tiếng Nhật</h2>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="p-2 border rounded-md text-sm"
            aria-label="Japanese proficiency level"
          >
            <option value="beginner">Người mới bắt đầu</option>
            <option value="intermediate">Trung cấp</option>
            <option value="advanced">Nâng cao</option>
          </select>
        </div>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 p-3 rounded-lg max-w-[80%] ${
              message.role === 'user'
                ? 'bg-blue-100 ml-auto'
                : 'bg-gray-100 mr-auto'
            }`}
          >
            <pre className="whitespace-pre-wrap font-sans">{message.content}</pre>
          </div>
        ))}
        {isLoading && (
          <div className="bg-gray-100 p-3 rounded-lg mr-auto max-w-[80%]">
            <span className="inline-block animate-pulse">●</span>
            <span className="inline-block animate-pulse delay-100">●</span>
            <span className="inline-block animate-pulse delay-200">●</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSendMessage} className="border-t p-4">
        <div className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Nhập tin nhắn bằng tiếng Anh hoặc tiếng Nhật..."
            className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
          >
            Gửi
          </button>
        </div>
      </form>
    </div>
  );
}
