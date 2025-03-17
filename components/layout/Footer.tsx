import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Học Tiếng Nhật</h3>
            <p className="text-gray-300 mb-4">
              Nền tảng học tiếng Nhật thông minh với công nghệ AI, giúp bạn tiến bộ nhanh hơn và hiệu quả hơn.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/lessons" className="text-gray-300 hover:text-white transition-colors">
                  Bài học
                </Link>
              </li>
              <li>
                <Link href="/practice" className="text-gray-300 hover:text-white transition-colors">
                  Luyện tập
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-gray-300 hover:text-white transition-colors">
                  Hồ sơ cá nhân
                </Link>
              </li>
              <li>
                <Link href="/kanji" className="text-gray-300 hover:text-white transition-colors">
                  Luyện Kanji
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Về chúng tôi</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors">
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-white transition-colors">
                  Điều khoản sử dụng
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p>© {new Date().getFullYear()} Học Tiếng Nhật. Đã đăng ký bản quyền.</p>
          <p className="text-gray-400 text-sm mt-2">
            Dữ liệu người dùng được lưu trữ an toàn trên Google Sheets.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 