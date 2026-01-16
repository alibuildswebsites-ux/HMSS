import React, { useEffect, useState } from 'react';
import { DataService, Order } from '../services/dataService';
import StatsCard from '../components/StatsCard';
import { Utensils, Clock, CheckCircle, Flame, ChefHat } from 'lucide-react';
import clsx from 'clsx';

const CookDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  const loadOrders = () => {
    setOrders(DataService.getOrders());
  };

  useEffect(() => {
    loadOrders();
    // Simple polling to mimic real-time
    const interval = setInterval(loadOrders, 5000); 
    return () => clearInterval(interval);
  }, []);

  const updateStatus = (id: string, status: Order['status']) => {
    DataService.updateOrderStatus(id, status);
    loadOrders();
  };

  const pendingOrders = orders.filter(o => o.status === 'Pending');
  const preparingOrders = orders.filter(o => o.status === 'Preparing');
  const readyOrders = orders.filter(o => o.status === 'Ready');

  return (
    <div className="w-full p-4 sm:p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <ChefHat className="w-8 h-8 text-gray-800"/> Kitchen Display
        </h2>
        <span className="text-sm font-medium text-gray-500 bg-white px-3 py-1 rounded-full border shadow-sm">
            Live Feed
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard 
          title="Queue"
          stats={[
            { label: 'Pending', value: pendingOrders.length, color: 'bg-red-500' },
            { label: 'Cooking', value: preparingOrders.length, color: 'bg-yellow-500' }
          ]}
        />
        <StatsCard 
          title="Performance"
          stats={[
            { label: 'Avg Time', value: '12m', icon: <Clock className="w-4 h-4 text-gray-500"/> }
          ]}
        />
        <StatsCard 
          title="Ready"
          stats={[
            { label: 'To Serve', value: readyOrders.length, color: 'bg-green-500' }
          ]}
        />
      </div>

      {/* KDS Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full items-start">
        
        {/* Pending Column */}
        <div className="bg-gray-100/50 rounded-xl p-4 min-h-[500px]">
            <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500"></span> New Orders ({pendingOrders.length})
            </h3>
            <div className="space-y-3">
                {pendingOrders.map(order => (
                    <div key={order.id} className="bg-white p-4 rounded-lg shadow-sm border border-l-4 border-l-red-500 border-gray-100 animate-in slide-in-from-left-2">
                        <div className="flex justify-between items-start mb-2">
                            <span className="font-bold text-gray-800">{order.tableOrRoom}</span>
                            <span className="text-xs text-gray-400">{new Date(order.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                        <ul className="text-sm text-gray-600 mb-4 space-y-1">
                            {order.items.map((item, idx) => (
                                <li key={idx} className="flex justify-between">
                                    <span>{item.qty}x {item.item.item}</span>
                                </li>
                            ))}
                        </ul>
                        <button 
                            onClick={() => updateStatus(order.id, 'Preparing')}
                            className="w-full py-2 bg-red-50 text-red-700 font-bold text-sm rounded hover:bg-red-100 transition-colors flex justify-center items-center gap-2"
                        >
                            <Flame className="w-4 h-4" /> Start Cooking
                        </button>
                    </div>
                ))}
                {pendingOrders.length === 0 && <p className="text-center text-gray-400 text-sm py-4">No new orders</p>}
            </div>
        </div>

        {/* Preparing Column */}
        <div className="bg-gray-100/50 rounded-xl p-4 min-h-[500px]">
            <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-yellow-500"></span> Preparing ({preparingOrders.length})
            </h3>
            <div className="space-y-3">
                {preparingOrders.map(order => (
                    <div key={order.id} className="bg-white p-4 rounded-lg shadow-sm border border-l-4 border-l-yellow-500 border-gray-100">
                        <div className="flex justify-between items-start mb-2">
                            <span className="font-bold text-gray-800">{order.tableOrRoom}</span>
                            <span className="text-xs text-gray-400">{new Date(order.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                        <ul className="text-sm text-gray-600 mb-4 space-y-1">
                            {order.items.map((item, idx) => (
                                <li key={idx} className="flex justify-between">
                                    <span>{item.qty}x {item.item.item}</span>
                                </li>
                            ))}
                        </ul>
                        <button 
                            onClick={() => updateStatus(order.id, 'Ready')}
                            className="w-full py-2 bg-yellow-50 text-yellow-700 font-bold text-sm rounded hover:bg-yellow-100 transition-colors flex justify-center items-center gap-2"
                        >
                            <CheckCircle className="w-4 h-4" /> Mark Ready
                        </button>
                    </div>
                ))}
                {preparingOrders.length === 0 && <p className="text-center text-gray-400 text-sm py-4">Kitchen is clear</p>}
            </div>
        </div>

        {/* Ready Column */}
        <div className="bg-gray-100/50 rounded-xl p-4 min-h-[500px]">
            <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500"></span> Ready to Serve ({readyOrders.length})
            </h3>
            <div className="space-y-3">
                {readyOrders.map(order => (
                    <div key={order.id} className="bg-white p-4 rounded-lg shadow-sm border border-l-4 border-l-green-500 border-gray-100 opacity-75">
                         <div className="flex justify-between items-start mb-2">
                            <span className="font-bold text-gray-800">{order.tableOrRoom}</span>
                            <span className="text-xs font-bold text-green-600">READY</span>
                        </div>
                        <ul className="text-sm text-gray-500 mb-2 space-y-1">
                            {order.items.map((item, idx) => (
                                <li key={idx}>{item.qty}x {item.item.item}</li>
                            ))}
                        </ul>
                         <p className="text-xs text-gray-400 italic">Waiting for pickup...</p>
                    </div>
                ))}
                 {readyOrders.length === 0 && <p className="text-center text-gray-400 text-sm py-4">No orders waiting</p>}
            </div>
        </div>

      </div>
    </div>
  );
};

export default CookDashboard;