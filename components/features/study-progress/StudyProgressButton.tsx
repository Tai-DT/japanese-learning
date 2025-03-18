'use client';

import { useState } from 'react';

interface StudyProgressButtonProps {
  lessonId?: number;
  exerciseId?: number;
  score?: number;
  timeSpent?: number;
  completed?: boolean;
  onComplete?: () => void;
}

// Thêm interface cho completed exercise
interface CompletedExercise {
  id: number;
  score: number;
  timeSpent: number;
  completedAt: string;
}

/**
 * Nút Hoàn thành/Lưu tiến độ học tập đơn giản không yêu cầu đăng nhập
 */
export default function StudyProgressButton({ 
  lessonId, 
  exerciseId, 
  score, 
  timeSpent,
  completed,
  onComplete 
}: StudyProgressButtonProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSaveProgress = () => {
    // Giả lập việc lưu tiến độ
    setIsSaving(true);
    
    setTimeout(() => {
      setIsSaving(false);
      setSaved(true);
      
      // Lưu vào localStorage
      if (lessonId) {
        const completedLessons = JSON.parse(localStorage.getItem('completed-lessons') || '[]');
        if (!completedLessons.includes(lessonId)) {
          completedLessons.push(lessonId);
          localStorage.setItem('completed-lessons', JSON.stringify(completedLessons));
        }
      }
      
      if (exerciseId) {
        const exerciseData: CompletedExercise = {
          id: exerciseId,
          score: score || 0,
          timeSpent: timeSpent || 0,
          completedAt: new Date().toISOString()
        };
        
        const completedExercises = JSON.parse(localStorage.getItem('completed-exercises') || '[]') as CompletedExercise[];
        const existingIndex = completedExercises.findIndex((item: CompletedExercise) => item.id === exerciseId);
        
        if (existingIndex >= 0) {
          completedExercises[existingIndex] = exerciseData;
        } else {
          completedExercises.push(exerciseData);
        }
        
        localStorage.setItem('completed-exercises', JSON.stringify(completedExercises));
      }
      
      // Gọi callback onComplete nếu có
      if (onComplete) {
        onComplete();
      }
    }, 1000);
  };

  if (saved) {
    return (
      <div className="bg-green-100 text-green-800 px-4 py-3 rounded-md flex items-center">
        <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <span>Tiến độ đã được lưu thành công!</span>
      </div>
    );
  }

  return (
    <button
      onClick={handleSaveProgress}
      disabled={isSaving || completed}
      className={`px-4 py-2 rounded-md ${
        completed
          ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
          : 'bg-indigo-600 text-white hover:bg-indigo-700'
      }`}
    >
      {isSaving ? (
        <>
          <span className="inline-block mr-2 h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
          Đang lưu...
        </>
      ) : completed ? (
        'Đã hoàn thành'
      ) : (
        'Hoàn thành & Lưu tiến độ'
      )}
    </button>
  );
} 