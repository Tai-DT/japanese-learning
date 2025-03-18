'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import StudyProgressButton from '@/components/features/study-progress/StudyProgressButton';

// Dữ liệu mẫu cho bài học - trong ứng dụng thực, có thể lấy từ API hoặc cơ sở dữ liệu
const lessonSample = {
  1: {
    id: 1,
    title: "あいさつ - Chào hỏi cơ bản",
    level: "N5",
    duration: "15 phút",
    category: "Giao tiếp",
    sections: [
      {
        title: "Giới thiệu",
        content: "Chào hỏi là một phần quan trọng trong giao tiếp hàng ngày. Trong tiếng Nhật, cách chào hỏi khác nhau tùy thuộc vào thời điểm trong ngày và mối quan hệ giữa người nói và người nghe."
      },
      {
        title: "Các cách chào hỏi",
        content: `
          <ul>
            <li><strong>おはようございます</strong> (Ohayou gozaimasu) - Chào buổi sáng (trang trọng)</li>
            <li><strong>おはよう</strong> (Ohayou) - Chào buổi sáng (thân mật)</li>
            <li><strong>こんにちは</strong> (Konnichiwa) - Xin chào (buổi trưa, buổi chiều)</li>
            <li><strong>こんばんは</strong> (Konbanwa) - Chào buổi tối</li>
            <li><strong>さようなら</strong> (Sayounara) - Tạm biệt</li>
            <li><strong>おやすみなさい</strong> (Oyasuminasai) - Chúc ngủ ngon</li>
          </ul>
        `
      },
      {
        title: "Hội thoại mẫu",
        content: `
          <p><strong>A:</strong> おはようございます。</p>
          <p><strong>B:</strong> おはようございます。お元気ですか？</p>
          <p><strong>A:</strong> はい、元気です。あなたは？</p>
          <p><strong>B:</strong> 私も元気です。ありがとうございます。</p>
          <hr />
          <p><strong>A:</strong> Chào buổi sáng.</p>
          <p><strong>B:</strong> Chào buổi sáng. Bạn khỏe không?</p>
          <p><strong>A:</strong> Vâng, tôi khỏe. Còn bạn?</p>
          <p><strong>B:</strong> Tôi cũng khỏe. Cảm ơn bạn.</p>
        `
      },
      {
        title: "Lưu ý",
        content: "Khi chào hỏi trong tiếng Nhật, bạn nên cúi đầu nhẹ để thể hiện sự tôn trọng. Mức độ cúi đầu sẽ khác nhau tùy thuộc vào người bạn đang giao tiếp."
      }
    ],
  },
  2: {
    id: 2,
    title: "自己紹介 - Tự giới thiệu",
    level: "N5",
    duration: "20 phút",
    category: "Giao tiếp",
    sections: [
      {
        title: "Giới thiệu",
        content: "Tự giới thiệu là kỹ năng cơ bản khi học một ngôn ngữ mới. Bài học này sẽ giúp bạn biết cách tự giới thiệu bản thân trong tiếng Nhật."
      },
      {
        title: "Cấu trúc tự giới thiệu",
        content: `
          <p>Khi tự giới thiệu, bạn có thể sử dụng cấu trúc sau:</p>
          <ul>
            <li><strong>はじめまして</strong> (Hajimemashite) - Rất vui được gặp bạn</li>
            <li><strong>私は [tên của bạn] です</strong> (Watashi wa [tên] desu) - Tôi là [tên]</li>
            <li><strong>よろしくおねがいします</strong> (Yoroshiku onegaishimasu) - Rất mong được làm quen</li>
          </ul>
        `
      },
      {
        title: "Ví dụ tự giới thiệu đầy đủ",
        content: `
          <p><strong>はじめまして。私はタンです。ベトナムから来ました。二十五歳です。学生です。よろしくおねがいします。</strong></p>
          <p>Hajimemashite. Watashi wa Tan desu. Betonamu kara kimashita. Nijuu-go sai desu. Gakusei desu. Yoroshiku onegaishimasu.</p>
          <p><em>Rất vui được gặp bạn. Tôi là Tân. Tôi đến từ Việt Nam. Tôi 25 tuổi. Tôi là sinh viên. Rất mong được làm quen.</em></p>
        `
      },
      {
        title: "Các câu hỏi thường gặp",
        content: `
          <ul>
            <li><strong>お名前は何ですか</strong> (Onamae wa nan desu ka) - Tên bạn là gì?</li>
            <li><strong>どこから来ましたか</strong> (Doko kara kimashita ka) - Bạn đến từ đâu?</li>
            <li><strong>お仕事は何ですか</strong> (Oshigoto wa nan desu ka) - Công việc của bạn là gì?</li>
          </ul>
        `
      }
    ],
  },
  3: {
    id: 3,
    title: "て形 - Thể て và cách sử dụng",
    level: "N5",
    duration: "25 phút",
    category: "Ngữ pháp",
    sections: [
      {
        title: "Giới thiệu về thể て",
        content: "Thể て (te-form) là một dạng của động từ trong tiếng Nhật, được sử dụng rất rộng rãi trong nhiều cấu trúc ngữ pháp khác nhau. Bài học này sẽ giúp bạn hiểu cách biến đổi động từ sang thể て và các cách sử dụng cơ bản."
      },
      {
        title: "Cách biến đổi động từ sang thể て",
        content: `
          <h4>Động từ nhóm 1 (U-Verbs):</h4>
          <ul>
            <li><strong>~う、~つ、~る</strong>: Đổi thành <strong>~って</strong></li>
            <li>買う (kau - mua) → 買って (katte)</li>
            <li>待つ (matsu - đợi) → 待って (matte)</li>
            <li>売る (uru - bán) → 売って (utte)</li>
            
            <li><strong>~む、~ぶ、~ぬ</strong>: Đổi thành <strong>~んで</strong></li>
            <li>飲む (nomu - uống) → 飲んで (nonde)</li>
            <li>遊ぶ (asobu - chơi) → 遊んで (asonde)</li>
            
            <li><strong>~く</strong>: Đổi thành <strong>~いて</strong></li>
            <li>書く (kaku - viết) → 書いて (kaite)</li>
            
            <li><strong>~ぐ</strong>: Đổi thành <strong>~いで</strong></li>
            <li>泳ぐ (oyogu - bơi) → 泳いで (oyoide)</li>
            
            <li><strong>~す</strong>: Đổi thành <strong>~して</strong></li>
            <li>話す (hanasu - nói) → 話して (hanashite)</li>
          </ul>
          
          <h4>Động từ nhóm 2 (Ru-Verbs):</h4>
          <ul>
            <li>Bỏ ~る và thêm ~て</li>
            <li>食べる (taberu - ăn) → 食べて (tabete)</li>
            <li>見る (miru - xem) → 見て (mite)</li>
          </ul>
          
          <h4>Động từ không quy tắc:</h4>
          <ul>
            <li>する (suru - làm) → して (shite)</li>
            <li>来る (kuru - đến) → 来て (kite)</li>
          </ul>
        `
      },
      {
        title: "Cách sử dụng thể て",
        content: `
          <h4>1. Nối các hành động liên tiếp</h4>
          <p>食べて、寝ます。(Tabete, nemasu) - Tôi ăn rồi đi ngủ.</p>
          
          <h4>2. Yêu cầu ai đó làm gì</h4>
          <p>ここに名前を書いてください。(Koko ni namae o kaite kudasai) - Hãy viết tên của bạn ở đây.</p>
          
          <h4>3. Cho phép với ~てもいい</h4>
          <p>ここで写真を撮ってもいいですか。(Koko de shashin o totte mo ii desu ka) - Tôi có thể chụp ảnh ở đây không?</p>
          
          <h4>4. Cấm đoán với ~てはいけない</h4>
          <p>ここで食べてはいけません。(Koko de tabete wa ikemasen) - Không được ăn ở đây.</p>
          
          <h4>5. Diễn tả trạng thái liên tục với ~ている</h4>
          <p>彼は今、本を読んでいます。(Kare wa ima, hon o yonde imasu) - Anh ấy đang đọc sách.</p>
        `
      }
    ],
  }
};

interface Section {
  title: string;
  content: string;
}

export default function LessonDetail() {
  const router = useRouter();
  const params = useParams();
  const [lesson, setLesson] = useState<typeof lessonSample[keyof typeof lessonSample] | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    // Khởi động đồng hồ tính giờ
    setStartTime(Date.now());
    
    // Lấy thông tin bài học từ id
    const id = params?.id ? parseInt(params.id as string, 10) : 0;
    
    if (id && lessonSample[id as keyof typeof lessonSample]) {
      setLesson(lessonSample[id as keyof typeof lessonSample]);
      setLoading(false);
    } else {
      // Xử lý trường hợp không tìm thấy bài học
      router.push('/lessons');
    }

    // Cleanup khi component unmount
    return () => {
      if (startTime > 0) {
        const endTime = Date.now();
        const minutesSpent = Math.round((endTime - startTime) / 60000);
        setTimeSpent(minutesSpent);
      }
    };
  }, [params, router, startTime]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (startTime) {
        setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  const handleComplete = () => {
    // Tính toán thời gian đã dành
    const endTime = Date.now();
    const minutesSpent = Math.round((endTime - startTime) / 60000);
    setTimeSpent(minutesSpent);
    setCompleted(true);
  };

  const handleSectionChange = (index: number) => {
    setSelectedSection(index);
  };

  const nextSection = () => {
    if (lesson && selectedSection < lesson.sections.length - 1) {
      setSelectedSection(selectedSection + 1);
    } else {
      handleComplete();
    }
  };

  const prevSection = () => {
    if (selectedSection > 0) {
      setSelectedSection(selectedSection - 1);
    }
  };

  if (loading || !lesson) {
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
        <Link href="/lessons" className="text-indigo-600 hover:text-indigo-800">
          ← Quay lại danh sách bài học
        </Link>
      </div>

      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold">{lesson.title}</h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-1 rounded">
                {lesson.category}
              </span>
              <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-1 rounded">
                {lesson.level}
              </span>
              <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-1 rounded">
                {lesson.duration}
              </span>
            </div>
          </div>
          <div>
            {completed ? (
              <StudyProgressButton
                lessonId={lesson.id}
                timeSpent={timeSpent}
                completed={true}
              />
            ) : (
              <span className="text-sm text-gray-500">
                Thời gian: {Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}
              </span>
            )}
          </div>
        </div>

        <div className="mb-6 border-b pb-4">
          <div className="flex space-x-4 mb-2 overflow-x-auto">
            {lesson.sections.map((section: Section, index: number) => (
              <button
                key={index}
                onClick={() => handleSectionChange(index)}
                className={`px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap ${
                  selectedSection === index 
                    ? 'bg-indigo-100 text-indigo-800' 
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                {index + 1}. {section.title}
              </button>
            ))}
          </div>
        </div>

        <div className="prose prose-indigo max-w-none">
          <h2 className="text-xl font-semibold mb-4">{lesson.sections[selectedSection].title}</h2>
          <div dangerouslySetInnerHTML={{ __html: lesson.sections[selectedSection].content }}></div>
        </div>

        <div className="mt-8 flex justify-between">
          <button
            onClick={prevSection}
            disabled={selectedSection === 0}
            className={`px-4 py-2 rounded-md ${
              selectedSection === 0 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            ← Phần trước
          </button>
          
          {selectedSection < lesson.sections.length - 1 ? (
            <button
              onClick={nextSection}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Phần tiếp theo →
            </button>
          ) : (
            <StudyProgressButton
              lessonId={lesson.id}
              timeSpent={timeSpent}
              completed={completed}
              onComplete={handleComplete}
            />
          )}
        </div>
      </div>
    </div>
  );
} 