import Link from "next/link";

export default function LessonsPage() {
  // Danh sách cấp độ JLPT
  const jlptLevels = ["N5", "N4", "N3", "N2", "N1"];
  
  // Danh sách bài học mẫu
  const featuredLessons = [
    {
      id: 1,
      title: "あいさつ - Chào hỏi cơ bản",
      level: "N5",
      duration: "15 phút",
      category: "Giao tiếp",
      image: "/images/lessons/greeting.jpg",
    },
    {
      id: 2,
      title: "自己紹介 - Tự giới thiệu",
      level: "N5",
      duration: "20 phút",
      category: "Giao tiếp",
      image: "/images/lessons/introduction.jpg",
    },
    {
      id: 3,
      title: "て形 - Thể て và cách sử dụng",
      level: "N5",
      duration: "25 phút",
      category: "Ngữ pháp",
      image: "/images/lessons/te-form.jpg",
    },
    {
      id: 4,
      title: "日常会話 - Hội thoại hàng ngày",
      level: "N4",
      duration: "30 phút",
      category: "Giao tiếp",
      image: "/images/lessons/daily-conversation.jpg",
    },
    {
      id: 5,
      title: "助詞の使い方 - Cách sử dụng trợ từ",
      level: "N4",
      duration: "35 phút",
      category: "Ngữ pháp",
      image: "/images/lessons/particles.jpg",
    },
    {
      id: 6,
      title: "敬語 - Kính ngữ",
      level: "N3",
      duration: "40 phút",
      category: "Giao tiếp",
      image: "/images/lessons/keigo.jpg",
    }
  ];
  
  // Phân loại bài học
  const categories = ["Tất cả", "Ngữ pháp", "Từ vựng", "Kanji", "Giao tiếp", "Đọc hiểu", "Nghe"];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Bài Học Tiếng Nhật</h1>
        <p className="text-gray-600 mt-2">
          Khám phá các bài học được thiết kế phù hợp với cấp độ và mục tiêu học tập của bạn.
        </p>
      </div>

      {/* Bộ lọc */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cấp độ JLPT</label>
            <select 
              className="w-full p-2 border border-gray-300 rounded-md"
              aria-label="Chọn cấp độ JLPT"
            >
              <option value="">Tất cả cấp độ</option>
              {jlptLevels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phân loại</label>
            <select 
              className="w-full p-2 border border-gray-300 rounded-md"
              aria-label="Chọn phân loại bài học"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tìm kiếm</label>
            <input 
              type="text" 
              placeholder="Nhập từ khóa..." 
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
            Tìm Kiếm
          </button>
        </div>
      </div>

      {/* Bài học phổ biến */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Bài Học Phổ Biến</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredLessons.map(lesson => (
            <Link href={`/lessons/${lesson.id}`} key={lesson.id}>
              <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-48 bg-gray-200 relative">
                  {/* Thẻ JLPT level */}
                  <span className="absolute top-2 left-2 bg-indigo-600 text-white px-2 py-1 rounded text-xs">
                    {lesson.level}
                  </span>
                  
                  {/* Placeholder cho hình ảnh */}
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    {lesson.title}
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1">{lesson.title}</h3>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <span>{lesson.category}</span>
                    <span className="mx-2">•</span>
                    <span>{lesson.duration}</span>
                  </div>
                  <div className="mt-2">
                    <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                      Học ngay →
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Phân chia theo cấp độ */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Theo Cấp Độ JLPT</h2>
        
        <div className="space-y-6">
          {jlptLevels.map(level => (
            <div key={level} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-medium">Cấp độ {level}</h3>
                <Link href={`/lessons/level/${level}`} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                  Xem tất cả →
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {featuredLessons
                  .filter(lesson => lesson.level === level)
                  .slice(0, 3)
                  .map(lesson => (
                    <Link href={`/lessons/${lesson.id}`} key={lesson.id}>
                      <div className="bg-white rounded border border-gray-100 p-3 hover:shadow-sm transition-shadow">
                        <h4 className="font-medium">{lesson.title}</h4>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <span>{lesson.category}</span>
                          <span className="mx-2">•</span>
                          <span>{lesson.duration}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                
                {featuredLessons.filter(lesson => lesson.level === level).length === 0 && (
                  <p className="text-gray-500 col-span-3">Chưa có bài học cho cấp độ này.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 