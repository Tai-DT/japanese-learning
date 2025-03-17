'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-red-600 mb-4">Lỗi xác thực</h2>
          <p className="text-gray-600">
            {error === 'Configuration' && 'Có lỗi trong cấu hình xác thực. Vui lòng thử lại sau.'}
            {error === 'AccessDenied' && 'Bạn không có quyền truy cập trang này.'}
            {error === 'Verification' && 'Liên kết xác thực không hợp lệ hoặc đã hết hạn.'}
            {!error && 'Đã xảy ra lỗi không xác định. Vui lòng thử lại.'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    }>
      <ErrorContent />
    </Suspense>
  );
} 