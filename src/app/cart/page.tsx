"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/components/CartContext';
import { useAuth } from '@/components/AuthContext';
import { Trash2 } from 'lucide-react';

export default function CartPage() {
  const { items, removeItem, totalItems, totalPrice } = useCart();
  const { user } = useAuth();

  if (items.length === 0) {
    return (
      <div className="bg-white min-h-[70vh] flex flex-col items-center justify-center py-16 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Cart is Empty</h1>
        <p className="text-gray-500 mb-8 max-w-md text-center">
          Looks like you haven't added anything to your cart yet. Discover our personalized gifts and add your favorites!
        </p>
        <Link href="/#shop" className="bg-[#6B4C8A] text-white px-8 py-3 rounded font-medium hover:bg-[#5a3e74] transition-colors">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
        
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {items.map((item) => (
              <li key={item.id} className="p-6 flex flex-col sm:flex-row items-center gap-6">
                <div className="relative h-24 w-24 rounded-md overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                  <Image src={item.imageUrl} alt={item.name} fill className="object-contain" />
                  
                  {item.customImage && item.customizationArea && (
                    <div 
                      className="absolute z-10 mix-blend-multiply opacity-90 flex items-center justify-center"
                      style={{
                        top: item.customizationArea.top,
                        left: item.customizationArea.left,
                        width: item.customizationArea.width,
                        height: item.customizationArea.height,
                        borderRadius: item.customizationArea.borderRadius || '0%',
                      }}
                    >
                      <div className="relative w-full h-full flex items-center justify-center">
                        <div style={{ transform: `scale(${item.customImageScale || 1})`, width: '100%', height: '100%', position: 'relative' }}>
                          <img 
                            src={item.customImage} 
                            alt="Custom design" 
                            className="w-full h-full object-contain" 
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between w-full">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        <Link href={`/product/item-${item.id}`} className="hover:text-[#6B4C8A] transition-colors">
                          {item.name}
                        </Link>
                      </h3>
                      {item.selectedSize && (
                        <p className="text-sm text-gray-500 mt-1 font-medium">Size: <span className="text-gray-900 font-bold">{item.selectedSize}</span></p>
                      )}
                      <p className="text-sm text-gray-500 mt-1">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">Rs. {(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-end">
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700 flex items-center text-sm font-medium transition-colors"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          
          <div className="bg-gray-50 p-6 sm:p-8 border-t border-gray-200">
            <div className="flex justify-between text-lg font-medium text-gray-900 mb-4">
              <p>Subtotal ({totalItems} items)</p>
              <p>Rs. {totalPrice.toFixed(2)}</p>
            </div>
            <p className="text-sm text-gray-500 mb-6">Shipping and taxes calculated at checkout.</p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/#shop" className="flex-1 flex justify-center items-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6B4C8A] transition-colors">
                Continue Shopping
              </Link>
              {user ? (
                <Link href="/checkout" className="flex-1 flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors">
                  Checkout
                </Link>
              ) : (
                <Link href="/login" className="flex-1 flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-500 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors">
                  Login to Checkout
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
