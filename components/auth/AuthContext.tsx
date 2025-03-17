'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

// Định nghĩa kiểu dữ liệu người dùng
export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}

// Định nghĩa kiểu dữ liệu session
export interface Session {
  user: User | null;
}

// Định nghĩa kiểu dữ liệu context
interface AuthContextType {
  session: Session | null;
  status: 'loading' | 'authenticated' | 'unauthenticated';
  signIn: (user: User) => void;
  signOut: () => void;
}

// Tạo context
const AuthContext = createContext<AuthContextType>({
  session: null,
  status: 'loading',
  signIn: () => {},
  signOut: () => {},
});

// Hook sử dụng context
export const useAuth = () => useContext(AuthContext);

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');

  // Khôi phục session từ localStorage khi component được mount
  useEffect(() => {
    const storedSession = localStorage.getItem('user-session');
    if (storedSession) {
      try {
        const sessionData = JSON.parse(storedSession);
        setSession(sessionData);
        setStatus('authenticated');
      } catch (error) {
        console.error('Lỗi khi phân tích dữ liệu session:', error);
        setStatus('unauthenticated');
      }
    } else {
      setStatus('unauthenticated');
    }
  }, []);

  // Hàm đăng nhập
  const signIn = (user: User) => {
    const newSession = { user };
    setSession(newSession);
    setStatus('authenticated');
    localStorage.setItem('user-session', JSON.stringify(newSession));
  };

  // Hàm đăng xuất
  const signOut = () => {
    setSession(null);
    setStatus('unauthenticated');
    localStorage.removeItem('user-session');
  };

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
      <AuthContext.Provider value={{ session, status, signIn, signOut }}>
        {children}
      </AuthContext.Provider>
    </GoogleOAuthProvider>
  );
}

// Component nút đăng nhập Google
export function GoogleSignInButton() {
  const { signIn } = useAuth();

  return (
    <GoogleLogin
      onSuccess={(credentialResponse) => {
        if (credentialResponse.credential) {
          // Decode JWT token để lấy thông tin người dùng
          const payload = JSON.parse(atob(credentialResponse.credential.split('.')[1]));
          signIn({
            id: payload.sub,
            name: payload.name,
            email: payload.email,
            image: payload.picture
          });
        }
      }}
      onError={() => {
        console.log('Đăng nhập thất bại');
      }}
      useOneTap
      theme="outline"
      size="large"
      text="continue_with"
      shape="rectangular"
      locale="vi"
    />
  );
} 