import React, { useEffect, useState } from 'react';
import { DataService, Room, Booking, Order, Issue } from '../services/dataService';
import StatsCard from '../components/StatsCard';
import BookingChart from '../components/BookingChart';
import AnalyticsCharts from '../components/AnalyticsCharts';
import { ClipboardList, CheckCircle, Utensils, Clock, Flame, Ban, AlertTriangle, Wrench, LayoutDashboard, FileText, SprayCan } from 'lucide-react';
import clsx from 'clsx';

interface ManagerDashboardProps {
  initialTab?: 'overview' | 'reports';
}

const ManagerDashboard: React.FC<ManagerDashboardProps> = ({ initialTab = 'overview' }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'reports'>(initialTab);
  
  // Overview Data
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  
  // Analytics Data
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    // Set active tab based on prop if changed
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    const loadData = () => {
        // Fetch raw data for overview
        setRooms(DataService.getRooms());
        setBookings(DataService.getBookings());
        setOrders(DataService.getOrders());
        setIssues(DataService.getMaintenanceIssues());

        // Fetch analytics
        setAnalytics(DataService.getAnalytics());
    };

    loadData();
    const interval = setInterval(loadData, 5000); // Refresh data
    return () => clearInterval(interval);
  }, []);

  if (!analytics) return <div className="p-6">Loading...</div>;

  // Overview Derived Stats
  const vacant = rooms.filter(r => r.status === 'Vacant').length;
  const occupied = rooms.filter(r => r.status === 'Occupied').length;
  const total = rooms.length || 1;
  const vacantPct = (vacant / total) * 100;
  const occupiedPct = (occupied / total) * 100;

  const renderOverview = () => (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-300">
      {/* Top Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
            title="Bookings"
            stats={[
                { label: 'Total', value: bookings.length, icon: <ClipboardList className="w-4 h-4 text-blue-500"/> },
                { label: 'Active', value: bookings.filter(b => b.status === 'Confirmed' || b.status === 'Active').length, icon: <CheckCircle className="w-4 h-4 text-green-500"/> },
            ]}
        />
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
        <StatsCard 
            title="Kitchen Status"
            stats={[
                { label: 'Pending', value: orders.filter(o => o.status === 'Pending').length, icon: <Clock className="w-4 h-4 text-red-500"/> },
                { label: 'Served', value: orders.filter(o => o.status === 'Served').length, icon: <Utensils className="w-4 h-4 text-blue-500"/> },
            ]}
        />
        <StatsCard 
            title="Maintenance"
            stats={[
                { label: 'Open Issues', value: issues.filter(i => i.status === 'Open').length, icon: <AlertTriangle className="w-4 h-4 text-orange-500"/> },
                { label: 'Resolved', value: issues.filter(i => i.status === 'Resolved').length, icon: <Wrench className="w-4 h-4 text-green-500"/> },
            ]}
        />
      </div>

      {/* Middle Row: Chart & Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow-sm border border-gray-100 w-full">
            <BookingChart />
        </div>
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

  const renderReports = () => (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Booking KPIs */}
        <StatsCard 
            title="Booking Analytics"
            stats={[
                { label: 'Confirmed', value: analytics.bookings.confirmed, icon: <CheckCircle className="w-4 h-4 text-green-500"/> },
                { label: 'Cancelled', value: analytics.bookings.cancelled, icon: <Ban className="w-4 h-4 text-red-500"/> },
            ]}
        />
        {/* Restaurant KPIs */}
        <StatsCard 
            title="Restaurant Analytics"
            stats={[
                { label: 'Total Orders', value: analytics.orders.total, icon: <Utensils className="w-4 h-4 text-blue-500"/> },
                { label: 'Served', value: analytics.orders.served, icon: <CheckCircle className="w-4 h-4 text-green-500"/> },
            ]}
        />
        {/* Housekeeping KPIs */}
        <StatsCard 
            title="Housekeeping Analytics"
            stats={[
                { label: 'Completed', value: analytics.housekeeping.completed, icon: <CheckCircle className="w-4 h-4 text-green-500"/> },
                { label: 'Pending', value: analytics.housekeeping.pending, icon: <SprayCan className="w-4 h-4 text-orange-500"/> },
            ]}
        />
        {/* Maintenance KPIs */}
        <StatsCard 
            title="Maintenance Analytics"
            stats={[
                { label: 'Open Issues', value: analytics.maintenance.open, icon: <AlertTriangle className="w-4 h-4 text-red-500"/> },
                { label: 'Resolved', value: analytics.maintenance.resolved, icon: <Wrench className="w-4 h-4 text-green-500"/> },
            ]}
        />
      </div>

      {/* Charts Section */}
      <AnalyticsCharts 
        bookingData={analytics.bookings} 
        orderData={analytics.orders} 
      />
    </div>
  );

  return (
    <div className="w-full max-w-full overflow-hidden p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Manager Dashboard</h2>
        <div className="flex bg-gray-100 p-1 rounded-lg">
            <button 
                onClick={() => setActiveTab('overview')}
                className={clsx(
                    "px-4 py-1.5 text-sm font-semibold rounded-md transition-all flex items-center gap-2",
                    activeTab === 'overview' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                )}
            >
                <LayoutDashboard className="w-4 h-4" /> Overview
            </button>
            <button 
                onClick={() => setActiveTab('reports')}
                className={clsx(
                    "px-4 py-1.5 text-sm font-semibold rounded-md transition-all flex items-center gap-2",
                    activeTab === 'reports' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                )}
            >
                <FileText className="w-4 h-4" /> Reports
            </button>
        </div>
      </div>

      {activeTab === 'overview' ? renderOverview() : renderReports()}
    </div>
  );
};

export default ManagerDashboard;