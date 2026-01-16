import React, { useEffect, useState } from 'react';
import { DataService, Order, MenuItem } from '../services/dataService';
import StatsCard from '../components/StatsCard';
import OrderModal from '../components/OrderModal';
import { Clock, CheckCircle, Coffee, Plus, Ban, Check, Utensils } from 'lucide-react';
import clsx from 'clsx';

const WaiterDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = () => {
    setOrders(DataService.getOrders());
    setMenu(DataService.getMenu());
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCreateOrder = (cartItems: { item: MenuItem; qty: number }[], location: string) => {
    const items = cartItems.map(c => ({
      id: c.item.id,
      item: c.item.item,
      price: c.item.price,
      qty: c.qty
    }));
    
    DataService.createOrder({
      items,
      total: items.reduce((sum, i) => sum + (i.price * i.qty), 0),
      tableOrRoom: location,
      orderedBy: 'Waiter'
    });
    loadData();
  };

  const updateStatus = (id: string, status: Order['status']) => {
    if (status === 'Cancelled' && !window.confirm('Cancel this order?')) return;
    DataService.updateOrderStatus(id, status);
    loadData();
  };

  const pending = orders.filter(o => o.status === 'Pending').length;
  const ready = orders.filter(o => o.status === 'Ready').length;
  
  // Filter out served/cancelled orders for the main list
  const activeOrders = orders.filter(o => ['Pending', 'Preparing', 'Ready'].includes(o.status));

  return (
    <div className="w-full p-4 sm:p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Waiter Station</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> New Order
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatsCard 
          title="Kitchen Status"
          stats={[
            { label: 'Pending', value: pending, icon: <Clock className="w-4 h-4 text-yellow-500"/> },
            { label: 'Ready to Serve', value: ready, icon: <CheckCircle className="w-4 h-4 text-green-500"/> }
          ]}
        />
        <StatsCard 
          title="Floor Status"
          stats={[
            { label: 'Active Orders', value: activeOrders.length, icon: <Coffee className="w-4 h-4 text-gray-500"/> }
          ]}
        />
      </div>

      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-gray-100 font-bold text-gray-700 flex items-center gap-2">
            <Utensils className="w-4 h-4" /> Active Orders
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b border-gray-100 text-gray-500">
                    <tr>
                        <th className="p-4 font-medium">Order ID</th>
                        <th className="p-4 font-medium">Table/Room</th>
                        <th className="p-4 font-medium">Items</th>
                        <th className="p-4 font-medium">Status</th>
                        <th className="p-4 font-medium text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {activeOrders.map(order => (
                        <tr key={order.id} className="hover:bg-gray-50/50">
                            <td className="p-4 text-gray-600 font-mono text-xs">{order.id}</td>
                            <td className="p-4 font-bold text-gray-800">{order.tableOrRoom}</td>
                            <td className="p-4 text-gray-600 max-w-xs truncate">
                                {order.items.map(i => `${i.qty}x ${i.item}`).join(', ')}
                            </td>
                            <td className="p-4">
                                <span className={clsx(
                                    "px-2 py-1 rounded-full text-xs font-bold",
                                    order.status === 'Pending' && "bg-gray-100 text-gray-600",
                                    order.status === 'Preparing' && "bg-yellow-100 text-yellow-700",
                                    order.status === 'Ready' && "bg-green-100 text-green-700 animate-pulse"
                                )}>
                                    {order.status}
                                </span>
                            </td>
                            <td className="p-4 text-right flex justify-end gap-2">
                                {order.status === 'Pending' && (
                                    <button 
                                        onClick={() => updateStatus(order.id, 'Cancelled')}
                                        className="text-red-500 hover:bg-red-50 p-1 rounded transition-colors"
                                        title="Cancel Order"
                                    >
                                        <Ban className="w-4 h-4" />
                                    </button>
                                )}
                                {order.status === 'Ready' && (
                                    <button 
                                        onClick={() => updateStatus(order.id, 'Served')}
                                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm transition-colors"
                                    >
                                        <Check className="w-3 h-3" /> Serve
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                    {activeOrders.length === 0 && (
                        <tr>
                            <td colSpan={5} className="p-8 text-center text-gray-400">No active orders.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>

      <OrderModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        menuItems={menu}
        onConfirm={handleCreateOrder}
        role="Waiter"
      />
    </div>
  );
};

export default WaiterDashboard;