"use client";

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/CartContext';
import { useAuth } from '@/components/AuthContext';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  images: string[];
  category: string;
  inStock: boolean;
  isCustomizable: boolean;
  isComingSoon?: boolean;
  sizes?: { name: string; inStock: boolean }[];
  customizationArea?: {
    top: string;
    left: string;
    width: string;
    height: string;
    borderRadius?: string;
  };
}

export default function ProductCustomizer({ product }: { product: Product }) {
  const [mainImage, setMainImage] = useState(product.images[0]);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [imageScale, setImageScale] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setCustomImage(e.target.result as string);
          setImageScale(1); // Reset scale on new upload
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddToCart = (redirect: boolean = false) => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      alert("Please select a size first.");
      return;
    }

    addItem({
      id: product.id + (selectedSize ? '-' + selectedSize : '') + (customImage ? '-custom' : ''),
      name: product.name + (customImage ? ' (Customized)' : ''),
      price: product.price,
      quantity: quantity,
      imageUrl: product.images[0],
      // sizes will be ignored by cart item, we just pass selectedSize string
      customImage: customImage,
      customImageScale: imageScale,
      selectedSize: selectedSize || undefined,
      customizationArea: product.customizationArea
    });
    
    if (redirect) {
      router.push('/cart');
    } else {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-12">
      
      {/* Product Image Gallery with Customization Overlay */}
      <div className="w-full md:w-1/2">
        <div className="w-full flex flex-col gap-4">
          <div className="relative aspect-square flex items-center justify-center p-4 sm:p-8">
            <Image 
              src={mainImage} 
              alt={product.name} 
              fill
              className="object-contain"
              priority
            />
            
            {/* Custom Image Overlay */}
            {customImage && product.isCustomizable && product.customizationArea && (
              <div 
                className="absolute z-10 mix-blend-multiply opacity-90 flex items-center justify-center"
                style={{
                  top: product.customizationArea.top,
                  left: product.customizationArea.left,
                  width: product.customizationArea.width,
                  height: product.customizationArea.height,
                  borderRadius: product.customizationArea.borderRadius || '0%',
                }}
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  <div style={{ transform: `scale(${imageScale})`, width: '100%', height: '100%', position: 'relative' }}>
                    <img 
                      src={customImage} 
                      alt="Your custom design" 
                      className="w-full h-full object-contain" 
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setMainImage(img)}
                  className={`relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden border-2 transition-colors ${
                    mainImage === img ? 'border-[#6B4C8A]' : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <Image 
                    src={img} 
                    alt={`${product.name} thumbnail ${idx + 1}`} 
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Product Details & Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          {product.name}
        </h1>
        
        <div className="flex items-center space-x-3 mb-6">
          {product.originalPrice && (
            <span className="text-xl text-gray-400 line-through">
              Rs. {product.originalPrice.toFixed(2)}
            </span>
          )}
          <p className="text-2xl font-semibold text-[#E33535]">
            Rs. {product.price.toFixed(2)}
          </p>
        </div>
        
        <div className="prose prose-sm text-gray-600 mb-8">
          <p>{product.description}</p>
        </div>

        {/* Size Selection */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-900 mb-3">Select Variation (Size / Color)</label>
            <div className="flex flex-wrap gap-3">
              {product.sizes.map(sizeObj => (
                <button
                  key={sizeObj.name}
                  onClick={() => sizeObj.inStock && setSelectedSize(sizeObj.name)}
                  disabled={!sizeObj.inStock}
                  className={`py-2 px-4 rounded border font-bold text-sm transition-colors ${
                    !sizeObj.inStock 
                      ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed line-through'
                      : selectedSize === sizeObj.name 
                        ? 'border-gray-900 bg-gray-900 text-white shadow-md' 
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-900'
                  }`}
                >
                  {sizeObj.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Customization Upload */}
        {product.isCustomizable && product.inStock && !product.isComingSoon && (
          <div className="mb-8 p-6 bg-purple-50 rounded-lg border border-purple-100">
            <h3 className="font-bold text-purple-900 mb-2">Customize this item</h3>
            <p className="text-sm text-purple-700 mb-4">Upload a picture to see how it looks on the product!</p>
            <input 
              type="file" 
              accept="image/*,.heic,.heif" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleImageUpload}
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-white border-2 border-[#6B4C8A] text-[#6B4C8A] py-2 px-4 rounded font-bold hover:bg-purple-100 transition-colors flex items-center justify-center gap-2 mb-4"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              {customImage ? 'Change Image' : 'Upload Image'}
            </button>

            {customImage && (
              <div className="bg-white p-4 rounded border border-purple-100 mb-2">
                <label className="block text-sm font-medium text-purple-900 mb-2">
                  Adjust Image Size
                </label>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-purple-600">Smaller</span>
                  <input 
                    type="range" 
                    min="0.5" 
                    max="2" 
                    step="0.05"
                    value={imageScale}
                    onChange={(e) => setImageScale(parseFloat(e.target.value))}
                    className="flex-1 accent-[#6B4C8A]"
                  />
                  <span className="text-xs text-purple-600">Larger</span>
                </div>
              </div>
            )}

            {customImage && (
              <button 
                onClick={() => { setCustomImage(null); setImageScale(1); }}
                className="w-full text-center text-xs text-red-500 hover:underline mt-2"
              >
                Remove image
              </button>
            )}
          </div>
        )}

        {/* Add to Cart / Buy Now Form */}
        <div className="border-t border-gray-200 pt-8 mb-8">
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
            Quantity
          </label>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <input 
              type="number" 
              id="quantity" 
              name="quantity" 
              min="1" 
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              disabled={!product.inStock || product.isComingSoon}
              className="w-full sm:w-20 rounded-md border-gray-300 shadow-sm focus:border-[#6B4C8A] focus:ring-[#6B4C8A] sm:text-sm p-3 border text-black bg-white disabled:bg-gray-100 disabled:text-gray-400"
            />
            <div className="flex flex-1 gap-2">
              <button 
                onClick={() => handleAddToCart(false)}
                disabled={!product.inStock || product.isComingSoon}
                className={`flex-1 text-white py-3 px-4 rounded-md font-bold transition-colors shadow-lg ${
                  product.isComingSoon ? 'bg-blue-600 cursor-not-allowed shadow-none' :
                  !product.inStock ? 'bg-gray-400 cursor-not-allowed shadow-none' : 
                  added ? 'bg-green-600 hover:bg-green-700' : 'bg-[#6B4C8A] hover:bg-[#5a3e74]'
                }`}
              >
                {product.isComingSoon ? 'COMING SOON' : !product.inStock ? 'OUT OF STOCK' : added ? 'ADDED!' : 'ADD TO CART'}
              </button>
              <button 
                onClick={() => handleAddToCart(true)}
                disabled={!product.inStock || product.isComingSoon}
                className={`flex-1 text-white py-3 px-4 rounded-md font-bold transition-colors shadow-lg ${
                  (!product.inStock || product.isComingSoon) ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none hidden sm:block' : 'bg-gray-900 hover:bg-black'
                }`}
              >
                BUY NOW
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4 text-sm text-gray-500">
          <div className="flex items-center">
            {product.isComingSoon ? (
              <>
                <svg className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                This item is dropping soon! Stay tuned.
              </>
            ) : product.inStock ? (
              <>
                <svg className="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                In Stock and ready to ship
              </>
            ) : (
              <>
                <svg className="h-5 w-5 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Currently out of stock
              </>
            )}
          </div>
          <div className="flex items-center">
            <svg className="h-5 w-5 mr-2 text-[#6B4C8A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Estimated delivery in 3-5 business days
          </div>
        </div>
      </div>
    </div>
  );
}
