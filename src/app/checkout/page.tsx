"use client";

import { useState, useEffect } from 'react';
import { useCart } from '@/components/CartContext';
import { useAuth } from '@/components/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function CheckoutPage() {
  const { items, totalPrice } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    whatsappNumber: '',
    address: '',
    city: '',
  });
  const [isSuccess, setIsSuccess] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const orderData = {
        customer_name: `${formData.firstName} ${formData.lastName}`.trim(),
        customer_email: formData.email,
        customer_phone: formData.whatsappNumber,
        shipping_address: `${formData.address}, ${formData.city}`,
        total_amount: totalPrice + 250, // including shipping
        items: items.map(item => ({
          product_name: item.name,
          product_price: item.price,
          quantity: item.quantity,
          variation: item.selectedSize || ''
        }))
      };

      const res = await fetch('http://127.0.0.1:8000/api/orders/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (!res.ok) throw new Error('Failed to create order');
      
      setIsSuccess(true);
      // We could clear the cart here too if we exported a clearCart function from useCart
    } catch (error) {
      console.error(error);
      alert('Something went wrong while placing your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    // Only run on client
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('tasweer_user');
      if (!storedUser) {
        router.push('/login');
      }
    }
  }, [router]);

  if (!user && typeof window !== 'undefined' && !localStorage.getItem('tasweer_user')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6B4C8A]"></div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50 px-4 py-16">
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl max-w-lg w-full text-center border border-gray-100">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
          <p className="text-gray-600 mb-8">
            Thank you, {formData.firstName}! We've received your order. An email receipt has been sent to <span className="font-semibold text-gray-900">{formData.email}</span>, and we'll contact you on WhatsApp at <span className="font-semibold text-gray-900">{formData.whatsappNumber}</span> for tracking details.
          </p>
          <Link 
            href="/" 
            className="inline-block bg-gray-900 text-white font-bold py-3 px-8 rounded-md hover:bg-black transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row gap-12">
        
        {/* Left Side: Checkout Form */}
        <div className="w-full lg:w-2/3">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Information</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">First Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="w-full rounded-md border-gray-300 border p-3 text-gray-900 focus:ring-gray-900 focus:border-gray-900"
                    placeholder="Ali"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Last Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="w-full rounded-md border-gray-300 border p-3 text-gray-900 focus:ring-gray-900 focus:border-gray-900"
                    placeholder="Khan"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full rounded-md border-gray-300 border p-3 text-gray-900 focus:ring-gray-900 focus:border-gray-900"
                    placeholder="ali@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">WhatsApp Number</label>
                  <input 
                    type="tel" 
                    required
                    value={formData.whatsappNumber}
                    onChange={(e) => {
                      const onlyNums = e.target.value.replace(/[^0-9+]/g, '');
                      setFormData({...formData, whatsappNumber: onlyNums});
                    }}
                    className="w-full rounded-md border-gray-300 border p-3 text-gray-900 focus:ring-gray-900 focus:border-gray-900"
                    placeholder="0300 1234567"
                  />
                  <p className="text-[10px] text-gray-500 mt-1">For order confirmation and tracking.</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Delivery Address</label>
                <textarea 
                  required
                  rows={3}
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full rounded-md border-gray-300 border p-3 text-gray-900 focus:ring-gray-900 focus:border-gray-900 resize-none"
                  placeholder="House 123, Street 4, Phase 5..."
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">City</label>
                <input 
                  type="text" 
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="w-full rounded-md border-gray-300 border p-3 text-gray-900 focus:ring-gray-900 focus:border-gray-900"
                  placeholder="Lahore"
                />
              </div>

              <div className="pt-6 border-t border-gray-100">
                <button 
                  type="submit" 
                  disabled={items.length === 0 || isSubmitting}
                  className="w-full bg-gray-900 text-white py-4 rounded-md font-bold text-lg hover:bg-black transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Placing Order...
                    </>
                  ) : (
                    'Place Order (Cash on Delivery)'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Side: Order Summary */}
        <div className="w-full lg:w-1/3">
          <div className="bg-gray-100 p-8 rounded-xl sticky top-28 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>
            
            <ul className="space-y-4 mb-6">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4">
                  <div className="relative h-16 w-16 rounded bg-white border border-gray-200 flex-shrink-0">
                    <Image src={item.imageUrl} alt={item.name} fill className="object-contain p-1" />
                    <span className="absolute -top-2 -right-2 bg-gray-900 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-gray-900 line-clamp-2">{item.name}</h4>
                    <p className="text-sm font-medium text-gray-600 mt-1">Rs. {(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-gray-300 pt-4 space-y-3">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>Rs. {totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping</span>
                <span>Calculated at next step</span>
              </div>
              <div className="border-t border-gray-300 pt-3 flex justify-between items-end">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-black text-gray-900">Rs. {totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
