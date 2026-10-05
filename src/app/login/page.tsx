"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { login, forgotPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { success, isAdmin } = await login(email, password);
    if (success) {
      if (isAdmin) {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } else {
      setError('Invalid email/username or password. For admin, use admin / admin');
    }
  };
  return (
    <div className="bg-gray-50 min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Or <Link href="/signup" className="font-medium text-[#6B4C8A] hover:text-[#5a3e74]">create a new account</Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded">
              {error}
            </div>
          )}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input id="email" name="email" type="text" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-[#6B4C8A] focus:border-[#6B4C8A] sm:text-sm" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input id="password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-[#6B4C8A] focus:border-[#6B4C8A] sm:text-sm pr-10" />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-[#6B4C8A] focus:ring-[#6B4C8A] border-gray-300 rounded" />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <button 
                  type="button" 
                  onClick={async () => {
                    if (!email) {
                      setError('Please enter your email/username first.');
                      return;
                    }
                    const newPass = window.prompt("Enter a new password for your account:");
                    if (newPass) {
                      const success = await forgotPassword(email, newPass);
                      if (success) {
                        alert("Your password has been successfully reset in the database! You can now log in.");
                      } else {
                        setError('User not found or database error.');
                      }
                    }
                  }}
                  className="font-medium text-[#6B4C8A] hover:text-[#5a3e74]"
                >
                  Forgot your password?
                </button>
              </div>
            </div>

            <div>
              <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#6B4C8A] hover:bg-[#5a3e74] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6B4C8A]">
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
