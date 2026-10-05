"use client";

import Link from 'next/link';
import ProductCustomizer from '@/components/ProductCustomizer';
import { useProducts } from '@/components/ProductContext';
import { use } from 'react';
import { notFound } from 'next/navigation';

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  // In Next 15 Client Components, params is a Promise so we need to unwrap it with React.use()
  const resolvedParams = use(params);
  const { slug } = resolvedParams;
  const { products, isLoading } = useProducts();
  
  if (isLoading) {
    return (
      <div className="bg-white min-h-[60vh] flex items-center justify-center">
        <div className="text-gray-500 animate-pulse font-medium">Loading product details...</div>
      </div>
    );
  }

  const product = products.find(p => p.slug === slug);

  if (!product) {
    return notFound();
  }

  return (
    <div className="bg-white min-h-screen pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <nav className="flex mb-8 text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/#shop" className="hover:text-gray-900 transition-colors">Shop</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">{product.name}</span>
        </nav>

        <ProductCustomizer product={product} />

      </div>
    </div>
  );
}

