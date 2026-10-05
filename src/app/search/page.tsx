"use client";

import { useSearchParams } from 'next/navigation';
import { useProducts } from '@/components/ProductContext';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import { Suspense } from 'react';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q')?.toLowerCase() || '';
  const { products } = useProducts();

  const searchResults = products.filter(
    p => p.name.toLowerCase().includes(query) || 
         p.description.toLowerCase().includes(query) || 
         p.category.toLowerCase().includes(query)
  );

  return (
    <>
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Results</h1>
        <p className="text-gray-600">
          {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for &quot;<span className="font-semibold">{query}</span>&quot;
        </p>
      </div>

      {searchResults.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-10 gap-x-6 sm:gap-x-8">
          {searchResults.map((product) => (
            <ProductCard key={product.id} {...product} imageUrl={product.images[0] || ''} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-white rounded-xl border border-gray-200">
          <h3 className="text-xl font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-500 mb-6">Try adjusting your search or browse our collections.</p>
          <Link href="/categories" className="inline-block bg-[#6B4C8A] text-white px-6 py-3 rounded-md font-bold hover:bg-[#5a3e74] transition-colors">
            Browse Collections
          </Link>
        </div>
      )}
    </>
  );
}

export default function SearchPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<div>Loading search results...</div>}>
          <SearchResults />
        </Suspense>
      </div>
    </div>
  );
}
