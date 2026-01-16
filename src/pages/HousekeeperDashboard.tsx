import React from 'react';
import StatsCard from '../components/StatsCard';
import { SprayCan, ClipboardList, CheckCircle } from 'lucide-react';

const HousekeeperDashboard: React.FC = () => {
  return (
    <div className="w-full p-4 sm:p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Housekeeping</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatsCard 
          title="Tasks"
          stats={[
            { label: 'To Clean', value: 6, icon: <SprayCan className="w-4 h-4 text-red-500"/> },
            { label: 'In Progress', value: 2, icon: <ClipboardList className="w-4 h-4 text-blue-500"/> }
          ]}
        />
        <StatsCard 
          title="Status"
          stats={[
            { label: 'Completed Today', value: 14, icon: <CheckCircle className="w-4 h-4 text-green-500"/> }
          ]}
        />
      </div>
    </div>
  );
};

export default HousekeeperDashboard;