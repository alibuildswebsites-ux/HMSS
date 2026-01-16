import React, { useEffect, useState } from 'react';
import StatsCard from '../components/StatsCard';
import { DataService, Booking } from '../services/dataService';
import { 
  Users, LogIn, LogOut, Clock, CheckCircle, 
  Coffee, Utensils, ClipboardList, SprayCan, 
  CreditCard, Calendar, ShoppingBag
} from 'lucide-react';

// --- Receptionist Dashboard ---
export const ReceptionistDashboard: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    setBookings(DataService.getBookings());
  }, []);

  return (
    <div className="w-full p-6 space-y-6">
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

// --- Waiter Dashboard ---
export const WaiterDashboard: React.FC = () => {
  return (
    <div className="w-full p-6 space-y-6">
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

// --- Cook Dashboard ---
export const CookDashboard: React.FC = () => {
  return (
    <div className="w-full p-6 space-y-6">
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
      </div>
    </div>
  );
};

// --- Housekeeper Dashboard ---
export const HousekeeperDashboard: React.FC = () => {
  return (
    <div className="w-full p-6 space-y-6">
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

// --- Customer Dashboard ---
export const CustomerDashboard: React.FC = () => {
  return (
    <div className="w-full p-6 space-y-6">
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