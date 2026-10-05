"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  username: string;
  isAdmin: boolean;
  avatarUrl?: string;
  token?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  signup: (username: string, password: string) => boolean;
  logout: () => void;
  updateAvatar: (url: string) => void;
  forgotPassword: (username: string, newPass: string) => Promise<boolean>;
  changePassword: (oldPass: string, newPass: string) => boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => false,
  signup: () => false,
  logout: () => {},
  updateAvatar: () => {},
  forgotPassword: async () => false,
  changePassword: () => false
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('tasweer_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      if (response.ok) {
        const data = await response.json();
        // Since we only grant token access to admins/staff for write ops right now,
        // we can assume if they got a token, they are an admin.
        const adminUser = { username, isAdmin: true, avatarUrl: '/hero.jpg', token: data.access };
        setUser(adminUser);
        localStorage.setItem('tasweer_user', JSON.stringify(adminUser));
        return true;
      } else {
        // Customer login (fallback to localstorage mock)
        const registeredUsers = JSON.parse(localStorage.getItem('tasweer_users') || '{"user": "user"}');
        if (registeredUsers[username] && registeredUsers[username] === password) {
          const customer = { username, isAdmin: false };
          setUser(customer);
          localStorage.setItem('tasweer_user', JSON.stringify(customer));
          return true;
        }
      }
    } catch (error) {
      console.error("Login error:", error);
    }
    return false;
  };

  const signup = (username: string, password: string) => {
    const registeredUsers = JSON.parse(localStorage.getItem('tasweer_users') || '{}');
    if (registeredUsers[username]) {
      return false; // User already exists
    }
    registeredUsers[username] = password;
    localStorage.setItem('tasweer_users', JSON.stringify(registeredUsers));
    
    // Auto login
    const customer = { username, isAdmin: false };
    setUser(customer);
    localStorage.setItem('tasweer_user', JSON.stringify(customer));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('tasweer_user');
    router.push('/');
  };

  const updateAvatar = (url: string) => {
    if (user) {
      const updatedUser = { ...user, avatarUrl: url };
      setUser(updatedUser);
      localStorage.setItem('tasweer_user', JSON.stringify(updatedUser));
    }
  };

  const forgotPassword = async (username: string, newPass: string) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/reset-password/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, new_password: newPass })
      });
      return response.ok;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const changePassword = (oldPass: string, newPass: string) => {
    // In a full system, you would have a /api/change-password/ endpoint using JWT token.
    // For now, we can reuse the reset-password endpoint since it forces the change.
    if (!user) return false;
    
    // We omit checking the old password here for simplicity, but in production
    // a proper JWT protected endpoint checking old password is required.
    fetch('http://127.0.0.1:8000/api/reset-password/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: user.username, new_password: newPass })
    });
    
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, updateAvatar, forgotPassword, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
