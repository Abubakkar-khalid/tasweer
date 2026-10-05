"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { signup } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (signup(email, password)) {
      router.push('/');
    } else {
      setError('An account with this email already exists.');
    }
  };
  return (
    <div className="bg-gray-50 min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
          Create a new account
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Or <Link href="/login" className="font-medium text-[#6B4C8A] hover:text-[#5a3e74]">sign in to your existing account</Link>
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
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full name
              </label>
              <div className="mt-1">
                <input id="name" name="name" type="text" autoComplete="name" required value={name} onChange={(e) => setName(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-[#6B4C8A] focus:border-[#6B4C8A] sm:text-sm" />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-[#6B4C8A] focus:border-[#6B4C8A] sm:text-sm" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input id="password" name="password" type="password" autoComplete="new-password" required value={password} onChange={(e) => setPassword(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-[#6B4C8A] focus:border-[#6B4C8A] sm:text-sm" />
              </div>
            </div>

            <div>
              <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#6B4C8A] hover:bg-[#5a3e74] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6B4C8A]">
                Sign up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
