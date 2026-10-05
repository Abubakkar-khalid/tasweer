"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ShoppingBag, User, Search, LogOut, Camera, Package, Edit, Lock } from 'lucide-react';
import { useCart } from '@/components/CartContext';
import { useAuth } from '@/components/AuthContext';
import { useState, useRef, useEffect } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/signup';
  const isAdminPage = pathname?.startsWith('/admin');
  const { totalItems, totalPrice } = useCart();
  const { user, logout, updateAvatar, changePassword } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ oldPass: '', newPass: '' });
  const [passwordError, setPasswordError] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      updateAvatar(url);
    }
    setShowDropdown(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="w-full">
      {/* Top Banner */}
      {/* <div className="bg-[#6B4C8A] text-white text-xs font-medium text-center py-2 px-4">
        FREE SHIPPING ALL OVER PAKISTAN ON ORDERS ABOVE RS. 3000
      </div>
       */}
      {/* Main Navbar */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 gap-4 sm:gap-8">
            
            {/* Left Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link href={user?.isAdmin ? "/admin" : "/"} className="flex flex-col items-center">
                <div className="relative w-[130px] sm:w-[150px] h-[40px] sm:h-[50px]">
                  <Image src="/tasweer-logo.avif" alt="Tasweer Logo" fill className="object-contain" />
                </div>
              </Link>
            </div>

            {/* Center Stylish Search Bar */}
            {!isAuthPage && (
              <div className="flex-1 max-w-2xl hidden md:flex items-center">
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const query = formData.get('q');
                    if (query) {
                      window.location.href = `/search?q=${encodeURIComponent(query.toString())}`;
                    }
                  }}
                  className="relative w-full"
                >
                  <input 
                    type="text" 
                    name="q"
                    placeholder="Search for gifts, frames, mugs..." 
                    className="w-full bg-gray-50 text-black border border-gray-200 rounded-full py-2.5 pl-5 pr-12 text-sm focus:outline-none focus:border-[#6B4C8A] focus:ring-1 focus:ring-[#6B4C8A] transition-all"
                  />
                  <button type="submit" className="absolute right-1 top-1 bottom-1 bg-[#6B4C8A] text-white p-2 rounded-full hover:bg-[#5a3e74] transition-colors flex items-center justify-center">
                    <Search className="h-4 w-4" />
                  </button>
                </form>
              </div>
            )}

            {/* Right Icons */}
            <div className="flex-shrink-0 flex items-center justify-end space-x-4 sm:space-x-6">
              
              {!isAuthPage && (
                <Link href="/search" className="md:hidden text-gray-600 hover:text-[#6B4C8A] transition-colors">
                  <Search className="h-5 w-5" />
                </Link>
              )}
              
              {/* Sign In / Sign Up / Avatar */}
              {user && isAdminPage ? (
                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center space-x-2 focus:outline-none"
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-200">
                      <Image src={user.avatarUrl || '/hero.jpg'} alt="User Avatar" width={32} height={32} className="object-cover h-full w-full" />
                    </div>
                  </button>
                  
                  {/* Dropdown with animation */}
                  <div 
                    className={`absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-100 py-1 transition-all duration-200 origin-top-right z-50 ${
                      showDropdown ? 'transform scale-100 opacity-100' : 'transform scale-95 opacity-0 pointer-events-none'
                    }`}
                  >
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user.username}</p>
                      <p className="text-xs text-gray-500 capitalize">{user.isAdmin ? 'Administrator' : 'Customer'}</p>
                    </div>
                    {user.isAdmin && (
                      <>
                        <Link 
                          href="/admin"
                          onClick={() => setShowDropdown(false)}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                        >
                          <Edit className="h-4 w-4" />
                          Manage Products
                        </Link>
                        <Link 
                          href="/admin/orders"
                          onClick={() => setShowDropdown(false)}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                        >
                          <Package className="h-4 w-4" />
                          View Orders
                        </Link>
                        <button 
                          onClick={() => avatarInputRef.current?.click()}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                        >
                          <Camera className="h-4 w-4" />
                          Change Avatar
                        </button>
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          ref={avatarInputRef}
                          onChange={handleAvatarChange} 
                        />
                      </>
                    )}
                    <button 
                      onClick={() => {
                        setShowDropdown(false);
                        setShowPasswordModal(true);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                      <Lock className="h-4 w-4" />
                      Change Password
                    </button>
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        logout();
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </div>
              ) : user ? (
                <button 
                  onClick={logout}
                  className="text-gray-600 hover:text-red-600 transition-colors flex items-center space-x-1 group"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="hidden lg:block text-sm font-medium group-hover:text-red-600">
                    Logout
                  </span>
                </button>
              ) : (
                <Link 
                  href={pathname === '/signup' ? '/login' : '/signup'}
                  className="text-gray-600 hover:text-[#6B4C8A] transition-colors flex items-center space-x-1 group"
                >
                  <User className="h-5 w-5" />
                  <span className="hidden lg:block text-sm font-medium group-hover:text-[#6B4C8A]">
                    {pathname === '/signup' ? 'Sign In' : 'Sign Up'}
                  </span>
                </Link>
              )}
              
              {/* Cart */}
              {user && !isAuthPage && !isAdminPage && (
                <Link href="/cart" className="text-gray-600 hover:text-[#6B4C8A] transition-colors relative flex items-center space-x-1 group">
                  <ShoppingBag className="h-5 w-5" />
                  <span className="hidden sm:inline-block text-sm font-medium group-hover:text-[#6B4C8A]">My Cart</span>
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 sm:-top-2 sm:-right-3 flex h-4 w-4 items-center justify-center rounded-full bg-[#E33535] text-[10px] font-bold text-white">
                      {totalItems}
                    </span>
                  )}
                </Link>
              )}
            </div>
            
          </div>
          
          {/* Mobile Search Bar (shows below nav on small screens) */}
          {!isAuthPage && (
            <div className="pb-3 md:hidden">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const query = formData.get('q');
                  if (query) {
                    window.location.href = `/search?q=${encodeURIComponent(query.toString())}`;
                  }
                }}
                className="relative w-full"
              >
                <input 
                  type="text" 
                  name="q"
                  placeholder="Search..." 
                  className="w-full bg-gray-50 text-black border border-gray-200 rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:border-[#6B4C8A]"
                />
                <button type="submit" className="absolute right-3 top-2.5 text-gray-400">
                  <Search className="h-4 w-4" />
                </button>
              </form>
            </div>
          )}
          
        </div>
      </nav>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Change Password</h2>
            {passwordError && (
              <div className="mb-4 text-xs text-red-600 bg-red-50 p-2 rounded border border-red-100">
                {passwordError}
              </div>
            )}
            <form onSubmit={(e) => {
              e.preventDefault();
              const success = changePassword(passwordForm.oldPass, passwordForm.newPass);
              if (success) {
                setShowPasswordModal(false);
                setPasswordForm({ oldPass: '', newPass: '' });
                setPasswordError('');
                alert('Password changed successfully!');
              } else {
                setPasswordError('Incorrect old password.');
              }
            }}>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1">Old Password</label>
                  <input 
                    type="password" 
                    required 
                    value={passwordForm.oldPass}
                    onChange={e => setPasswordForm({...passwordForm, oldPass: e.target.value})}
                    className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-[#6B4C8A] focus:border-[#6B4C8A]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1">New Password</label>
                  <input 
                    type="password" 
                    required 
                    value={passwordForm.newPass}
                    onChange={e => setPasswordForm({...passwordForm, newPass: e.target.value})}
                    className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-[#6B4C8A] focus:border-[#6B4C8A]"
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <button 
                  type="button" 
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 text-sm font-bold text-white bg-[#6B4C8A] hover:bg-[#5a3e74] rounded transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}


