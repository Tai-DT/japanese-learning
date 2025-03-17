'use client';

import { useAuth } from '@/components/auth/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { GoogleSignInButton } from '@/components/auth/AuthContext';

export default function SignIn() {
  const { session } = useAuth();
  const router = useRouter();

  // Nếu người dùng đã đăng nhập, chuyển hướng về trang chủ
  if (session?.user) {
    router.push('/');
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/">
            <Image 
              className="mx-auto h-24 w-auto" 
              src="/favicon.ico"
              alt="Logo" 
              width={96}
              height={96}
            />
          </Link>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Đăng nhập vào tài khoản
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Đăng nhập để lưu tiến trình học và truy cập dữ liệu của bạn
          </p>
        </div>
        
        <div className="mt-8 space-y-6">
          <div className="flex justify-center">
            <GoogleSignInButton />
          </div>
            
          <div className="text-center">
            <Link href="/" className="font-medium text-indigo-600 hover:text-indigo-500">
              Quay lại trang chủ
            </Link>
          </div>
        </div>
        
        <div className="mt-10 pt-6 border-t border-gray-200">
          <div className="text-center text-sm text-gray-600">
            <p>Dữ liệu đăng nhập được lưu trong localStorage.</p>
            <p className="mt-2">
              Chúng tôi chỉ sử dụng thông tin cơ bản từ tài khoản Google của bạn.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 