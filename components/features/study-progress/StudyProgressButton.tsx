'use client';

import { useState } from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import Link from 'next/link';
import { saveStudyProgress } from '@/lib/study-progress';

interface StudyProgressButtonProps {
  category: string;
  topic: string;
  score?: number;
  timeSpent?: number;
  level?: string;
  buttonText?: string;
  buttonStyle?: string;
  onComplete?: () => void;
}

export default function StudyProgressButton({
  category,
  topic,
  score,
  timeSpent,
  level,
  buttonText = 'Hoàn thành bài học',
  buttonStyle = 'bg-indigo-600 hover:bg-indigo-700',
  onComplete
}: StudyProgressButtonProps) {
  const { session } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const handleSaveProgress = async () => {
    if (!session?.user?.id) {
      setError('Bạn cần đăng nhập để lưu tiến độ học tập');
      return;
    }

    try {
      setSaving(true);
      setError('');

      const success = await saveStudyProgress({
        userId: session.user.id,
        category,
        topic,
        score,
        timeSpent,
        level
      });

      if (success) {
        setSaved(true);
        if (onComplete) {
          onComplete();
        }
      } else {
        setError('Có lỗi xảy ra khi lưu tiến độ học tập');
      }
    } catch (err) {
      console.error('Lỗi khi lưu tiến độ:', err);
      setError('Có lỗi xảy ra khi lưu tiến độ học tập');
    } finally {
      setSaving(false);
    }
  };

  if (!session?.user) {
    return (
      <div className="mt-6">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-md p-4 mb-4">
          <p>Bạn cần đăng nhập để lưu tiến độ học tập.</p>
        </div>
        <Link 
          href="/auth/signin"
          className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          Đăng nhập để lưu tiến độ
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-4">
          <p>{error}</p>
        </div>
      )}

      {saved ? (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-md p-4 mb-4">
          <p>Tiến độ học tập đã được lưu thành công!</p>
          <div className="mt-3">
            <Link 
              href="/profile"
              className="text-green-700 font-medium hover:underline"
            >
              Xem tiến độ học tập của bạn →
            </Link>
          </div>
        </div>
      ) : (
        <button
          onClick={handleSaveProgress}
          disabled={saving}
          className={`${buttonStyle} text-white px-6 py-3 rounded-lg font-medium transition-colors w-full md:w-auto ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {saving ? 'Đang lưu...' : buttonText}
        </button>
      )}
    </div>
  );
} 