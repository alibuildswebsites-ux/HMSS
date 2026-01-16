import React from 'react';
import StatsCard from '../components/StatsCard';
import { Calendar, LogOut, CreditCard, ShoppingBag } from 'lucide-react';

const CustomerDashboard: React.FC = () => {
  return (
    <div className="w-full p-4 sm:p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">My Stay</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard 
          title="Current Booking"
          stats={[
            { label: 'Room', value: '1420', icon: <Calendar className="w-4 h-4 text-blue-500"/> },
            { label: 'Checkout', value: '28 Jan', icon: <LogOut className="w-4 h-4 text-gray-500"/> }
          ]}
        />
        <StatsCard 
          title="Bill"
          stats={[
            { label: 'Total Due', value: '$150', icon: <CreditCard className="w-4 h-4 text-green-500"/> }
          ]}
        />
        <StatsCard 
          title="Services"
          stats={[
            { label: 'Active Orders', value: 1, icon: <ShoppingBag className="w-4 h-4 text-orange-500"/> }
          ]}
        />
      </div>
    </div>
  );
};

export default CustomerDashboard;