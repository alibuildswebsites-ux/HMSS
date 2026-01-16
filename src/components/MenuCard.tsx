import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { MenuItem } from '../services/dataService';

interface MenuCardProps {
  item: MenuItem;
  qty: number;
  onUpdateQty: (delta: number) => void;
}

export const MenuCard: React.FC<MenuCardProps> = ({ item, qty, onUpdateQty }) => {
  return (
    <div className="border border-gray-100 rounded-lg p-3 hover:shadow-md transition-shadow bg-white flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-start">
          <span className="font-medium text-gray-800">{item.item}</span>
          <span className="text-green-600 font-bold text-sm">${item.price}</span>
        </div>
        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full mt-1 inline-block">{item.category}</span>
      </div>
      <div className="mt-3 flex items-center justify-end gap-2">
        {qty > 0 ? (
          <>
            <button 
              onClick={() => onUpdateQty(-1)} 
              className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded hover:bg-gray-200 text-gray-600 transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-sm font-bold w-6 text-center">{qty}</span>
            <button 
              onClick={() => onUpdateQty(1)} 
              className="w-8 h-8 flex items-center justify-center bg-green-100 rounded hover:bg-green-200 text-green-700 transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </>
        ) : (
          <button 
            onClick={() => onUpdateQty(1)} 
            className="text-xs bg-gray-900 text-white px-3 py-2 rounded hover:bg-gray-800 transition-colors w-full sm:w-auto font-medium"
          >
            Add
          </button>
        )}
      </div>
    </div>
  );
};

export default MenuCard;