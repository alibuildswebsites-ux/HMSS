import React, { useEffect, useState } from 'react';
import { DataService, Room, Booking, Order, Issue } from '../services/dataService';
import StatsCard from '../components/StatsCard';
import BookingChart from '../components/BookingChart';
import { ClipboardList, CheckCircle, Utensils, Clock, Flame, Ban, AlertTriangle, Wrench } from 'lucide-react';

const ManagerDashboard: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);

  useEffect(() => {
    setRooms(DataService.getRooms());
    setBookings(DataService.getBookings());
    setOrders(DataService.getOrders());
    setIssues(DataService.getMaintenanceIssues());
  }, []);

  // Derived Statistics
  const vacant = rooms.filter(r => r.status === 'Vacant').length;
  const occupied = rooms.filter(r => r.status === 'Occupied').length;
  
  const total = rooms.length || 1;
  const vacantPct = (vacant / total) * 100;
  const occupiedPct = (occupied / total) * 100;

  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter(b => b.status === 'Confirmed' || b.status === 'Active').length;

  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  const servedOrders = orders.filter(o => o.status === 'Served').length;

  const openIssues = issues.filter(i => i.status === 'Open').length;
  const resolvedIssues = issues.filter(i => i.status === 'Resolved').length;

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

        {/* Restaurant Stats */}
        <StatsCard 
            title="Kitchen Status"
            stats={[
                { label: 'Pending', value: pendingOrders, icon: <Clock className="w-4 h-4 text-red-500"/> },
                { label: 'Served', value: servedOrders, icon: <Utensils className="w-4 h-4 text-blue-500"/> },
            ]}
        />

        {/* Maintenance Stats */}
        <StatsCard 
            title="Maintenance"
            stats={[
                { label: 'Open Issues', value: openIssues, icon: <AlertTriangle className="w-4 h-4 text-orange-500"/> },
                { label: 'Resolved', value: resolvedIssues, icon: <Wrench className="w-4 h-4 text-green-500"/> },
            ]}
        />
      </div>

      {/* Middle Row: Chart & Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow-sm border border-gray-100 w-full">
            <BookingChart />
        </div>

        {/* Recent Activity / Issues */}
        <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col w-full">
            <h3 className="font-bold text-gray-800 text-lg mb-4">Maintenance Log</h3>
            
            <div className="space-y-3 flex-1 overflow-y-auto max-h-56 sm:max-h-80 pr-1">
                {issues.length > 0 ? issues.slice(0, 4).map((issue, i) => (
                    <div key={i} className="flex items-start p-3 rounded-lg bg-gray-50 border border-gray-100">
                         <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 shrink-0 ${issue.priority === 'High' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                            <AlertTriangle className="w-4 h-4"/>
                         </div>
                         <div className="min-w-0">
                            <p className="text-xs font-bold text-gray-800">Room {issue.roomNumber}</p>
                            <p className="text-[10px] text-gray-500 truncate">{issue.description}</p>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded mt-1 inline-block font-medium ${issue.status === 'Open' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{issue.status}</span>
                         </div>
                    </div>
                )) : (
                    <p className="text-gray-400 text-xs text-center py-4">No active maintenance issues.</p>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;