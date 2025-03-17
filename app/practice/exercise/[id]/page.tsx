'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import StudyProgressButton from '@/components/features/study-progress/StudyProgressButton';

// Dữ liệu mẫu cho bài tập - trong ứng dụng thực, có thể lấy từ API hoặc cơ sở dữ liệu
const exerciseSample = {
  1: {
    id: 1,
    title: "Flashcards - Thẻ ghi nhớ",
    category: "Từ vựng",
    level: "N5",
    description: "Luyện nhớ từ vựng cơ bản N5 qua thẻ ghi nhớ.",
    instructions: "Hãy xem mỗi thẻ và cố gắng nhớ nghĩa của từ. Nhấn vào thẻ để kiểm tra đáp án.",
    cards: [
      { front: "猫", back: "Con mèo", romaji: "neko" },
      { front: "犬", back: "Con chó", romaji: "inu" },
      { front: "鳥", back: "Con chim", romaji: "tori" },
      { front: "魚", back: "Con cá", romaji: "sakana" },
      { front: "馬", back: "Con ngựa", romaji: "uma" },
    ]
  },
  5: {
    id: 5,
    title: "Biến đổi cấu trúc câu",
    category: "Ngữ pháp",
    level: "N5",
    description: "Luyện tập biến đổi các cấu trúc câu cơ bản trong tiếng Nhật.",
    instructions: "Hãy biến đổi câu theo yêu cầu và kiểm tra đáp án.",
    questions: [
      { 
        question: "私は毎日学校に行きます。(Phủ định)",
        answer: "私は毎日学校に行きません。" 
      },
      { 
        question: "彼は映画を見ます。(Quá khứ)",
        answer: "彼は映画を見ました。" 
      },
      { 
        question: "私は日本語を勉強します。(Thể て)",
        answer: "私は日本語を勉強して。" 
      },
    ]
  },
  17: {
    id: 17,
    title: "Viết và nhận dạng Kanji",
    category: "Kanji",
    level: "N5",
    description: "Luyện tập viết và nhận dạng các Kanji cơ bản N5.",
    instructions: "Hãy viết Kanji theo mẫu và kiểm tra với hệ thống nhận dạng.",
    kanjis: [
      { kanji: "日", meaning: "Ngày/mặt trời", onyomi: "ニチ, ジツ", kunyomi: "ひ, -び, -か" },
      { kanji: "月", meaning: "Tháng/mặt trăng", onyomi: "ゲツ, ガツ", kunyomi: "つき" },
      { kanji: "水", meaning: "Nước", onyomi: "スイ", kunyomi: "みず" },
    ]
  }
};

export default function ExerciseDetail() {
  const router = useRouter();
  const params = useParams();
  const [exercise, setExercise] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});

  // Đảo thẻ
  const toggleCard = (index: number) => {
    setFlipped(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  useEffect(() => {
    // Khởi động đồng hồ tính giờ
    setStartTime(Date.now());
    
    // Lấy thông tin bài tập từ id
    const id = params?.id ? parseInt(params.id as string, 10) : 0;
    
    if (id && exerciseSample[id as keyof typeof exerciseSample]) {
      setExercise(exerciseSample[id as keyof typeof exerciseSample]);
      setLoading(false);
    } else {
      // Xử lý trường hợp không tìm thấy bài tập
      router.push('/practice');
    }

    // Cleanup khi component unmount
    return () => {
      if (startTime > 0) {
        const endTime = Date.now();
        const minutesSpent = Math.round((endTime - startTime) / 60000);
        setTimeSpent(minutesSpent);
      }
    };
  }, [params, router]);

  const handleComplete = () => {
    // Tính toán thời gian đã dành
    const endTime = Date.now();
    const minutesSpent = Math.round((endTime - startTime) / 60000);
    setTimeSpent(minutesSpent);
    
    // Cho mục đích demo, gán điểm ngẫu nhiên từ 70-100
    const randomScore = Math.floor(Math.random() * 31) + 70;
    setScore(randomScore);
    
    setCompleted(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        <span className="ml-3 text-indigo-600">Đang tải...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/practice" className="text-indigo-600 hover:text-indigo-800">
          ← Quay lại danh sách bài tập
        </Link>
      </div>

      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold">{exercise.title}</h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-1 rounded">
                {exercise.category}
              </span>
              <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-1 rounded">
                {exercise.level}
              </span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-gray-700">{exercise.description}</p>
          <div className="mt-4 bg-yellow-50 p-4 rounded-md">
            <p className="text-sm font-medium text-yellow-800">Hướng dẫn:</p>
            <p className="text-sm text-yellow-700">{exercise.instructions}</p>
          </div>
        </div>

        {/* Nội dung bài tập - Flashcards */}
        {exercise.cards && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Thẻ ghi nhớ</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {exercise.cards.map((card: any, index: number) => (
                <div 
                  key={index}
                  className={`cursor-pointer border rounded-lg p-4 h-40 flex items-center justify-center shadow-sm transition-all duration-500 ${
                    flipped[index] ? 'bg-indigo-50' : 'bg-white'
                  }`}
                  onClick={() => toggleCard(index)}
                >
                  <div className="text-center">
                    {flipped[index] ? (
                      <>
                        <p className="text-lg font-bold text-gray-800">{card.back}</p>
                        <p className="text-sm text-gray-500">{card.romaji}</p>
                      </>
                    ) : (
                      <p className="text-4xl font-bold text-gray-800">{card.front}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Nội dung bài tập - Ngữ pháp */}
        {exercise.questions && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Câu hỏi</h2>
            <div className="space-y-4">
              {exercise.questions.map((q: any, index: number) => (
                <div key={index} className="border rounded-lg p-4 bg-white shadow-sm">
                  <p className="font-medium mb-2">{q.question}</p>
                  <div className="mt-4">
                    <button
                      onClick={() => toggleCard(index)}
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                    >
                      {flipped[index] ? 'Ẩn đáp án' : 'Xem đáp án'}
                    </button>
                    {flipped[index] && (
                      <div className="mt-2 p-2 bg-green-50 rounded">
                        <p className="text-green-800">{q.answer}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Nội dung bài tập - Kanji */}
        {exercise.kanjis && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Kanji</h2>
            <div className="space-y-4">
              {exercise.kanjis.map((kanji: any, index: number) => (
                <div key={index} className="border rounded-lg p-4 bg-white shadow-sm">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="text-7xl font-bold text-center text-gray-800 md:w-1/4">
                      {kanji.kanji}
                    </div>
                    <div className="md:w-3/4">
                      <p><span className="font-medium">Ý nghĩa:</span> {kanji.meaning}</p>
                      <p><span className="font-medium">Âm On:</span> {kanji.onyomi}</p>
                      <p><span className="font-medium">Âm Kun:</span> {kanji.kunyomi}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {completed ? (
          <div className="mt-8">
            <div className="bg-green-50 border border-green-200 text-green-800 rounded-md p-4 mb-6">
              <h3 className="font-semibold mb-2">Kết quả:</h3>
              <p>Điểm số: <span className="font-bold">{score}/100</span></p>
              <p>Thời gian: <span className="font-bold">{timeSpent} phút</span></p>
            </div>
            <StudyProgressButton 
              category={exercise.category}
              topic={exercise.title}
              score={score}
              timeSpent={timeSpent}
              level={exercise.level}
              buttonText="Lưu kết quả học tập"
            />
          </div>
        ) : (
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleComplete}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              Hoàn thành bài tập
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 