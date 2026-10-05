"use client";

import { useProducts } from '@/components/ProductContext';
import Link from 'next/link';

export default function CategoriesPage() {
  const { products } = useProducts();

  // Get unique categories and count how many products are in each
  const categoriesCount = products.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categories = Object.entries(categoriesCount).map(([name, count]) => ({
    name,
    count,
  }));

  return (
    <div className="bg-white min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900">All Collections</h1>
          <p className="mt-4 text-lg text-gray-500">Browse our complete range of categories</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link 
              key={category.name} 
              href={`/search?q=${encodeURIComponent(category.name)}`}
              className="group block"
            >
              <div className="border border-gray-200 rounded-xl p-8 hover:shadow-xl transition-shadow bg-gray-50 flex flex-col items-center justify-center min-h-[200px]">
                <h2 className="text-2xl font-bold text-gray-900 group-hover:text-[#6B4C8A] transition-colors mb-2 text-center">
                  {category.name}
                </h2>
                <p className="text-gray-500 font-medium">
                  {category.count} product{category.count !== 1 ? 's' : ''}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
