import React, { useState, useMemo } from 'react';
import { X, ShoppingCart, Plus, Minus, Utensils } from 'lucide-react';
import { MenuItem } from '../services/dataService';
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

  // Reset state when opening if needed, but here simple implementation
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
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50 shrink-0">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <Utensils className="w-5 h-5 text-green-600"/> 
            {role === 'Customer' ? 'Room Service' : 'New Order'}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="flex flex-col md:flex-row gap-6">
            
            {/* Menu Section */}
            <div className="flex-1 space-y-4">
              <h4 className="font-semibold text-gray-700">Menu</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {menuItems.map(item => (
                  <div key={item.id} className="border border-gray-100 rounded-lg p-3 hover:shadow-md transition-shadow bg-white flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="font-medium text-gray-800">{item.item}</span>
                        <span className="text-green-600 font-bold text-sm">${item.price}</span>
                      </div>
                      <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full mt-1 inline-block">{item.category}</span>
                    </div>
                    <div className="mt-3 flex items-center justify-end gap-2">
                      {cart[item.id] ? (
                        <>
                          <button onClick={() => updateQty(item.id, -1)} className="p-1 bg-gray-100 rounded hover:bg-gray-200 text-gray-600">
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-bold w-4 text-center">{cart[item.id]}</span>
                          <button onClick={() => updateQty(item.id, 1)} className="p-1 bg-green-100 rounded hover:bg-green-200 text-green-700">
                            <Plus className="w-3 h-3" />
                          </button>
                        </>
                      ) : (
                        <button onClick={() => updateQty(item.id, 1)} className="text-xs bg-gray-900 text-white px-3 py-1.5 rounded hover:bg-gray-800 transition-colors">
                          Add
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cart Section */}
            <div className="w-full md:w-1/3 bg-gray-50 rounded-xl p-4 border border-gray-100 h-fit shrink-0">
              <h4 className="font-semibold text-gray-700 flex items-center gap-2 mb-4">
                <ShoppingCart className="w-4 h-4"/> Current Order
              </h4>
              
              <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                {Object.keys(cart).length === 0 ? (
                  <p className="text-sm text-gray-400 italic text-center py-4">Select items from menu</p>
                ) : (
                  Object.entries(cart).map(([id, qty]) => {
                    const item = menuItems.find(i => i.id === Number(id));
                    if (!item) return null;
                    return (
                      <div key={id} className="flex justify-between text-sm">
                        <span className="text-gray-600">{qty}x {item.item}</span>
                        <span className="font-medium text-gray-900">${item.price * Number(qty)}</span>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="border-t border-gray-200 pt-3 space-y-3">
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
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-lg transition-all shadow-sm active:scale-[0.98]"
                >
                  Place Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;