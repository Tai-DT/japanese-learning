/**
 * Hàm lưu tiến độ học tập của người dùng
 */
export async function saveStudyProgress({
  userId,
  category,
  topic,
  score,
  timeSpent,
  level
}: {
  userId: string;
  category: string;
  topic: string;
  score?: number;
  timeSpent?: number;
  level?: string;
}): Promise<boolean> {
  try {
    if (!userId) {
      console.error('Không thể lưu tiến độ: userId không được xác định');
      return false;
    }

    const response = await fetch('/api/user-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        date: new Date().toISOString(),
        category,
        topic,
        score,
        timeSpent,
        level
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Lỗi khi lưu tiến độ học tập:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Lỗi khi gửi yêu cầu lưu tiến độ học tập:', error);
    return false;
  }
}

/**
 * Hàm lấy tiến độ học tập của người dùng
 */
export async function getUserProgress(userId: string) {
  try {
    if (!userId) {
      console.error('Không thể lấy tiến độ: userId không được xác định');
      return null;
    }

    const response = await fetch(`/api/user-data?userId=${userId}`);
    
    if (!response.ok) {
      const error = await response.json();
      console.error('Lỗi khi lấy tiến độ học tập:', error);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Lỗi khi gửi yêu cầu lấy tiến độ học tập:', error);
    return null;
  }
}

// Định nghĩa interface cho dữ liệu tiến độ học tập
interface StudyProgressData {
  userId?: string;
  date?: string;
  category: string;
  topic: string;
  score?: number;
  timeSpent?: number;
  level?: string;
}

/**
 * Lấy thống kê học tập của người dùng
 */
export function getStudyStats(progressData: StudyProgressData[]) {
  if (!progressData || !progressData.length) {
    return {
      totalTime: 0,
      completedLessons: 0,
      avgScore: 0,
      categories: {}
    };
  }

  let totalTime = 0;
  let totalScore = 0;
  let scoresCount = 0;
  const categories: Record<string, number> = {};

  progressData.forEach(item => {
    // Tính tổng thời gian
    if (item.timeSpent) {
      totalTime += parseInt(item.timeSpent.toString(), 10);
    }

    // Tính điểm trung bình
    if (item.score !== undefined && item.score !== null) {
      totalScore += parseInt(item.score.toString(), 10);
      scoresCount++;
    }

    // Đếm số lượng theo từng danh mục
    if (item.category) {
      categories[item.category] = (categories[item.category] || 0) + 1;
    }
  });

  return {
    totalTime,
    completedLessons: progressData.length,
    avgScore: scoresCount > 0 ? Math.round(totalScore / scoresCount) : 0,
    categories
  };
} 