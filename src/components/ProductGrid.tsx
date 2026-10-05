"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from './ProductCard';
import { useProducts } from '@/components/ProductContext';

export default function ProductGrid() {
  const { products, categories } = useProducts();
  const [activeTab, setActiveTab] = useState('All');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const tabs = categories.length > 0 ? ['All', ...categories] : ['All'];
  
  const filteredProducts = activeTab === 'All' 
    ? products 
    : products.filter(p => p.category === activeTab);

  return (
    <section id="shop" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Tabs */}
        <div className="flex justify-between items-center mb-10 border-b border-gray-200 pb-2">
          <h2 className="text-xl font-bold text-gray-900">
            {activeTab || 'All Products'}
          </h2>
          
          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="p-2 text-gray-500 hover:text-gray-900 transition-colors flex items-center justify-center focus:outline-none"
              aria-label="Categories Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            {isDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                <ul className="py-2">
                  {tabs.map((tab) => (
                    <li key={`dropdown-${tab}`}>
                      <button
                        onClick={() => {
                          setActiveTab(tab);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm ${
                          activeTab === tab 
                            ? 'bg-gray-100 text-[#6B4C8A] font-bold' 
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {tab}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        
        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-y-10 gap-x-6 sm:gap-x-8 min-h-[400px]">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                id={product.id}
                slug={product.slug}
                name={product.name}
                price={product.price}
                originalPrice={product.originalPrice}
                imageUrl={product.images[0] || 'https://via.placeholder.com/300x400?text=No+Image'}
                category={product.category}
                inStock={product.inStock}
                tag={product.tag}
              />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 py-12">
              No products found in this category.
            </div>
          )}
        </div>
        
        <div className="mt-16 text-center">
          <Link href="/categories" className="inline-block bg-transparent border-2 border-gray-900 text-gray-900 px-8 py-3 text-sm font-bold hover:bg-gray-900 hover:text-white transition-colors">
            LOAD MORE
          </Link>
        </div>
      </div>
    </section>
  );
}
