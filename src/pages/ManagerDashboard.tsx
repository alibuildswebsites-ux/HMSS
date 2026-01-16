import React, { useEffect, useState } from 'react';
import { DataService, Room, Booking, Order } from '../services/dataService';
import StatsCard from '../components/StatsCard';
import BookingChart from '../components/BookingChart';
import { ClipboardList, CheckCircle, XCircle, Utensils, Clock } from 'lucide-react';

const ManagerDashboard: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    setRooms(DataService.getRooms());
    setBookings(DataService.getBookings());
    setOrders(DataService.getOrders());
  }, []);

  // Derived Statistics
  const vacant = rooms.filter(r => r.status === 'Vacant').length;
  const occupied = rooms.filter(r => r.status === 'Occupied').length;
  const notReady = rooms.filter(r => r.status === 'Not Ready').length;
  
  const total = rooms.length || 1;
  const vacantPct = (vacant / total) * 100;
  const occupiedPct = (occupied / total) * 100;

  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter(b => b.status === 'Confirmed' || b.status === 'Active').length;
  const cancelledBookings = bookings.filter(b => b.status === 'Cancelled').length;

  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  const servedOrders = orders.filter(o => o.status === 'Served').length;

  return (
    <div className="w-full max-w-full overflow-hidden p-4 sm:p-6 space-y-4 sm:space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Manager Overview</h2>
      
      {/* Top Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Booking Summary Stats */}
        <StatsCard 
            title="Bookings"
            stats={[
                { label: 'Total', value: totalBookings, icon: <ClipboardList className="w-4 h-4 text-blue-500"/> },
                { label: 'Active', value: confirmedBookings, icon: <CheckCircle className="w-4 h-4 text-green-500"/> },
            ]}
        />

        {/* Occupancy Stats */}
        <StatsCard 
            title="Occupancy"
            stats={[
                { label: 'Vacant', value: vacant, color: 'bg-green-800' },
                { label: 'Occupied', value: occupied, color: 'bg-green-500' },
            ]}
            mainVisual={
                <div className="h-2 w-full flex rounded-full overflow-hidden mt-4">
                    <div style={{ width: `${vacantPct}%` }} className="bg-green-900 h-full"></div>
                    <div style={{ width: `${occupiedPct}%` }} className="bg-green-500 h-full"></div>
                    <div className="flex-1 bg-green-100 h-full"></div>
                </div>
            }
        />

        {/* Restaurant Stats (NEW) */}
        <StatsCard 
            title="Restaurant"
            stats={[
                { label: 'Pending', value: pendingOrders, icon: <Clock className="w-4 h-4 text-yellow-500"/> },
                { label: 'Served', value: servedOrders, icon: <Utensils className="w-4 h-4 text-blue-500"/> },
            ]}
        />

        {/* Revenue Stats */}
        <StatsCard 
            title="Revenue"
            stats={[
                { label: 'Today', value: '$350' },
                { label: 'Month', value: '$4.5k' },
            ]}
        />
      </div>

      {/* Middle Row: Chart & Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow-sm border border-gray-100 w-full">
            <BookingChart />
        </div>

        {/* Recent Activity / Calendar */}
        <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col w-full">
            <h3 className="font-bold text-gray-800 text-lg mb-4">Recent Activity</h3>
            
            <div className="space-y-3 flex-1 overflow-y-auto max-h-56 sm:max-h-80 pr-1">
                {orders.slice(0, 3).map((order, i) => (
                    <div key={i} className="flex items-center p-3 rounded-lg bg-gray-50 border border-gray-100">
                         <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 mr-3 shrink-0">
                            <Utensils className="w-4 h-4"/>
                         </div>
                         <div>
                            <p className="text-xs font-bold text-gray-800">Order {order.id}</p>
                            <p className="text-[10px] text-gray-500">{order.status} • {order.tableOrRoom}</p>
                         </div>
                    </div>
                ))}
                {bookings.slice(0, 3).map((bk, i) => (
                    <div key={i} className="flex items-center p-3 rounded-lg bg-green-50 border border-green-100">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3 shrink-0">
                            <CheckCircle className="w-4 h-4"/>
                         </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-gray-800">Booking {bk.id}</p>
                            <p className="text-[10px] text-gray-500">{bk.guestName}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;