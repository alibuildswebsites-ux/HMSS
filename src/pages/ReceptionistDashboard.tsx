import React, { useEffect, useState } from 'react';
import StatsCard from '../components/StatsCard';
import { DataService, Booking } from '../services/dataService';
import { Users, LogIn, LogOut, Clock } from 'lucide-react';

const ReceptionistDashboard: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    setBookings(DataService.getBookings());
  }, []);

  return (
    <div className="w-full p-4 sm:p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Reception Desk</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard 
          title="Today's Activity"
          stats={[
            { label: 'Check-ins', value: 12, icon: <LogIn className="w-4 h-4 text-green-500"/> },
            { label: 'Check-outs', value: 8, icon: <LogOut className="w-4 h-4 text-red-500"/> }
          ]}
        />
        <StatsCard 
          title="Active Guests"
          stats={[
            { label: 'Total', value: bookings.length, icon: <Users className="w-4 h-4 text-blue-500"/> }
          ]}
        />
        <StatsCard 
          title="Front Desk"
          stats={[
            { label: 'Pending Requests', value: 5, icon: <Clock className="w-4 h-4 text-yellow-500"/> }
          ]}
        />
      </div>
    </div>
  );
};

export default ReceptionistDashboard;