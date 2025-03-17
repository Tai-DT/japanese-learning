'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

type StudyData = {
  date: string;
  category: string;
  topic: string;
  score?: number;
  timeSpent?: number; // in minutes
  level?: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userStudyData, setUserStudyData] = useState<StudyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'vocabulary' | 'grammar' | 'kanji' | 'reading'>('overview');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user?.id) {
        try {
          setLoading(true);
          // Gọi API để lấy dữ liệu học tập của người dùng từ Google Sheets
          const response = await fetch(`/api/user-data?userId=${session.user.id}`);
          
          if (response.ok) {
            const data = await response.json();
            setUserStudyData(data);
          } else {
            console.error('Failed to fetch user data');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, [session]);

  const getFilteredData = () => {
    if (activeTab === 'overview') {
      return userStudyData;
    }
    return userStudyData.filter(item => item.category.toLowerCase() === activeTab);
  };

  const calculateStats = () => {
    if (!userStudyData.length) return { totalTime: 0, totalSessions: 0, avgScore: 0 };
    
    const totalTime = userStudyData.reduce((sum, item) => sum + (item.timeSpent || 0), 0);
    const scoresWithData = userStudyData.filter(item => item.score !== undefined);
    const avgScore = scoresWithData.length 
      ? scoresWithData.reduce((sum, item) => sum + (item.score || 0), 0) / scoresWithData.length 
      : 0;
      
    return {
      totalTime,
      totalSessions: userStudyData.length,
      avgScore: Math.round(avgScore)
    };
  };

  const stats = calculateStats();
  const filteredData = getFilteredData();

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        <span className="ml-3 text-indigo-600">Đang tải...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {session?.user && (
        <>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {session.user.image && (
                <div className="relative h-24 w-24 rounded-full overflow-hidden">
                  <Image 
                    src={session.user.image} 
                    alt={session.user.name || 'User profile'} 
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              
              <div className="text-center md:text-left">
                <h1 className="text-2xl font-bold mb-1">{session.user.name}</h1>
                {session.user.email && (
                  <p className="text-gray-600 mb-3">{session.user.email}</p>
                )}
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <Link 
                    href="/profile/settings" 
                    className="text-sm px-3 py-1 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    Cài đặt
                  </Link>
                  <Link 
                    href="/auth/signout" 
                    className="text-sm px-3 py-1 bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-colors"
                  >
                    Đăng xuất
                  </Link>
                </div>
              </div>
              
              <div className="ml-auto flex-shrink-0 hidden md:block">
                <div className="bg-indigo-50 rounded-lg p-4 text-center">
                  <h3 className="text-lg font-semibold text-indigo-700">Cấp độ hiện tại</h3>
                  <p className="text-3xl font-bold text-indigo-600 my-2">N5</p>
                  <p className="text-xs text-indigo-500">Đang học...</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-5 text-center">
              <h3 className="text-gray-500 mb-1">Tổng thời gian học</h3>
              <p className="text-3xl font-bold">{stats.totalTime} phút</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-5 text-center">
              <h3 className="text-gray-500 mb-1">Bài học/bài tập đã hoàn thành</h3>
              <p className="text-3xl font-bold">{stats.totalSessions}</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-5 text-center">
              <h3 className="text-gray-500 mb-1">Điểm trung bình</h3>
              <p className="text-3xl font-bold">{stats.avgScore}%</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="border-b border-gray-200 mb-6">
              <nav className="flex space-x-4 overflow-x-auto pb-4">
                <button 
                  onClick={() => setActiveTab('overview')}
                  className={`px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap ${
                    activeTab === 'overview' 
                      ? 'bg-indigo-100 text-indigo-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Tổng quan
                </button>
                <button 
                  onClick={() => setActiveTab('vocabulary')}
                  className={`px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap ${
                    activeTab === 'vocabulary' 
                      ? 'bg-indigo-100 text-indigo-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Từ vựng
                </button>
                <button 
                  onClick={() => setActiveTab('grammar')}
                  className={`px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap ${
                    activeTab === 'grammar' 
                      ? 'bg-indigo-100 text-indigo-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Ngữ pháp
                </button>
                <button 
                  onClick={() => setActiveTab('kanji')}
                  className={`px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap ${
                    activeTab === 'kanji' 
                      ? 'bg-indigo-100 text-indigo-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Kanji
                </button>
                <button 
                  onClick={() => setActiveTab('reading')}
                  className={`px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap ${
                    activeTab === 'reading' 
                      ? 'bg-indigo-100 text-indigo-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Đọc hiểu
                </button>
              </nav>
            </div>
            
            <h2 className="text-xl font-semibold mb-4">
              {activeTab === 'overview' ? 'Lịch sử học tập' : `Lịch sử học ${activeTab === 'vocabulary' ? 'từ vựng' : activeTab === 'grammar' ? 'ngữ pháp' : activeTab === 'kanji' ? 'kanji' : 'đọc hiểu'}`}
            </h2>
            
            {filteredData.length === 0 ? (
              <div className="text-center py-10 bg-gray-50 rounded-lg">
                <p className="text-gray-500">Chưa có dữ liệu học tập nào được ghi lại.</p>
                <Link 
                  href="/practice" 
                  className="mt-3 inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Bắt đầu luyện tập ngay
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phân loại</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chủ đề</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Điểm</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cấp độ</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredData.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{new Date(item.date).toLocaleDateString('vi-VN')}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{item.category}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{item.topic}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          {item.score !== undefined ? (
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              item.score >= 80 ? 'bg-green-100 text-green-800' :
                              item.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {item.score}%
                            </span>
                          ) : (
                            <span className="text-gray-500">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {item.timeSpent !== undefined ? `${item.timeSpent} phút` : '-'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          {item.level && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                              {item.level}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            <div className="mt-6 text-center">
              <Link 
                href="https://docs.google.com/spreadsheets/d/" 
                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                Xem dữ liệu đầy đủ trong Google Sheets →
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 