// app/page.tsx
import Link from "next/link";
import Image from "next/image";
import ClientApiKeyWrapper from "@/components/features/api-key/ClientApiKeyWrapper";

export default function Home() {
  const features = [
    {
      title: "Học Từ Vựng",
      description: "Học từ vựng tiếng Nhật với phát âm và ví dụ",
      icon: "📚",
      link: "/vocabulary",
    },
    {
      title: "Bài Học",
      description: "Các bài học có cấu trúc theo trình độ JLPT",
      icon: "📖",
      link: "/lessons",
    },
    {
      title: "Luyện Tập",
      description: "Các bài tập đa dạng để rèn luyện kỹ năng",
      icon: "🏋️‍♂️",
      link: "/practice",
    },
    {
      title: "Luyện Kanji",
      description: "Nhận dạng và học cách viết Kanji",
      icon: "✍️",
      link: "/kanji",
    },
    {
      title: "Ngữ Pháp",
      description: "Bài tập ngữ pháp được tạo tự động bởi AI",
      icon: "📝",
      link: "/grammar",
    },
    {
      title: "Hội Thoại",
      description: "Trò chuyện với AI để luyện kỹ năng hội thoại",
      icon: "💬",
      link: "/conversation",
    },
  ];

  return (
    <div className="space-y-12">
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold mb-4">Học Tiếng Nhật với AI</h1>
        <p className="text-xl max-w-2xl mx-auto">
          Nền tảng học tiếng Nhật thông minh sử dụng công nghệ AI để cá nhân hóa
          trải nghiệm học tập của bạn.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/lessons" 
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Bắt Đầu Học Ngay
          </Link>
        </div>
      </section>

      <section className="max-w-2xl mx-auto">
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Cài đặt API Key</h2>
          <p className="text-gray-600 text-sm mb-4">
            Để tránh tình trạng quá tải API khi nhiều người cùng sử dụng, bạn có thể cấu hình API key riêng của Google AI.
            API key này sẽ được sử dụng cho các tính năng AI như nhận dạng Kanji và trò chuyện.
          </p>
        </div>
        <ClientApiKeyWrapper />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature) => (
          <Link 
            key={feature.title} 
            href={feature.link}
            className="border rounded-xl p-6 hover:shadow-lg transition-shadow"
          >
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h2 className="text-xl font-semibold mb-2">{feature.title}</h2>
            <p className="text-gray-600">{feature.description}</p>
          </Link>
        ))}
      </section>

      <section className="bg-gray-50 p-8 rounded-xl">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2">
            <h2 className="text-2xl font-bold mb-4">Học Tiếng Nhật Thông Minh</h2>
            <p className="mb-4">
              Ứng dụng của chúng tôi sử dụng trí tuệ nhân tạo tiên tiến để tạo ra
              trải nghiệm học tập cá nhân hóa, giúp bạn tiến bộ nhanh hơn và hiệu quả hơn.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> Phát âm chuẩn xác
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> Bài tập tùy chỉnh theo trình độ
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> Phản hồi ngay lập tức
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> Học mọi lúc, mọi nơi
              </li>
            </ul>
          </div>
          <div className="md:w-1/2">
            <Image 
              src="/images/ai-learning.png" 
              alt="AI Learning" 
              width={500} 
              height={300}
              className="rounded-lg"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
