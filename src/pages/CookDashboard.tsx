import React from 'react';
import StatsCard from '../components/StatsCard';
import { Utensils } from 'lucide-react';

const CookDashboard: React.FC = () => {
  return (
    <div className="w-full p-4 sm:p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Kitchen Display</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard 
          title="Order Queue"
          stats={[
            { label: 'New', value: 3, color: 'bg-red-500' },
            { label: 'Preparing', value: 5, color: 'bg-yellow-500' }
          ]}
        />
        <StatsCard 
          title="Inventory"
          stats={[
            { label: 'Low Stock', value: '2 Items', icon: <Utensils className="w-4 h-4 text-gray-500"/> }
          ]}
        />
        <StatsCard 
          title="Staff"
          stats={[
            { label: 'On Shift', value: 4, color: 'bg-blue-500' }
          ]}
        />
      </div>
    </div>
  );
};

export default CookDashboard;