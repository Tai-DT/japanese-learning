'use client';

import { signIn, useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function SignIn() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Nếu người dùng đã đăng nhập, chuyển hướng về trang chủ
    if (session) {
      router.push('/');
    }
  }, [session, router]);

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
          <div className="rounded-md shadow-sm space-y-4">
            <button
              onClick={() => signIn('google', { callbackUrl: '/' })}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                </svg>
              </span>
              Đăng nhập với Google
            </button>
            
            <div className="text-center">
              <Link href="/" className="font-medium text-indigo-600 hover:text-indigo-500">
                Quay lại trang chủ
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-10 pt-6 border-t border-gray-200">
          <div className="text-center text-sm text-gray-600">
            <p>Bằng việc đăng nhập, bạn đồng ý cho phép ứng dụng lưu trữ tiến trình học tập của bạn trên Google Sheets.</p>
            <p className="mt-2">
              Bạn sẽ có thể truy cập và xem lại dữ liệu của mình bất cứ khi nào.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 