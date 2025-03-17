import Link from "next/link";

export default function PracticePage() {
  // Danh sách cấp độ JLPT
  const jlptLevels = ["N5", "N4", "N3", "N2", "N1"];
  
  // Các loại bài tập
  const exerciseTypes = [
    {
      id: "vocabulary",
      title: "Từ vựng",
      description: "Luyện tập nhớ và sử dụng từ vựng thông qua các bài tập đa dạng",
      icon: "📚",
      exercises: [
        { id: 1, title: "Flashcards - Thẻ ghi nhớ", level: "N5-N1" },
        { id: 2, title: "Điền từ vào câu", level: "N5-N3" },
        { id: 3, title: "Nối từ với nghĩa", level: "N5-N4" },
        { id: 4, title: "Luyện nghe từ vựng", level: "N5-N2" },
      ]
    },
    {
      id: "grammar",
      title: "Ngữ pháp",
      description: "Rèn luyện cấu trúc ngữ pháp và cách dùng qua các dạng bài tập ứng dụng",
      icon: "📝",
      exercises: [
        { id: 5, title: "Biến đổi cấu trúc câu", level: "N5-N3" },
        { id: 6, title: "Chọn cấu trúc đúng", level: "N5-N2" },
        { id: 7, title: "Sắp xếp từ thành câu", level: "N5-N4" },
        { id: 8, title: "Điền trợ từ thích hợp", level: "N5-N3" },
      ]
    },
    {
      id: "reading",
      title: "Đọc hiểu",
      description: "Nâng cao kỹ năng đọc hiểu thông qua các đoạn văn và bài tập đi kèm",
      icon: "📖",
      exercises: [
        { id: 9, title: "Đọc và trả lời câu hỏi", level: "N5-N1" },
        { id: 10, title: "Điền từ vào đoạn văn", level: "N4-N2" },
        { id: 11, title: "Xác định ý chính", level: "N3-N1" },
        { id: 12, title: "Đọc nhanh và tìm thông tin", level: "N4-N2" },
      ]
    },
    {
      id: "listening",
      title: "Nghe",
      description: "Luyện kỹ năng nghe hiểu với các bài hội thoại và đoạn audio thực tế",
      icon: "🎧",
      exercises: [
        { id: 13, title: "Nghe và chọn đáp án đúng", level: "N5-N1" },
        { id: 14, title: "Nghe và điền từ vào chỗ trống", level: "N4-N2" },
        { id: 15, title: "Nghe hội thoại và trả lời", level: "N3-N1" },
        { id: 16, title: "Ghi chép nội dung nghe được", level: "N3-N1" },
      ]
    },
    {
      id: "kanji",
      title: "Kanji",
      description: "Học cách viết và nhớ Kanji qua các bài tập tương tác",
      icon: "✍️",
      exercises: [
        { id: 17, title: "Viết và nhận dạng Kanji", level: "N5-N1" },
        { id: 18, title: "Ghép Kanji với âm Hán Việt", level: "N5-N3" },
        { id: 19, title: "Tìm Kanji trong văn cảnh", level: "N4-N2" },
        { id: 20, title: "Sắp xếp bộ thủ Kanji", level: "N3-N1" },
      ]
    },
    {
      id: "speaking",
      title: "Nói",
      description: "Rèn luyện kỹ năng giao tiếp và phát âm với trợ lý AI",
      icon: "🗣️",
      exercises: [
        { id: 21, title: "Luyện phát âm với AI", level: "N5-N1" },
        { id: 22, title: "Hội thoại theo tình huống", level: "N5-N1" },
        { id: 23, title: "Trả lời câu hỏi mở", level: "N4-N1" },
        { id: 24, title: "Mô tả hình ảnh", level: "N4-N2" },
      ]
    }
  ];
  
  // Bài tập đề xuất dựa trên dữ liệu người dùng (giả lập)
  const recommendedExercises = [
    { id: 5, title: "Biến đổi cấu trúc câu", type: "Ngữ pháp", level: "N5", progress: 30 },
    { id: 1, title: "Flashcards - Thẻ ghi nhớ", type: "Từ vựng", level: "N5", progress: 45 },
    { id: 17, title: "Viết và nhận dạng Kanji", type: "Kanji", level: "N5", progress: 20 },
    { id: 13, title: "Nghe và chọn đáp án đúng", type: "Nghe", level: "N5", progress: 15 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Luyện Tập Tiếng Nhật</h1>
        <p className="text-gray-600 mt-2">
          Rèn luyện các kỹ năng tiếng Nhật của bạn thông qua nhiều dạng bài tập đa dạng.
        </p>
      </div>

      {/* Bài tập đề xuất */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Bài Tập Đề Xuất Cho Bạn</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendedExercises.map(exercise => (
            <Link href={`/practice/exercise/${exercise.id}`} key={exercise.id}>
              <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-1 rounded">
                      {exercise.type} • {exercise.level}
                    </span>
                    <span className="text-gray-500 text-sm">{exercise.progress}%</span>
                  </div>
                  
                  <h3 className="font-semibold text-lg mb-3">{exercise.title}</h3>
                  
                  {/* Thanh tiến độ */}
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div 
                      className="bg-indigo-600 h-2 rounded-full" 
                      style={{ width: `${exercise.progress}%` }}
                    ></div>
                  </div>
                  
                  <button className="w-full mt-2 bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors">
                    Tiếp tục luyện tập
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Lọc theo cấp độ */}
      <div className="mb-8">
        <div className="flex overflow-x-auto space-x-2 py-2 mb-4">
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors whitespace-nowrap">
            Tất cả
          </button>
          {jlptLevels.map(level => (
            <button 
              key={level}
              className="bg-white text-gray-800 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors whitespace-nowrap"
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Các loại bài tập */}
      <div>
        <div className="space-y-8">
          {exerciseTypes.map(type => (
            <div key={type.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{type.icon}</span>
                <div>
                  <h3 className="text-xl font-semibold">{type.title}</h3>
                  <p className="text-gray-600">{type.description}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                {type.exercises.map(exercise => (
                  <Link href={`/practice/exercise/${exercise.id}`} key={exercise.id}>
                    <div className="border border-gray-200 rounded-md p-3 hover:border-indigo-300 hover:shadow-sm transition-all">
                      <h4 className="font-medium mb-1">{exercise.title}</h4>
                      <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                        {exercise.level}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
              
              <div className="mt-4 text-center">
                <Link href={`/practice/${type.id}`} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                  Xem tất cả bài tập {type.title.toLowerCase()} →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lịch học và thống kê */}
      <div className="mt-10 bg-gray-50 rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Theo dõi tiến độ</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-medium mb-3">Thống kê luyện tập</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Bài tập đã hoàn thành:</span>
                <span className="font-medium">24/120</span>
              </div>
              <div className="flex justify-between">
                <span>Số phút đã luyện tập:</span>
                <span className="font-medium">320 phút</span>
              </div>
              <div className="flex justify-between">
                <span>Độ chính xác trung bình:</span>
                <span className="font-medium">78%</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-medium mb-3">Mục tiêu tuần này</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>10 bài tập hoàn thành</span>
                  <span>6/10</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>5 giờ luyện tập</span>
                  <span>3.5/5 giờ</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                </div>
              </div>
              
              <div className="mt-4">
                <Link 
                  href="/profile/goals" 
                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                >
                  Điều chỉnh mục tiêu →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 