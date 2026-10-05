"use client";

import { useState } from 'react';
import { useCart } from '@/components/CartContext';
import { useAuth } from '@/components/AuthContext';
import { useRouter } from 'next/navigation';

interface AddToCartFormProps {
  product: {
    id: string;
    name: string;
    price: number;
    images: string[];
  };
}

export default function AddToCartForm({ product }: AddToCartFormProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const handleAddToCart = () => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      imageUrl: product.images[0],
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="border-t border-gray-200 pt-8 mb-8">
      <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
        Quantity
      </label>
      <div className="flex items-center space-x-4">
        <input 
          type="number" 
          id="quantity" 
          name="quantity" 
          min="1" 
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
          className="w-20 rounded-md border-gray-300 shadow-sm focus:border-[#6B4C8A] focus:ring-[#6B4C8A] sm:text-sm p-2 border text-black bg-white"
        />
        <button 
          onClick={handleAddToCart}
          className={`flex-1 text-white py-3 px-8 rounded-md font-bold transition-colors shadow-lg ${
            added ? 'bg-green-600 hover:bg-green-700' : 'bg-[#6B4C8A] hover:bg-[#5a3e74]'
          }`}
        >
          {added ? 'ADDED TO CART!' : 'ADD TO CART'}
        </button>
      </div>
    </div>
  );
}
