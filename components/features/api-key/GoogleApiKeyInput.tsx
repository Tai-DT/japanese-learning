"use client";

import { useState, useEffect } from "react";

export default function GoogleApiKeyInput() {
  const [userApiKey, setUserApiKey] = useState<string>('');
  const [useUserApiKey, setUseUserApiKey] = useState<boolean>(false);
  const [showApiKeyInput, setShowApiKeyInput] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Kiểm tra xem đã có API key được lưu trong localStorage chưa
  useEffect(() => {
    // Đảm bảo chỉ chạy ở phía client
    if (typeof window !== 'undefined') {
      try {
        const savedApiKey = localStorage.getItem('google_ai_api_key');
        if (savedApiKey) {
          setUserApiKey(savedApiKey);
          setUseUserApiKey(true);
        }
      } catch (e) {
        console.error("Lỗi khi đọc từ localStorage:", e);
      }
    }
  }, []);

  // Hàm lưu API key
  const saveApiKey = () => {
    if (userApiKey.trim()) {
      try {
        // Lưu API key vào localStorage
        localStorage.setItem('google_ai_api_key', userApiKey.trim());
        
        // Kích hoạt sự kiện storage để các component khác có thể phát hiện thay đổi
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'google_ai_api_key',
          newValue: userApiKey.trim(),
          storageArea: localStorage
        }));
        
        setUseUserApiKey(true);
        setError(null);
        setSuccess("API key đã được lưu thành công!");
        
        // Tự động ẩn thông báo thành công sau 3 giây
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      } catch (e) {
        console.error("Lỗi khi lưu vào localStorage:", e);
        setError("Không thể lưu API key. Vui lòng kiểm tra quyền truy cập localStorage.");
      }
    } else {
      setError("Vui lòng nhập API key hợp lệ");
      setSuccess(null);
    }
  };

  // Hàm xóa API key
  const clearApiKey = () => {
    try {
      localStorage.removeItem('google_ai_api_key');
      
      // Kích hoạt sự kiện storage để các component khác có thể phát hiện thay đổi
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'google_ai_api_key',
        newValue: null,
        oldValue: userApiKey,
        storageArea: localStorage
      }));
      
      setUserApiKey('');
      setUseUserApiKey(false);
      setSuccess("Đã xóa API key");
      
      // Tự động ẩn thông báo thành công sau 3 giây
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (e) {
      console.error("Lỗi khi xóa từ localStorage:", e);
      setError("Không thể xóa API key. Vui lòng kiểm tra quyền truy cập localStorage.");
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium">Cài đặt Google AI API Key</div>
        <button
          onClick={() => setShowApiKeyInput(!showApiKeyInput)}
          className="text-xs text-blue-600"
        >
          {showApiKeyInput ? "Ẩn" : "Hiện"}
        </button>
      </div>
      
      {showApiKeyInput && (
        <div className="space-y-2">
          <div className="text-xs text-gray-500 mb-1">
            API key này sẽ được sử dụng cho các tính năng AI như nhận dạng Kanji và trò chuyện.
            Bạn có thể lấy API key từ &quot;Google Cloud Console&quot;.
          </div>
          <div className="text-xs text-gray-500 mb-1">
            Lưu ý: API key của bạn sẽ được lưu cục bộ và chỉ được sử dụng trong trình duyệt của bạn.
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={userApiKey}
              onChange={(e) => setUserApiKey(e.target.value)}
              placeholder="Nhập Google AI API key của bạn"
              className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm"
            />
            <button
              onClick={saveApiKey}
              className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
              disabled={!userApiKey.trim()}
            >
              Lưu
            </button>
          </div>
          
          {useUserApiKey && userApiKey && (
            <div className="flex justify-between items-center">
              <div className="text-xs text-green-600">
                Đang sử dụng API key của bạn: {userApiKey.substring(0, 8)}...
              </div>
              <button
                onClick={clearApiKey}
                className="text-xs text-red-600 hover:underline"
              >
                Xóa
              </button>
            </div>
          )}
          
          {error && (
            <div className="text-xs text-red-600 bg-red-50 p-2 rounded border border-red-100">
              {error}
            </div>
          )}
          
          {success && (
            <div className="text-xs text-green-600 bg-green-50 p-2 rounded border border-green-100">
              {success}
            </div>
          )}
          
          <div className="text-xs space-y-1 pt-1 border-t border-gray-200 mt-2 pt-2">
            <div className="font-medium">Hướng dẫn lấy API key:</div>
            <ol className="list-decimal pl-5 text-gray-600">
              <li>Truy cập <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Google AI Studio</a></li>
              <li>Tạo tài khoản Google (nếu chưa có)</li>
              <li>Nhấn vào &quot;Get API key&quot; hoặc &quot;Create API key&quot;</li>
              <li>Làm theo hướng dẫn để tạo key mới</li>
              <li>Dán API key vào đây và nhấn &quot;Lưu&quot;</li>
            </ol>
            <p className="mt-1 text-gray-500">
              API key được lưu trong trình duyệt của bạn và không được gửi đến máy chủ của chúng tôi.
            </p>
          </div>
        </div>
      )}
    </div>
  );
} 