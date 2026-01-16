import React, { useEffect, useState } from 'react';
import StatsCard from '../components/StatsCard';
import BookingModal from '../components/BookingModal';
import { DataService, Room, Booking } from '../services/dataService';
import { Calendar, LogOut, CreditCard, ShoppingBag, BedDouble, Search, XCircle } from 'lucide-react';
import clsx from 'clsx';

const CustomerDashboard: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  // Get current user info from simulated session
  const user = JSON.parse(localStorage.getItem('hms_user') || '{"name":"Demo User"}');

  const loadData = () => {
    setRooms(DataService.getRooms());
    setMyBookings(DataService.getBookingsByRole('Customer', user.name));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleBookClick = (room: Room) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  const handleConfirmBooking = (checkIn: string, checkOut: string, guestName: string) => {
    if (selectedRoom) {
      DataService.createBooking({
        roomId: selectedRoom.id,
        roomNumber: selectedRoom.id,
        guestName: guestName,
        userRole: 'Customer',
        checkIn,
        checkOut,
      });
      loadData(); // Refresh data to show new booking and updated room status
    }
  };

  const handleCancelBooking = (id: string) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      DataService.cancelBooking(id);
      loadData();
    }
  };

  const activeBooking = myBookings.find(b => b.status === 'Active' || b.status === 'Confirmed');

  return (
    <div className="w-full p-4 sm:p-6 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">My Stay</h2>
        {activeBooking && (
          <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full border border-green-200">
             Currently checked in: Room {activeBooking.roomNumber}
          </span>
        )}
      </div>
      
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard 
          title="Current Booking"
          stats={[
            { label: 'Room', value: activeBooking?.roomNumber || '--', icon: <Calendar className="w-4 h-4 text-blue-500"/> },
            { label: 'Checkout', value: activeBooking?.checkOut || '--', icon: <LogOut className="w-4 h-4 text-gray-500"/> }
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

      {/* Available Rooms Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
           <h3 className="text-xl font-bold text-gray-800">Available Rooms</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {rooms.filter(r => r.status === 'Vacant').map(room => (
            <div key={room.id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <span className="bg-green-50 text-green-700 text-xs font-bold px-2 py-1 rounded">
                  {room.type}
                </span>
                <span className="text-gray-400 text-xs">Floor {room.floor}</span>
              </div>
              <div className="mb-4">
                <h4 className="text-2xl font-bold text-gray-800">Room {room.id}</h4>
                <p className="text-green-600 font-semibold">${room.price} <span className="text-gray-400 font-normal text-xs">/night</span></p>
              </div>
              <button 
                onClick={() => handleBookClick(room)}
                className="w-full py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
              >
                <BedDouble className="w-4 h-4" /> Book Now
              </button>
            </div>
          ))}
          {rooms.filter(r => r.status === 'Vacant').length === 0 && (
            <div className="col-span-full py-8 text-center bg-white rounded-xl border border-dashed border-gray-200 text-gray-400">
              No rooms currently available.
            </div>
          )}
        </div>
      </div>

      {/* My Bookings List */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-800">My Bookings</h3>
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-500">
                <tr>
                  <th className="p-4 font-medium">Ref ID</th>
                  <th className="p-4 font-medium">Room</th>
                  <th className="p-4 font-medium">Dates</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {myBookings.length > 0 ? (
                  myBookings.map(booking => (
                    <tr key={booking.id} className="hover:bg-gray-50/50">
                      <td className="p-4 text-gray-600 font-mono text-xs">{booking.id}</td>
                      <td className="p-4 font-bold text-gray-800">{booking.roomNumber}</td>
                      <td className="p-4 text-gray-600">
                        <div className="flex flex-col">
                           <span>In: {booking.checkIn}</span>
                           <span>Out: {booking.checkOut}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={clsx(
                          "px-2 py-1 rounded-full text-xs font-bold",
                          booking.status === 'Confirmed' && "bg-blue-100 text-blue-700",
                          booking.status === 'Active' && "bg-green-100 text-green-700",
                          booking.status === 'Completed' && "bg-gray-100 text-gray-600",
                          booking.status === 'Cancelled' && "bg-red-50 text-red-600"
                        )}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {(booking.status === 'Confirmed' || booking.status === 'Active') && (
                          <button 
                            onClick={() => handleCancelBooking(booking.id)}
                            className="text-red-500 hover:text-red-700 text-xs font-medium bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-400">
                      You haven't made any bookings yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <BookingModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        room={selectedRoom}
        onConfirm={handleConfirmBooking}
        currentUserRole="Customer"
        currentUserName={user.name}
      />
    </div>
  );
};

export default CustomerDashboard;