import React from 'react';
import StatsCard from '../components/StatsCard';
import { Clock, CheckCircle, Coffee } from 'lucide-react';

const WaiterDashboard: React.FC = () => {
  return (
    <div className="w-full p-4 sm:p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Waiter Station</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatsCard 
          title="Orders"
          stats={[
            { label: 'Pending', value: 4, icon: <Clock className="w-4 h-4 text-yellow-500"/> },
            { label: 'Ready to Serve', value: 2, icon: <CheckCircle className="w-4 h-4 text-green-500"/> }
          ]}
        />
        <StatsCard 
          title="Tables"
          stats={[
            { label: 'Occupied', value: '8/20', icon: <Coffee className="w-4 h-4 text-gray-500"/> }
          ]}
        />
      </div>
    </div>
  );
};

export default WaiterDashboard;