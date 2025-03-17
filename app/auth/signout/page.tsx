'use client';

import { useAuth } from '@/components/auth/AuthContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignOut() {
  const { session, signOut } = useAuth();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Nếu người dùng không đăng nhập, chuyển hướng về trang đăng nhập
  if (!session?.user && !isLoggingOut) {
    router.push('/auth/signin');
    return null;
  }

  const handleSignOut = () => {
    setIsLoggingOut(true);
    signOut();
    router.push('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Đăng xuất khỏi tài khoản
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Bạn có chắc chắn muốn đăng xuất?
          </p>
        </div>
        
        {session?.user?.name && (
          <div className="bg-white p-4 rounded-md shadow-sm">
            <p className="text-lg font-medium">Đang đăng nhập với tên:</p>
            <p className="text-xl text-indigo-600">{session.user.name}</p>
            {session.user.email && (
              <p className="text-gray-500 text-sm mt-1">{session.user.email}</p>
            )}
          </div>
        )}
        
        <div className="mt-8 space-y-4">
          <button
            onClick={handleSignOut}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            disabled={isLoggingOut}
          >
            {isLoggingOut ? 'Đang đăng xuất...' : 'Đăng xuất'}
          </button>
          
          <Link 
            href="/"
            className="inline-block w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
          >
            Hủy và quay lại trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
} 