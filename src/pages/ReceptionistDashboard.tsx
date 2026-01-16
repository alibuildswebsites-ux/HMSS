import React, { useEffect, useState } from 'react';
import StatsCard from '../components/StatsCard';
import BookingModal from '../components/BookingModal';
import TaskModal from '../components/TaskModal';
import MaintenanceModal from '../components/MaintenanceModal';
import { DataService, Room, Booking, User, Task } from '../services/dataService';
import { Users, LogIn, LogOut, BedDouble, SprayCan, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';
import { AuthService } from '../services/authService';

const ReceptionistDashboard: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filterStatus, setFilterStatus] = useState<'All' | 'Vacant' | 'Occupied' | 'Not Ready'>('All');
  const [feedback, setFeedback] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  
  // Modals State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const currentUser = AuthService.getCurrentUser();

  const loadData = () => {
    setRooms(DataService.getRooms());
    setBookings(DataService.getBookings());
    setUsers(DataService.getUsers());
    setTasks(DataService.getHousekeepingTasks());
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  const handleBookClick = (room: Room) => {
    setSelectedRoom(room);
    setIsBookingModalOpen(true);
  };

  const handleConfirmBooking = (checkIn: string, checkOut: string, guestName: string) => {
    if (selectedRoom) {
      DataService.createBooking({
        roomId: selectedRoom.id,
        roomNumber: selectedRoom.id,
        guestName: guestName,
        userRole: 'Customer', // Created as customer booking
        checkIn,
        checkOut,
      });
      loadData();
      setFeedback({ message: 'Reservation created successfully.', type: 'success' });
    }
  };

  const handleCancelBooking = (id: string) => {
    if (window.confirm('Cancel this booking and release the room?')) {
      DataService.cancelBooking(id);
      loadData();
      setFeedback({ message: 'Reservation cancelled.', type: 'success' });
    }
  };

  const handleCreateTask = (roomId: string, assignee: string, type: 'Cleaning' | 'Deep Clean' | 'Inspection', date: string, notes: string) => {
      DataService.createHousekeepingTask({
          roomId,
          roomNumber: roomId,
          assignee,
          type,
          date,
          notes
      });
      loadData();
      setFeedback({ message: 'Cleaning task assigned.', type: 'success' });
  };

  const handleReportIssue = (roomId: string, description: string, priority: 'Low' | 'Medium' | 'High') => {
      DataService.createMaintenanceIssue({
          roomId,
          roomNumber: roomId,
          description,
          priority,
          reportedBy: currentUser?.name || 'Receptionist'
      });
      loadData();
      setFeedback({ message: 'Maintenance issue reported.', type: 'success' });
  };

  const filteredRooms = filterStatus === 'All' 
    ? rooms 
    : rooms.filter(r => r.status === filterStatus);
  
  const pendingTasks = tasks.filter(t => t.status === 'Pending').length;

  return (
    <div className="w-full p-4 sm:p-6 space-y-6 relative">
      {/* Feedback Toast */}
      {feedback && (
        <div className={clsx(
          "fixed top-20 right-4 z-50 px-4 py-2 rounded-lg shadow-lg text-white font-medium animate-in fade-in slide-in-from-top-2",
          feedback.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        )}>
          {feedback.message}
        </div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Reception Desk</h2>
        <div className="flex gap-2">
            <button 
                onClick={() => setIsMaintenanceModalOpen(true)}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm"
            >
                <AlertTriangle className="w-4 h-4" /> Report Issue
            </button>
            <button 
                onClick={() => setIsTaskModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm"
            >
                <SprayCan className="w-4 h-4" /> Assign Cleaning
            </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard 
          title="Today's Activity"
          stats={[
            { label: 'Check-ins', value: bookings.filter(b => b.status === 'Confirmed').length, icon: <LogIn className="w-4 h-4 text-green-500"/> },
            { label: 'Check-outs', value: bookings.filter(b => b.status === 'Active').length, icon: <LogOut className="w-4 h-4 text-red-500"/> }
          ]}
        />
        <StatsCard 
          title="Occupancy"
          stats={[
             { label: 'Total Guests', value: bookings.filter(b => b.status === 'Active').length, icon: <Users className="w-4 h-4 text-blue-500"/> }
          ]}
        />
        <StatsCard 
          title="Housekeeping"
          stats={[
            { label: 'Pending Tasks', value: pendingTasks, icon: <SprayCan className="w-4 h-4 text-orange-500"/> }
          ]}
        />
      </div>

      {/* Room Management */}
      <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                <BedDouble className="w-5 h-5 text-gray-500"/> Room Status
            </h3>
            <div className="flex gap-2">
                {(['All', 'Vacant', 'Occupied', 'Not Ready'] as const).map(status => (
                    <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={clsx(
                            "px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors border",
                            filterStatus === status 
                                ? "bg-gray-900 text-white border-gray-900" 
                                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                        )}
                    >
                        {status}
                    </button>
                ))}
            </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {filteredRooms.map(room => (
                <div key={room.id} className={clsx(
                    "p-3 rounded-lg border flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:scale-[1.02]",
                    room.status === 'Vacant' ? "bg-green-50 border-green-100 hover:border-green-300" :
                    room.status === 'Occupied' ? "bg-red-50 border-red-100 opacity-90" :
                    "bg-orange-50 border-orange-200 opacity-90"
                )}
                onClick={() => room.status === 'Vacant' && handleBookClick(room)}
                >
                    <span className="text-lg font-bold text-gray-800">{room.id}</span>
                    <span className={clsx(
                        "text-[10px] font-bold uppercase mt-1 px-1.5 py-0.5 rounded",
                        room.status === 'Vacant' ? "text-green-700 bg-green-100" :
                        room.status === 'Occupied' ? "text-red-700 bg-red-100" :
                        "text-orange-700 bg-orange-100"
                    )}>{room.status}</span>
                    <span className="text-[10px] text-gray-400 mt-1">{room.type}</span>
                </div>
            ))}
        </div>
      </div>

      {/* All Bookings Table */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-800">All Bookings</h3>
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-500">
                <tr>
                  <th className="p-4 font-medium">Ref ID</th>
                  <th className="p-4 font-medium">Guest</th>
                  <th className="p-4 font-medium">Room</th>
                  <th className="p-4 font-medium">Check In</th>
                  <th className="p-4 font-medium">Check Out</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bookings.map(booking => (
                    <tr key={booking.id} className="hover:bg-gray-50/50">
                      <td className="p-4 text-gray-500 font-mono text-xs">{booking.id}</td>
                      <td className="p-4 font-medium text-gray-900">{booking.guestName}</td>
                      <td className="p-4 font-bold text-gray-800">{booking.roomNumber}</td>
                      <td className="p-4 text-gray-600">{booking.checkIn}</td>
                      <td className="p-4 text-gray-600">{booking.checkOut}</td>
                      <td className="p-4">
                        <span className={clsx(
                          "px-2 py-1 rounded-full text-xs font-bold",
                          booking.status === 'Confirmed' && "bg-blue-100 text-blue-700",
                          booking.status === 'Active' && "bg-green-100 text-green-700",
                          booking.status === 'Cancelled' && "bg-red-50 text-red-600",
                          booking.status === 'Completed' && "bg-gray-100 text-gray-600",
                        )}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {(booking.status === 'Confirmed' || booking.status === 'Active') && (
                          <button 
                            onClick={() => handleCancelBooking(booking.id)}
                            className="text-red-600 hover:text-red-800 text-xs font-medium hover:underline"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <BookingModal 
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        room={selectedRoom}
        onConfirm={handleConfirmBooking}
        currentUserRole="Receptionist"
        currentUserName=""
      />

      <TaskModal 
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        rooms={rooms}
        staff={users}
        onConfirm={handleCreateTask}
      />

      <MaintenanceModal 
        isOpen={isMaintenanceModalOpen}
        onClose={() => setIsMaintenanceModalOpen(false)}
        rooms={rooms}
        onConfirm={handleReportIssue}
        reporterName={currentUser?.name || 'Receptionist'}
      />
    </div>
  );
};

export default ReceptionistDashboard;