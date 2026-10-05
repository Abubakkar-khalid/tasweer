"use client";

import { useState, useRef, useEffect } from 'react';
import { useProducts, Product } from '@/components/ProductContext';
import { useAuth } from '@/components/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Trash2, Plus, Edit } from 'lucide-react';

export default function AdminPage() {
  const { products, categories, addProduct, deleteProduct, updateProduct, addCategory, refreshProducts } = useProducts();
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (!isLoading && (!user || !user.isAdmin)) {
      router.push('/login');
    }
  }, [user, isLoading, router]);
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    originalPrice: '',
    description: '',
    category: 'Bestsellers',
    inStock: true,
    isCustomizable: false,
    isComingSoon: false,
    tag: ''
  });
  
  const [uploadedImages, setUploadedImages] = useState<{url: string, file?: File, id?: number}[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<{name: string, inStock: boolean}[]>([]);
  const SIZES_LIST = ['S', 'M', 'L', 'XL', 'XXL'];
  const [newCategory, setNewCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [saleModalProduct, setSaleModalProduct] = useState<Product | null>(null);
  const [salePriceInput, setSalePriceInput] = useState('');
  const ITEMS_PER_PAGE = 15;

  if (isLoading || !user || !user.isAdmin) return null;

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const paginatedProducts = products.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      addCategory(newCategory.trim());
      setFormData({...formData, category: newCategory.trim()});
      setNewCategory('');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newImages = Array.from(files).map(file => ({
        url: URL.createObjectURL(file),
        file: file
      }));
      setUploadedImages(prev => [...prev, ...newImages]);
    }
  };

  const toggleSizeSelection = (size: string) => {
    setSelectedSizes(prev => {
      if (prev.find(s => s.name === size)) {
        return prev.filter(s => s.name !== size);
      }
      return [...prev, { name: size, inStock: true }];
    });
  };

  const removeUploadedImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || uploadedImages.length === 0) {
      alert("Please fill in name, price, and upload at least one image.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('slug', formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
    formDataToSend.append('name', formData.name);
    formDataToSend.append('price', formData.price);
    if (formData.originalPrice) formDataToSend.append('original_price', formData.originalPrice);
    formDataToSend.append('description', formData.description || '');
    formDataToSend.append('category_name', formData.category);
    formDataToSend.append('in_stock', String(formData.inStock));
    formDataToSend.append('is_coming_soon', String(formData.isComingSoon));
    formDataToSend.append('is_customizable', String(formData.isCustomizable));
    if (formData.tag) formDataToSend.append('tag', formData.tag);
    if (selectedSizes.length > 0) {
      formDataToSend.append('variations', JSON.stringify(selectedSizes.map(s => ({ name: s.name, inStock: s.inStock }))));
    }

    // Append images
    uploadedImages.forEach((img, index) => {
      if (img.file) {
        formDataToSend.append(`image_${index}`, img.file);
      }
    });

    try {
      const url = editingProductId 
        ? `https://AbubakarKhalid.pythonanywhere.com/api/products/${editingProductId}/`
        : `https://AbubakarKhalid.pythonanywhere.com/api/products/`;
      
      const method = editingProductId ? 'PUT' : 'POST';

      const headers: any = {};
      if (user?.token) {
        headers['Authorization'] = `Bearer ${user.token}`;
      }

      const response = await fetch(url, {
        method,
        headers,
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('Failed to save product');
      }

      alert(`Product ${editingProductId ? 'updated' : 'added'} successfully!`);
      await refreshProducts();
    } catch (error) {
      console.error(error);
      alert("Error saving product to backend.");
      return;
    }
    
    // Reset form
    setFormData({
      name: '',
      price: '',
      originalPrice: '',
      description: '',
      category: 'Bestsellers',
      inStock: true,
      isCustomizable: false,
      isComingSoon: false,
      tag: ''
    });
    setUploadedImages([]);
    setSelectedSizes([]);
  };

  const handleEditClick = (product: Product) => {
    setEditingProductId(product.id);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      originalPrice: product.originalPrice ? product.originalPrice.toString() : '',
      description: product.description || '',
      category: product.category,
      inStock: product.inStock,
      isCustomizable: product.isCustomizable,
      isComingSoon: product.isComingSoon || false,
      tag: product.tag || ''
    });
    setUploadedImages(product.images ? product.images.map(url => ({ url })) : []);
    setSelectedSizes(product.sizes || []);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingProductId(null);
    setFormData({
      name: '',
      price: '',
      originalPrice: '',
      description: '',
      category: 'Bestsellers',
      inStock: true,
      isCustomizable: false,
      isComingSoon: false,
      tag: ''
    });
    setUploadedImages([]);
    setSelectedSizes([]);
  };

  const toggleStock = (product: Product) => {
    updateProduct(product.id, { inStock: !product.inStock });
  };

  const toggleProductSizeStock = (product: Product, sizeName: string) => {
    if (!product.sizes) return;
    const newSizes = product.sizes.map(s => s.name === sizeName ? { ...s, inStock: !s.inStock } : s);
    updateProduct(product.id, { sizes: newSizes });
  };

  const handleAddVariation = (product: Product) => {
    const varName = window.prompt(`Enter variation name (e.g., Small, White, XL) for ${product.name}:`);
    if (varName && varName.trim() !== '') {
      const newSizes = product.sizes ? [...product.sizes] : [];
      if (!newSizes.find(s => s.name.toLowerCase() === varName.trim().toLowerCase())) {
        newSizes.push({ name: varName.trim(), inStock: true });
        updateProduct(product.id, { sizes: newSizes });
      } else {
        alert("This variation already exists!");
      }
    }
  };

  const toggleSale = (product: Product) => {
    if (product.tag === 'SALE') {
      // Remove sale
      updateProduct(product.id, { 
        tag: undefined, 
        price: product.originalPrice || product.price,
        originalPrice: undefined
      });
    } else {
      // Open custom modal
      setSaleModalProduct(product);
      setSalePriceInput(Math.round(product.price * 0.8).toString());
    }
  };

  const handleSaveSale = () => {
    if (saleModalProduct) {
      const salePrice = parseFloat(salePriceInput);
      if (!isNaN(salePrice) && salePrice > 0 && salePrice < saleModalProduct.price) {
        updateProduct(saleModalProduct.id, {
          tag: 'SALE',
          originalPrice: saleModalProduct.price,
          price: salePrice
        });
        setSaleModalProduct(null);
      } else {
        alert("Sale price must be valid and lower than the original price!");
      }
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
        
        {/* Left Side: Add Product Form */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 sticky top-28">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{editingProductId ? 'Edit Product' : 'Add New Product'}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4 text-gray-900">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1">Product Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full rounded-md border-gray-300 border p-2 text-gray-900 focus:ring-gray-900 focus:border-gray-900"
                  placeholder="e.g. Canvas Tote Bag"
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-900 mb-1">Price (Rs.)</label>
                  <input 
                    type="number" 
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full rounded-md border-gray-300 border p-2 text-gray-900 focus:ring-gray-900 focus:border-gray-900"
                    placeholder="999"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-900 mb-1">Orig. Price</label>
                  <input 
                    type="number" 
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({...formData, originalPrice: e.target.value})}
                    className="w-full rounded-md border-gray-300 border p-2 text-gray-900 focus:ring-gray-900 focus:border-gray-900"
                    placeholder="1200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1">About the Product (Description)</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full rounded-md border-gray-300 border p-2 text-gray-900 focus:ring-gray-900 focus:border-gray-900"
                  placeholder="Tell your customers about this product..."
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1">Category</label>
                <div className="flex gap-2 mb-2">
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="flex-1 rounded-md border-gray-300 border p-2 text-gray-900 focus:ring-gray-900 focus:border-gray-900"
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Or add new category..."
                    className="flex-1 rounded-md border-gray-300 border p-2 text-sm text-gray-900 focus:ring-gray-900 focus:border-gray-900"
                  />
                  <button 
                    type="button"
                    onClick={handleAddCategory}
                    className="bg-gray-200 text-gray-900 px-3 py-2 rounded text-sm font-bold hover:bg-gray-300 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1">Tag (Optional)</label>
                <select 
                  value={formData.tag}
                  onChange={(e) => setFormData({...formData, tag: e.target.value})}
                  className="w-full rounded-md border-gray-300 border p-2 text-gray-900 focus:ring-gray-900 focus:border-gray-900"
                >
                  <option value="">None</option>
                  <option value="NEW">NEW</option>
                  <option value="SALE">SALE</option>
                  <option value="HOT">HOT</option>
                </select>
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={formData.inStock}
                    onChange={(e) => setFormData({...formData, inStock: e.target.checked})}
                    className="rounded text-gray-900 focus:ring-gray-900 border-gray-300 w-4 h-4"
                  />
                  <span className="text-sm font-bold text-gray-900">In Stock</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={formData.isCustomizable}
                    onChange={(e) => setFormData({...formData, isCustomizable: e.target.checked})}
                    className="rounded text-gray-900 focus:ring-gray-900 border-gray-300 w-4 h-4"
                  />
                  <span className="text-sm font-bold text-gray-900">Customizable</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={formData.isComingSoon}
                    onChange={(e) => setFormData({...formData, isComingSoon: e.target.checked})}
                    className="rounded text-gray-900 focus:ring-gray-900 border-gray-300 w-4 h-4"
                  />
                  <span className="text-sm font-bold text-gray-900">Coming Soon</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Variations (Sizes / Colors)</label>
                <div className="flex flex-wrap gap-2">
                  {SIZES_LIST.map(size => {
                    const sizeObj = selectedSizes.find(s => s.name === size);
                    const isActive = !!sizeObj;
                    return (
                      <div 
                        key={size}
                        className={`cursor-pointer px-3 py-1.5 rounded border text-sm font-bold transition-colors flex items-center ${
                          isActive 
                            ? 'bg-gray-900 text-white border-gray-900 shadow-md' 
                            : 'bg-white text-gray-700 border-gray-300 hover:border-gray-500'
                        }`}
                        onClick={() => toggleSizeSelection(size)}
                      >
                        <span>{size}</span>
                        {isActive && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedSizes(prev => prev.map(s => s.name === size ? { ...s, inStock: !s.inStock } : s));
                            }}
                            className={`ml-2 px-1.5 py-0.5 rounded text-[10px] transition-colors ${sizeObj.inStock ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
                            title="Toggle in-stock status for this size"
                          >
                            {sizeObj.inStock ? 'In Stock' : 'Out'}
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="pt-2">
                <label className="block text-sm font-bold text-gray-900 mb-2">Product Images</label>
                
                {uploadedImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {uploadedImages.map((img, index) => (
                      <div key={index} className="relative w-full aspect-square border border-gray-200 rounded-md overflow-hidden group">
                        <Image src={img.url} alt={`Preview ${index}`} fill className="object-cover" />
                        <button 
                          type="button"
                          onClick={() => removeUploadedImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                          title="Remove image"
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-400 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors bg-gray-50"
                >
                  <Plus className="h-6 w-6 text-gray-600 mb-1" />
                  <span className="text-xs font-medium text-gray-600">Click to add images</span>
                </div>
                
                <input 
                  type="file" 
                  accept="image/*" 
                  multiple
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                />
              </div>

              <button 
                type="submit" 
                className="w-full bg-gray-900 text-white py-3 rounded-md font-bold hover:bg-black transition-colors mt-6 shadow-md"
              >
                {editingProductId ? 'Update Product' : 'Publish Product'}
              </button>
              {editingProductId && (
                <button 
                  type="button" 
                  onClick={handleCancelEdit}
                  className="w-full bg-gray-200 text-gray-800 py-3 rounded-md font-bold hover:bg-gray-300 transition-colors mt-2"
                >
                  Cancel Edit
                </button>
              )}
            </form>
          </div>
        </div>

        {/* Right Side: Product List */}
        <div className="w-full lg:w-2/3">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Manage Products</h2>
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden flex flex-col h-full">
            <ul className="divide-y divide-gray-200 flex-grow">
              {paginatedProducts.map((product) => (
                <li key={product.id} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16 bg-gray-100 rounded overflow-hidden flex-shrink-0 border border-gray-200">
                      <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">{product.name}</h4>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className="text-xs text-gray-600 font-medium bg-gray-100 px-2 py-0.5 rounded">{product.category}</span>
                        <span className="text-xs text-gray-900 font-bold">Rs. {product.price}</span>
                        {product.isCustomizable && (
                          <span className="px-2 py-0.5 bg-gray-900 text-white text-[10px] font-bold rounded-full">Custom</span>
                        )}
                        {!product.inStock && (
                          <span className="px-2 py-0.5 bg-red-100 text-red-800 text-[10px] font-bold rounded-full">Out of Stock</span>
                        )}
                        {product.tag === 'SALE' && (
                          <span className="px-2 py-0.5 bg-[#E33535] text-white text-[10px] font-bold rounded-full">Sale</span>
                        )}
                        
                        <div className="flex items-center gap-1 ml-2 border-l border-gray-300 pl-2">
                          {product.sizes && product.sizes.map(s => (
                            <button
                              key={s.name}
                              onClick={() => toggleProductSizeStock(product, s.name)}
                              className={`px-1.5 py-0.5 text-[9px] font-bold rounded transition-colors ${
                                s.inStock ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-red-100 text-red-800 hover:bg-red-200'
                              }`}
                              title={`Toggle stock for ${s.name}`}
                            >
                              {s.name}
                            </button>
                          ))}
                          <button
                            onClick={() => handleAddVariation(product)}
                            className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors flex items-center"
                            title="Add Variation (Size/Color)"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <button 
                      onClick={() => toggleSale(product)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-md transition-colors border ${
                        product.tag === 'SALE' 
                          ? 'bg-[#E33535] text-white border-[#E33535] hover:bg-red-700' 
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {product.tag === 'SALE' ? 'Remove Sale' : 'Make Sale'}
                    </button>
                    
                    <button 
                      onClick={() => toggleStock(product)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-md transition-colors border ${
                        product.inStock 
                          ? 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50' 
                          : 'bg-gray-200 text-gray-900 border-gray-300 hover:bg-gray-300'
                      }`}
                    >
                      {product.inStock ? 'Mark Out of Stock' : 'Mark In Stock'}
                    </button>

                    <button 
                      onClick={() => handleEditClick(product)}
                      className="text-blue-500 hover:text-blue-700 p-1.5 rounded-md hover:bg-blue-50 transition-colors border border-transparent ml-2"
                      title="Edit Product"
                    >
                      <Edit className="h-4 w-4" />
                    </button>

                    <button 
                      onClick={() => deleteProduct(product.id)}
                      className="text-red-500 hover:text-red-700 p-1.5 rounded-md hover:bg-red-50 transition-colors border border-transparent ml-1"
                      title="Delete Product"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
                <span className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, products.length)}</span> of <span className="font-medium">{products.length}</span> results
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Sale Modal */}
      {saleModalProduct && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-gray-200 p-6 w-full max-w-sm transform transition-all">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Set Sale Price</h3>
            <p className="text-sm text-gray-600 mb-5">
              Current price for <span className="font-semibold text-gray-900">{saleModalProduct.name}</span> is <span className="font-semibold text-gray-900">Rs. {saleModalProduct.price}</span>
            </p>
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-900 mb-2">New Sale Price (Rs.)</label>
              <input 
                type="number" 
                value={salePriceInput}
                onChange={(e) => setSalePriceInput(e.target.value)}
                className="w-full rounded-md border-gray-300 border p-3 text-gray-900 focus:ring-gray-900 focus:border-gray-900"
                autoFocus
              />
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setSaleModalProduct(null)}
                className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-md font-bold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveSale}
                className="flex-1 px-4 py-2.5 bg-[#E33535] text-white rounded-md font-bold hover:bg-red-700 transition-colors shadow-md"
              >
                Save Sale
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
