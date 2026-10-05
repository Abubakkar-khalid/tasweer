"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthContext';
import { useRouter } from 'next/navigation';
import { Package, Search, Eye } from 'lucide-react';

type OrderStatus = 'New' | 'Processing' | 'Delivered' | 'Cancelled';

interface OrderItemType {
  id: number;
  product_name: string;
  product_price: string;
  quantity: number;
  variation: string;
}

interface Order {
  id: number;
  order_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  total_amount: string;
  status: OrderStatus;
  created_at: string;
  items: OrderItemType[];
}

export default function AdminOrdersPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'Active' | 'Completed'>('Active');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await fetch('https://AbubakarKhalid.pythonanywhere.com/api/orders/');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (!authLoading && (!user || !user.isAdmin)) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  if (authLoading || !user || !user.isAdmin) return null;

  const filteredOrders = orders.filter(order => {
    const matchesTab = activeTab === 'Active' 
      ? ['New', 'Processing'].includes(order.status)
      : ['Delivered', 'Cancelled'].includes(order.status);
    
    const matchesSearch = order.order_id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          order.customer_name.toLowerCase().includes(searchQuery.toLowerCase());
                          
    return matchesTab && matchesSearch;
  });

  const updateOrderStatus = async (id: number, status: OrderStatus) => {
    try {
      const res = await fetch(`https://AbubakarKhalid.pythonanywhere.com/api/orders/${id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchOrders();
        setSelectedOrder(null);
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Processing': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Delivered': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
            <p className="text-gray-500 mt-1">View and process customer orders</p>
          </div>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search orders or customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-gray-900 focus:border-gray-900"
            />
            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-200/50 p-1 rounded-lg w-max">
          <button
            onClick={() => setActiveTab('Active')}
            className={`px-6 py-2 rounded-md text-sm font-bold transition-colors ${
              activeTab === 'Active' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
            }`}
          >
            Active Orders
          </button>
          <button
            onClick={() => setActiveTab('Completed')}
            className={`px-6 py-2 rounded-md text-sm font-bold transition-colors ${
              activeTab === 'Completed' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
            }`}
          >
            Completed & Delivered
          </button>
        </div>

        {/* Orders Table */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-bold">
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Items</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900">
                        {order.order_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900">{order.customer_name}</div>
                        <div className="text-xs text-gray-500">{order.customer_email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {order.items.reduce((acc, item) => acc + item.quantity, 0)} items
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900">
                        Rs. {parseFloat(order.total_amount).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button 
                          onClick={() => setSelectedOrder(order)}
                          className="inline-flex items-center gap-1 text-gray-700 hover:text-black text-sm font-bold bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-md transition-colors border border-gray-200"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      <Package className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                      <p className="text-lg font-medium text-gray-900">No orders found</p>
                      <p className="text-sm mt-1">There are no {activeTab.toLowerCase()} orders matching your criteria.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-100">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex flex-col sm:flex-row justify-between mb-8 gap-4">
                <div>
                  <h3 className="text-sm text-gray-500 uppercase tracking-wider font-bold mb-1">Order Number</h3>
                  <p className="text-xl font-black text-gray-900">{selectedOrder.order_id}</p>
                  <p className="text-sm text-gray-500">{new Date(selectedOrder.created_at).toLocaleString()}</p>
                </div>
                <div className="sm:text-right">
                  <h3 className="text-sm text-gray-500 uppercase tracking-wider font-bold mb-1">Current Status</h3>
                  <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold border uppercase tracking-wider ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                  
                  {/* Status Change Buttons */}
                  <div className="mt-4 flex gap-2 sm:justify-end">
                    {selectedOrder.status === 'New' && (
                      <button 
                        onClick={() => updateOrderStatus(selectedOrder.id, 'Processing')}
                        className="text-xs bg-gray-900 text-white font-bold py-1.5 px-3 rounded hover:bg-black transition-colors"
                      >
                        Mark Processing
                      </button>
                    )}
                    {selectedOrder.status === 'Processing' && (
                      <button 
                        onClick={() => updateOrderStatus(selectedOrder.id, 'Delivered')}
                        className="text-xs bg-emerald-600 text-white font-bold py-1.5 px-3 rounded hover:bg-emerald-700 transition-colors"
                      >
                        Mark Delivered
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 border-b border-gray-200 pb-2 mb-3">Customer Information</h3>
                  <p className="font-bold text-gray-800">{selectedOrder.customer_name}</p>
                  <p className="text-gray-600 text-sm mt-1">{selectedOrder.customer_email}</p>
                  <p className="text-gray-600 text-sm mt-1">{selectedOrder.customer_phone}</p>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 border-b border-gray-200 pb-2 mb-3">Shipping Address</h3>
                  <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">
                    {selectedOrder.shipping_address}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-900 border-b border-gray-200 pb-2 mb-3">
                  Order Items ({selectedOrder.items.reduce((acc, item) => acc + item.quantity, 0)})
                </h3>
                <div className="space-y-4">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs font-bold border border-gray-300">
                           {item.quantity}x
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{item.product_name}</p>
                          {item.variation && (
                            <p className="text-xs text-gray-500 mt-0.5">Var: {item.variation}</p>
                          )}
                        </div>
                      </div>
                      <p className="font-bold text-gray-900 text-sm">
                        Rs. {parseFloat(item.product_price).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center text-sm mb-2 text-gray-600">
                    <span>Subtotal</span>
                    <span>Rs. {parseFloat(selectedOrder.total_amount).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm mb-2 text-gray-600">
                    <span>Shipping</span>
                    <span>Rs. 250</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-black text-gray-900 mt-4">
                    <span>Total</span>
                    <span>Rs. {(parseFloat(selectedOrder.total_amount) + 250).toLocaleString()}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
