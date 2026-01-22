import React, { useEffect, useState } from 'react';
import { DataService, Room, Booking, Order, Issue, User } from '../services/dataService';
import { AuthService } from '../services/authService';
import StatsCard from '../components/StatsCard';
import BookingChart from '../components/BookingChart';
import AnalyticsCharts from '../components/AnalyticsCharts';
import { ClipboardList, CheckCircle, Utensils, Clock, AlertTriangle, Wrench, LayoutDashboard, FileText, SprayCan, BedDouble, Users, UserPlus, Ban } from 'lucide-react';
import clsx from 'clsx';

interface ManagerDashboardProps {
  initialTab?: 'overview' | 'reports' | 'staff';
}

const ManagerDashboard: React.FC<ManagerDashboardProps> = ({ initialTab = 'overview' }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'reports' | 'staff'>(initialTab);
  
  // Overview Data
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  
  // Staff Data
  const [staffList, setStaffList] = useState<User[]>([]);
  const [newStaff, setNewStaff] = useState({ name: '', email: '', password: '', role: 'Receptionist' });
  const [staffError, setStaffError] = useState('');
  const [staffSuccess, setStaffSuccess] = useState('');

  // Analytics Data
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    const loadData = () => {
        setRooms(DataService.getRooms());
        setBookings(DataService.getBookings());
        setOrders(DataService.getOrders());
        setIssues(DataService.getMaintenanceIssues());
        // Filter out Customers, only show staff (Manager included in list, though generally we don't manage other managers here, it's good for visibility)
        setStaffList(DataService.getUsers().filter(u => u.role !== 'Customer'));
        setAnalytics(DataService.getAnalytics());
    };

    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCreateStaff = (e: React.FormEvent) => {
      e.preventDefault();
      setStaffError('');
      setStaffSuccess('');
      
      if (!newStaff.name || !newStaff.email || !newStaff.password) {
          setStaffError('All fields are required');
          return;
      }

      if (newStaff.role === 'Manager') {
          setStaffError('Cannot create Manager accounts via this form');
          return;
      }

      // Register creates a user with 'Customer' role by default
      const result = AuthService.register(newStaff.name, newStaff.email, newStaff.password);
      
      if (typeof result === 'string') {
          setStaffError(result);
      } else {
          // Successfully created user, now update role from default 'Customer' to selected staff role
          const updatedUser = { ...result, role: newStaff.role };
          DataService.updateUser(updatedUser);
          
          // Refresh local state
          setStaffList(DataService.getUsers().filter(u => u.role !== 'Customer'));
          setStaffSuccess(`Staff member ${newStaff.name} created successfully as ${newStaff.role}.`);
          setNewStaff({ name: '', email: '', password: '', role: 'Receptionist' });
      }
  };

  if (!analytics) return <div className="p-6">Loading...</div>;

  // Overview Derived Stats
  const vacant = rooms.filter(r => r.status === 'Vacant').length;
  const occupied = rooms.filter(r => r.status === 'Occupied').length;
  const total = rooms.length || 1;
  const vacantPct = (vacant / total) * 100;
  const occupiedPct = (occupied / total) * 100;

  const renderOverview = () => (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-300">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow-sm border border-gray-100 w-full">
            <BookingChart bookings={bookings} />
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
        <StatsCard 
            title="Booking Analytics"
            stats={[
                { label: 'Occupancy', value: `${analytics.occupancy.rate}%`, icon: <BedDouble className="w-4 h-4 text-purple-500"/> },
                { label: 'Confirmed', value: analytics.bookings.confirmed, icon: <CheckCircle className="w-4 h-4 text-green-500"/> },
                { label: 'Cancelled', value: analytics.bookings.cancelled, icon: <Ban className="w-4 h-4 text-red-500"/> },
            ]}
        />
        <StatsCard 
            title="Restaurant Analytics"
            stats={[
                { label: 'Total Orders', value: analytics.orders.total, icon: <Utensils className="w-4 h-4 text-blue-500"/> },
                { label: 'Served', value: analytics.orders.served, icon: <CheckCircle className="w-4 h-4 text-green-500"/> },
            ]}
        />
        <StatsCard 
            title="Housekeeping Analytics"
            stats={[
                { label: 'Completed', value: analytics.housekeeping.completed, icon: <CheckCircle className="w-4 h-4 text-green-500"/> },
                { label: 'Pending', value: analytics.housekeeping.pending, icon: <SprayCan className="w-4 h-4 text-orange-500"/> },
                { label: 'In Progress', value: analytics.housekeeping.inProgress, icon: <Clock className="w-4 h-4 text-blue-500"/> },
            ]}
        />
        <StatsCard 
            title="Maintenance Analytics"
            stats={[
                { label: 'Open', value: analytics.maintenance.open, icon: <AlertTriangle className="w-4 h-4 text-red-500"/> },
                { label: 'In Progress', value: analytics.maintenance.inProgress, icon: <Clock className="w-4 h-4 text-orange-500"/> },
                { label: 'Resolved', value: analytics.maintenance.resolved, icon: <Wrench className="w-4 h-4 text-green-500"/> },
            ]}
        />
      </div>
      <AnalyticsCharts 
        bookingData={analytics.bookings} 
        orderData={analytics.orders} 
      />
    </div>
  );

  const renderStaff = () => (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
          {/* Create Staff Form */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-fit">
              <h3 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-green-600"/> Add Staff
              </h3>
              <form onSubmit={handleCreateStaff} className="space-y-4">
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input 
                          type="text"
                          value={newStaff.name}
                          onChange={e => setNewStaff({...newStaff, name: e.target.value})}
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500/20 outline-none"
                          required
                      />
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input 
                          type="email"
                          value={newStaff.email}
                          onChange={e => setNewStaff({...newStaff, email: e.target.value})}
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500/20 outline-none"
                          required
                      />
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                      <select 
                          value={newStaff.role}
                          onChange={e => setNewStaff({...newStaff, role: e.target.value})}
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500/20 outline-none bg-white"
                      >
                          <option value="Receptionist">Receptionist</option>
                          <option value="Waiter">Waiter</option>
                          <option value="Cook">Cook</option>
                          <option value="Housekeeper">Housekeeper</option>
                      </select>
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                      <input 
                          type="password"
                          value={newStaff.password}
                          onChange={e => setNewStaff({...newStaff, password: e.target.value})}
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500/20 outline-none"
                          required
                      />
                  </div>
                  
                  {staffError && <div className="text-red-500 text-sm">{staffError}</div>}
                  {staffSuccess && <div className="text-green-600 text-sm">{staffSuccess}</div>}
                  
                  <button type="submit" className="w-full bg-green-600 text-white font-bold py-2 rounded-lg hover:bg-green-700 transition-colors">
                      Create Staff
                  </button>
              </form>
          </div>

          {/* Staff List */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600"/> Current Staff
              </h3>
              <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                      <thead className="bg-gray-50 border-b border-gray-100 text-gray-500">
                          <tr>
                              <th className="p-3">Name</th>
                              <th className="p-3">Email</th>
                              <th className="p-3">Role</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                          {staffList.map(staff => (
                              <tr key={staff.id} className="hover:bg-gray-50/50">
                                  <td className="p-3 font-medium text-gray-900">{staff.name}</td>
                                  <td className="p-3 text-gray-600">{staff.email}</td>
                                  <td className="p-3">
                                      <span className={clsx(
                                          "px-2 py-1 rounded-full text-xs font-bold",
                                          staff.role === 'Manager' && "bg-purple-100 text-purple-700",
                                          staff.role === 'Receptionist' && "bg-blue-100 text-blue-700",
                                          staff.role === 'Cook' && "bg-red-100 text-red-700",
                                          staff.role === 'Waiter' && "bg-orange-100 text-orange-700",
                                          staff.role === 'Housekeeper' && "bg-green-100 text-green-700",
                                      )}>
                                          {staff.role}
                                      </span>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </div>
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
            <button 
                onClick={() => setActiveTab('staff')}
                className={clsx(
                    "px-4 py-1.5 text-sm font-semibold rounded-md transition-all flex items-center gap-2",
                    activeTab === 'staff' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                )}
            >
                <Users className="w-4 h-4" /> Staff
            </button>
        </div>
      </div>

      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'reports' && renderReports()}
      {activeTab === 'staff' && renderStaff()}
    </div>
  );
};

export default ManagerDashboard;