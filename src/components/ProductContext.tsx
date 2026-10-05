"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

export interface Product {
  id: string;
  slug: string;
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
  tag?: string;
  customizationArea?: {
    top: string;
    left: string;
    width: string;
    height: string;
    borderRadius?: string;
  };
}

// Keep as fallback just in case backend is down
const initialProducts: Product[] = [];

interface ProductContextType {
  products: Product[];
  categories: string[];
  addProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  addCategory: (category: string) => void;
  refreshProducts: () => Promise<void>;
  isLoading: boolean;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const refreshProducts = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        fetch('http://127.0.0.1:8000/api/products/'),
        fetch('http://127.0.0.1:8000/api/categories/')
      ]);

      if (productsRes.ok) {
        const productsData = await productsRes.json();
        // Map backend products to frontend Product interface
        const mappedProducts = productsData.map((p: any) => {
          const isCustomizable = p.is_customizable === true || p.is_customizable === 'true';
          const isShirt = isCustomizable && p.name.toLowerCase().includes('shirt');
          const isMug = isCustomizable && p.name.toLowerCase().includes('mug');
          
          return {
            id: String(p.id),
            slug: p.slug,
            name: p.name,
            price: parseFloat(p.price),
            originalPrice: p.original_price ? parseFloat(p.original_price) : undefined,
            description: p.description,
            images: p.images.map((img: any) => 
              img.image.startsWith('http') ? img.image : `http://127.0.0.1:8000${img.image.startsWith('/') ? '' : '/'}${img.image}`
            ),
            category: p.category.name,
            inStock: p.in_stock,
            isCustomizable: isCustomizable,
            isComingSoon: p.is_coming_soon,
            tag: p.tag,
            customizationArea: isShirt ? {
              top: '25%', left: '25%', width: '50%', height: '50%', borderRadius: '5%'
            } : (isMug ? {
              top: '15%', left: '20%', width: '60%', height: '70%', borderRadius: '8%'
            } : undefined),
            sizes: p.variations.map((v: any) => ({ name: v.name, inStock: v.in_stock }))
          };
        });
        setProducts(mappedProducts);
      }

      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData.map((c: any) => c.name));
      }
    } catch (error) {
      console.error("Failed to fetch data from backend:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshProducts();
  }, []);

  const addProduct = (product: Product) => {
    setProducts(current => [product, ...current]);
  };

  const deleteProduct = async (id: string) => {
    try {
      const headers: any = {};
      if (user?.token) headers['Authorization'] = `Bearer ${user.token}`;
      
      const response = await fetch(`http://127.0.0.1:8000/api/products/${id}/`, {
        method: 'DELETE',
        headers
      });
      if (response.ok) {
        setProducts(current => current.filter(p => p.id !== id));
      } else {
        console.error("Failed to delete product from backend");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    // Optimistic UI update
    setProducts(current => current.map(p => p.id === id ? { ...p, ...updates } : p));

    // Prepare payload for backend (mapping frontend camelCase to backend snake_case)
    const payload: any = {};
    if ('inStock' in updates) payload.in_stock = updates.inStock;
    if ('isComingSoon' in updates) payload.is_coming_soon = updates.isComingSoon;
    if ('tag' in updates) payload.tag = updates.tag === undefined ? "" : updates.tag;
    if ('price' in updates) payload.price = updates.price;
    if ('originalPrice' in updates) payload.original_price = updates.originalPrice === undefined ? null : updates.originalPrice;
    
    // Only send if there are fields to update
    if (Object.keys(payload).length > 0) {
      try {
        const headers: any = {
          'Content-Type': 'application/json',
        };
        if (user?.token) headers['Authorization'] = `Bearer ${user.token}`;
        
        const response = await fetch(`http://127.0.0.1:8000/api/products/${id}/`, {
          method: 'PATCH',
          headers,
          body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
          console.error("Failed to persist update to backend:", await response.text());
        }
      } catch (error) {
        console.error("Error updating product:", error);
      }
    }
  };

  const addCategory = (category: string) => {
    if (!categories.includes(category)) {
      setCategories(current => [...current, category]);
    }
  };

  return (
    <ProductContext.Provider value={{ products, categories, addProduct, deleteProduct, updateProduct, addCategory, refreshProducts, isLoading }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}
