'use client';

import React from 'react';
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import Image from 'next/image';

const Header: React.FC = () => {
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';

  return (
    <header className="bg-white shadow-sm py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/" className="text-2xl font-bold text-indigo-700 hover:text-indigo-800 transition-colors">
              Học Tiếng Nhật
            </Link>
            
            <nav className="mt-2">
              <ul className="flex flex-wrap space-x-4">
                <li><Link href="/" className="text-gray-600 hover:text-indigo-600 transition-colors">Trang chủ</Link></li>
                <li><Link href="/lessons" className="text-gray-600 hover:text-indigo-600 transition-colors">Bài học</Link></li>
                <li><Link href="/practice" className="text-gray-600 hover:text-indigo-600 transition-colors">Luyện tập</Link></li>
                <li><Link href="/kanji" className="text-gray-600 hover:text-indigo-600 transition-colors">Kanji</Link></li>
                <li><Link href="/grammar" className="text-gray-600 hover:text-indigo-600 transition-colors">Ngữ pháp</Link></li>
              </ul>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            {isLoading ? (
              <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
            ) : session ? (
              <div className="flex items-center space-x-2 relative group">
                <div className="flex items-center cursor-pointer rounded-full hover:bg-gray-100 p-1">
                  {session.user?.image ? (
                    <div className="h-8 w-8 relative">
                      <Image 
                        src={session.user.image} 
                        alt={session.user.name || "Người dùng"} 
                        className="rounded-full"
                        fill
                      />
                    </div>
                  ) : (
                    <div className="h-8 w-8 bg-indigo-200 rounded-full flex items-center justify-center text-indigo-700">
                      {session.user?.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}
                  <span className="ml-2 max-w-[150px] truncate hidden sm:inline-block">
                    {session.user?.name}
                  </span>
                </div>
                
                <div className="absolute right-0 top-full mt-1 w-48 bg-white shadow-lg rounded-md py-1 z-10 invisible group-hover:visible">
                  <Link 
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Hồ sơ
                  </Link>
                  <Link 
                    href="/profile/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Cài đặt
                  </Link>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Đăng xuất
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => signIn('google')}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
              >
                Đăng nhập
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 