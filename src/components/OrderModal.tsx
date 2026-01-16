import React, { useState, useMemo } from 'react';
import { X, ShoppingCart, Utensils } from 'lucide-react';
import { MenuItem } from '../services/dataService';
import { MenuCard } from './MenuCard';
import clsx from 'clsx';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
  onConfirm: (cartItems: { item: MenuItem; qty: number }[], location: string) => void;
  role: string; // 'Customer' or 'Waiter'
  defaultLocation?: string; // Room number for customer
}

const OrderModal: React.FC<OrderModalProps> = ({ 
  isOpen, onClose, menuItems, onConfirm, role, defaultLocation 
}) => {
  const [cart, setCart] = useState<{ [id: number]: number }>({});
  const [location, setLocation] = useState(defaultLocation || '');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const updateQty = (id: number, delta: number) => {
    setCart(prev => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: next };
    });
  };

  const cartTotal = useMemo(() => {
    return Object.entries(cart).reduce((total, [id, qty]) => {
      const item = menuItems.find(i => i.id === Number(id));
      return total + (item ? item.price * Number(qty) : 0);
    }, 0);
  }, [cart, menuItems]);

  const handleSubmit = () => {
    setError('');
    if (Object.keys(cart).length === 0) {
      setError('Your cart is empty.');
      return;
    }
    if (!location.trim()) {
      setError(role === 'Waiter' ? 'Table number is required.' : 'Room number is required.');
      return;
    }

    const items = Object.entries(cart).map(([id, qty]) => ({
      item: menuItems.find(i => i.id === Number(id))!,
      qty: Number(qty)
    }));

    onConfirm(items, location);
    setCart({}); // Clear cart on success
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50 shrink-0">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <Utensils className="w-5 h-5 text-green-600"/> 
            {role === 'Customer' ? 'Room Service' : 'New Order'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors" aria-label="Close modal">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
            
            {/* Menu Section */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-white">
              <h4 className="font-semibold text-gray-700 mb-4 sticky top-0 bg-white py-2 z-10">Menu</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {menuItems.map(item => (
                  <MenuCard 
                    key={item.id} 
                    item={item} 
                    qty={cart[item.id] || 0} 
                    onUpdateQty={(delta) => updateQty(item.id, delta)} 
                  />
                ))}
              </div>
            </div>

            {/* Cart Section */}
            <div className="w-full md:w-80 lg:w-96 bg-gray-50 border-t md:border-t-0 md:border-l border-gray-100 flex flex-col shrink-0 h-1/3 md:h-auto">
              <div className="p-4 border-b border-gray-200 bg-gray-100/50">
                <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4"/> Your Order
                </h4>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {Object.keys(cart).length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <ShoppingCart className="w-8 h-8 mb-2 opacity-20"/>
                    <p className="text-sm italic">Cart is empty</p>
                  </div>
                ) : (
                  Object.entries(cart).map(([id, qty]) => {
                    const item = menuItems.find(i => i.id === Number(id));
                    if (!item) return null;
                    return (
                      <div key={id} className="flex justify-between items-center text-sm bg-white p-3 rounded border border-gray-100 shadow-sm">
                        <div>
                            <span className="font-bold text-gray-800 mr-2">{qty}x</span>
                            <span className="text-gray-600">{item.item}</span>
                        </div>
                        <span className="font-medium text-gray-900">${item.price * Number(qty)}</span>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="p-4 border-t border-gray-200 bg-white space-y-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <div className="flex justify-between font-bold text-lg text-gray-800">
                  <span>Total</span>
                  <span>${cartTotal}</span>
                </div>

                <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                     {role === 'Waiter' ? 'Table Number' : 'Room Number'}
                   </label>
                   <input 
                      type="text" 
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder={role === 'Waiter' ? "e.g. Table 5" : "e.g. 101"}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20"
                   />
                </div>

                {error && (
                  <div className="text-red-500 text-xs bg-red-50 p-2 rounded border border-red-100">
                    {error}
                  </div>
                )}

                <button 
                  onClick={handleSubmit}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-all shadow-sm active:scale-[0.98] flex justify-center items-center gap-2"
                >
                  <Utensils className="w-4 h-4" /> Place Order
                </button>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;