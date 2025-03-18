'use client';

import React from 'react';
import Link from 'next/link';

const Header: React.FC = () => {
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
                <li><Link href="/profile" className="text-gray-600 hover:text-indigo-600 transition-colors">Hồ sơ</Link></li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 