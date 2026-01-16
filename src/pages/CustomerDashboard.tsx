import React, { useEffect, useState } from 'react';
import StatsCard from '../components/StatsCard';
import BookingModal from '../components/BookingModal';
import OrderModal from '../components/OrderModal';
import { DataService, Room, Booking, Order, MenuItem } from '../services/dataService';
import { AuthService } from '../services/authService';
import { Calendar, LogOut, CreditCard, ShoppingBag, BedDouble, Search, CheckCircle, Utensils, Ban } from 'lucide-react';
import clsx from 'clsx';

const CustomerDashboard: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [filter, setFilter] = useState<'All' | 'Available'>('Available');
  const [feedback, setFeedback] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  // Get current user via AuthService
  const user = AuthService.getCurrentUser();

  const loadData = () => {
    if (!user) return;
    setRooms(DataService.getRooms());
    setMyBookings(DataService.getBookingsByRole('Customer', user.name));
    setMyOrders(DataService.getOrdersByRole('Customer', user.name));
    setMenu(DataService.getMenu());
  };

  useEffect(() => {
    loadData();
    // Poll all data to keep rooms and order status in sync
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, [user?.name]);

  // Clear feedback after 3 seconds
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  if (!user) return null;

  // --- Booking Handlers ---
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
        userRole: 'Customer',
        checkIn,
        checkOut,
      });
      loadData();
      setFeedback({ message: 'Room booked successfully!', type: 'success' });
    }
  };

  const handleCancelBooking = (id: string) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      DataService.cancelBooking(id);
      loadData();
      setFeedback({ message: 'Booking cancelled successfully.', type: 'success' });
    }
  };

  // --- Order Handlers ---
  const handleCreateOrder = (cartItems: { item: MenuItem; qty: number }[], location: string) => {
    const items = cartItems.map(c => ({
      id: c.item.id,
      item: c.item.item,
      price: c.item.price,
      qty: c.qty
    }));
    
    DataService.createOrder({
      items,
      total: items.reduce((sum, i) => sum + (i.price * i.qty), 0),
      tableOrRoom: location,
      orderedBy: user.name
    });
    loadData();
    setFeedback({ message: 'Order placed successfully!', type: 'success' });
  };

  const handleCancelOrder = (id: string) => {
    if (window.confirm('Cancel this food order?')) {
        DataService.updateOrderStatus(id, 'Cancelled');
        loadData();
        setFeedback({ message: 'Order cancelled.', type: 'success' });
    }
  };

  const activeBooking = myBookings.find(b => b.status === 'Active' || b.status === 'Confirmed');
  const activeOrdersCount = myOrders.filter(o => ['Pending', 'Preparing', 'Ready'].includes(o.status)).length;

  const displayedRooms = rooms.filter(r => {
    if (filter === 'Available') return r.status === 'Vacant';
    return true;
  });

  return (
    <div className="w-full p-4 sm:p-6 space-y-8 relative">
       {/* Feedback Toast */}
       {feedback && (
        <div className={clsx(
          "fixed top-20 right-4 z-50 px-4 py-2 rounded-lg shadow-lg text-white font-medium animate-in fade-in slide-in-from-top-2",
          feedback.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        )}>
          {feedback.message}
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">My Stay</h2>
        <div className="flex gap-2">
            {activeBooking && (
            <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full border border-green-200">
                Checked in: Room {activeBooking.roomNumber}
            </span>
            )}
            <button 
                onClick={() => setIsOrderModalOpen(true)}
                className="bg-gray-900 text-white px-4 py-1 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-800 transition-colors"
            >
                <Utensils className="w-4 h-4" /> Room Service
            </button>
        </div>
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
            { label: 'Active Orders', value: activeOrdersCount, icon: <ShoppingBag className="w-4 h-4 text-orange-500"/> }
          ]}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* My Bookings */}
        <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800">My Bookings</h3>
            <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b border-gray-100 text-gray-500">
                    <tr>
                    <th className="p-3 font-medium">Room</th>
                    <th className="p-3 font-medium">Dates</th>
                    <th className="p-3 font-medium">Status</th>
                    <th className="p-3 font-medium text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {myBookings.length > 0 ? (
                    myBookings.map(booking => (
                        <tr key={booking.id} className="hover:bg-gray-50/50">
                        <td className="p-3 font-bold text-gray-800">{booking.roomNumber}</td>
                        <td className="p-3 text-gray-600 text-xs">
                           {booking.checkIn}<br/>{booking.checkOut}
                        </td>
                        <td className="p-3">
                            <span className={clsx(
                            "px-2 py-1 rounded-full text-[10px] font-bold",
                            booking.status === 'Confirmed' && "bg-blue-100 text-blue-700",
                            booking.status === 'Active' && "bg-green-100 text-green-700",
                            booking.status === 'Completed' && "bg-gray-100 text-gray-600",
                            booking.status === 'Cancelled' && "bg-red-50 text-red-600"
                            )}>
                            {booking.status}
                            </span>
                        </td>
                        <td className="p-3 text-right">
                            {(booking.status === 'Confirmed' || booking.status === 'Active') && (
                            <button 
                                onClick={() => handleCancelBooking(booking.id)}
                                className="text-red-500 hover:text-red-700 text-xs font-medium"
                            >
                                Cancel
                            </button>
                            )}
                        </td>
                        </tr>
                    ))
                    ) : (
                    <tr>
                        <td colSpan={4} className="p-6 text-center text-gray-400">No bookings yet.</td>
                    </tr>
                    )}
                </tbody>
                </table>
            </div>
            </div>
        </div>

        {/* My Food Orders */}
        <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800">My Orders</h3>
            <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b border-gray-100 text-gray-500">
                    <tr>
                    <th className="p-3 font-medium">Items</th>
                    <th className="p-3 font-medium">Total</th>
                    <th className="p-3 font-medium">Status</th>
                    <th className="p-3 font-medium text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {myOrders.length > 0 ? (
                    myOrders.map(order => (
                        <tr key={order.id} className="hover:bg-gray-50/50">
                        <td className="p-3 text-gray-600 text-xs">
                             {order.items.map(i => `${i.qty}x ${i.item}`).join(', ')}
                        </td>
                        <td className="p-3 font-bold text-gray-800">${order.total}</td>
                        <td className="p-3">
                            <span className={clsx(
                            "px-2 py-1 rounded-full text-[10px] font-bold",
                            order.status === 'Pending' && "bg-gray-100 text-gray-600",
                            order.status === 'Preparing' && "bg-yellow-100 text-yellow-700",
                            order.status === 'Ready' && "bg-green-100 text-green-700",
                            order.status === 'Served' && "bg-blue-100 text-blue-700",
                            order.status === 'Cancelled' && "bg-red-50 text-red-600"
                            )}>
                            {order.status}
                            </span>
                        </td>
                        <td className="p-3 text-right">
                            {order.status === 'Pending' && (
                            <button 
                                onClick={() => handleCancelOrder(order.id)}
                                className="text-red-500 hover:text-red-700 text-xs font-medium"
                            >
                                Cancel
                            </button>
                            )}
                        </td>
                        </tr>
                    ))
                    ) : (
                    <tr>
                        <td colSpan={4} className="p-6 text-center text-gray-400">No food orders yet.</td>
                    </tr>
                    )}
                </tbody>
                </table>
            </div>
            </div>
        </div>

      </div>

      {/* Available Rooms Section */}
      <div className="space-y-4">
        <div className="flex flex-wrap justify-between items-center gap-4">
           <h3 className="text-xl font-bold text-gray-800">Available Rooms</h3>
           <div className="flex bg-gray-100 rounded-lg p-1">
             <button onClick={() => setFilter('Available')} className={clsx("px-4 py-1.5 text-xs font-semibold rounded-md transition-all", filter === 'Available' ? "bg-white text-green-700 shadow-sm" : "text-gray-500")}>Available</button>
             <button onClick={() => setFilter('All')} className={clsx("px-4 py-1.5 text-xs font-semibold rounded-md transition-all", filter === 'All' ? "bg-white text-gray-800 shadow-sm" : "text-gray-500")}>All Rooms</button>
           </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {displayedRooms.map(room => (
            <div key={room.id} className={clsx("border rounded-xl p-4 shadow-sm relative overflow-hidden transition-all", room.status === 'Vacant' ? "bg-white hover:shadow-md" : "bg-gray-50 opacity-75")}>
                {room.status === 'Occupied' && (
                    <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">
                        OCCUPIED
                    </div>
                )}
                <div className="mb-4">
                  <h4 className="text-xl font-bold text-gray-800">Room {room.id}</h4>
                  <p className="text-green-600 font-semibold">${room.price} <span className="text-gray-400 font-normal text-xs">/night</span></p>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded mt-2 inline-block">{room.type}</span>
                </div>
                <button 
                  onClick={() => handleBookClick(room)}
                  disabled={room.status !== 'Vacant'}
                  className={clsx("w-full py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors", room.status === 'Vacant' ? "bg-gray-900 text-white hover:bg-gray-800" : "bg-gray-200 text-gray-400 cursor-not-allowed")}
                >
                  <BedDouble className="w-4 h-4" /> {room.status === 'Vacant' ? 'Book Now' : 'Unavailable'}
                </button>
            </div>
          ))}
        </div>
      </div>

      <BookingModal 
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        room={selectedRoom}
        onConfirm={handleConfirmBooking}
        currentUserRole="Customer"
        currentUserName={user.name}
      />

      <OrderModal 
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        menuItems={menu}
        onConfirm={handleCreateOrder}
        role="Customer"
        defaultLocation={activeBooking?.roomNumber}
      />
    </div>
  );
};

export default CustomerDashboard;