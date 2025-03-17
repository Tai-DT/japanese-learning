'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function AuthError() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const errorParam = searchParams.get('error');
    setError(errorParam);
  }, [searchParams]);

  const getErrorMessage = () => {
    switch (error) {
      case 'Signin':
        return 'Đã xảy ra lỗi khi cố gắng đăng nhập. Vui lòng thử lại sau.';
      case 'OAuthSignin':
        return 'Đã xảy ra lỗi khi khởi tạo đăng nhập OAuth. Vui lòng thử lại sau.';
      case 'OAuthCallback':
        return 'Đã xảy ra lỗi khi xử lý phản hồi từ nhà cung cấp OAuth.';
      case 'OAuthCreateAccount':
        return 'Không thể tạo tài khoản người dùng thông qua đăng nhập OAuth.';
      case 'EmailCreateAccount':
        return 'Không thể tạo tài khoản người dùng bằng email.';
      case 'Callback':
        return 'Đã xảy ra lỗi trong callback tạm thời. Vui lòng thử lại sau.';
      case 'OAuthAccountNotLinked':
        return 'Email này đã được sử dụng với một phương thức đăng nhập khác.';
      case 'SessionRequired':
        return 'Bạn cần đăng nhập để truy cập trang này.';
      default:
        return 'Đã xảy ra lỗi không xác định trong quá trình xác thực. Vui lòng thử lại sau.';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Lỗi Xác Thực
          </h2>
          <div className="mt-4 bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
            <p>{getErrorMessage()}</p>
          </div>
        </div>
        
        <div className="mt-4 space-y-4">
          <Link 
            href="/auth/signin"
            className="inline-block w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
          >
            Thử đăng nhập lại
          </Link>
          
          <Link 
            href="/"
            className="inline-block w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
          >
            Quay lại trang chủ
          </Link>
        </div>
        
        <div className="mt-6 text-sm text-gray-600">
          <p>Nếu vấn đề vẫn tiếp tục, vui lòng liên hệ quản trị viên hệ thống.</p>
        </div>
      </div>
    </div>
  );
} 