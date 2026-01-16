import React, { useEffect, useState } from 'react';
import { DataService, Room, Booking } from '../services/dataService';
import StatsCard from '../components/StatsCard';
import BookingChart from '../components/BookingChart';
import { Home, LogIn, LogOut, BedDouble, SprayCan } from 'lucide-react';

const ManagerDashboard: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    setRooms(DataService.getRooms());
    setBookings(DataService.getBookings());
  }, []);

  // Derived Statistics
  const vacant = rooms.filter(r => r.status === 'Vacant').length;
  const occupied = rooms.filter(r => r.status === 'Occupied').length;
  const notReady = rooms.filter(r => r.status === 'Not Ready').length;
  
  // Calculate width for occupancy bar
  const total = rooms.length || 1;
  const vacantPct = (vacant / total) * 100;
  const occupiedPct = (occupied / total) * 100;

  return (
    <div className="w-full max-w-full overflow-hidden p-4 sm:p-6 space-y-4 sm:space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Manager Overview</h2>
      
      {/* Top Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Reservation Stats */}
        <StatsCard 
            title="Reservation"
            stats={[
                { label: 'In home', value: bookings.length, icon: <Home className="w-4 h-4"/> },
                { label: 'Arrival', value: 14, icon: <LogIn className="w-4 h-4 text-green-500"/> },
                { label: 'Departure', value: 27, icon: <LogOut className="w-4 h-4 text-red-400"/> },
            ]}
            mainVisual={
                <div className="mt-4 flex flex-wrap gap-4 sm:gap-6">
                     <div className="flex items-center gap-2">
                        <SprayCan className="w-5 h-5 text-gray-400" />
                        <div>
                            <p className="text-xs text-gray-500">Rented & dirty</p>
                            <p className="font-bold text-gray-800 text-sm">14</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-2">
                        <BedDouble className="w-5 h-5 text-gray-400" />
                        <div>
                            <p className="text-xs text-gray-500">Vacant & dirty</p>
                            <p className="font-bold text-gray-800 text-sm">27</p>
                        </div>
                     </div>
                </div>
            }
        />

        {/* Occupancy Stats */}
        <StatsCard 
            title="Occupancy"
            stats={[
                { label: 'Vacant', value: vacant, color: 'bg-green-800' },
                { label: 'Occupied', value: occupied, color: 'bg-green-500' },
                { label: 'Not ready', value: notReady, color: 'bg-green-200' },
            ]}
            mainVisual={
                <div className="h-12 w-full flex rounded-lg overflow-hidden mt-2">
                    <div style={{ width: `${vacantPct}%` }} className="bg-green-900 h-full"></div>
                    <div style={{ width: `${occupiedPct}%` }} className="bg-green-500 h-full"></div>
                    <div className="flex-1 bg-green-100 h-full"></div>
                </div>
            }
        />

        {/* Revenue Stats */}
        <StatsCard 
            title="Revenue"
            stats={[
                { label: 'Last 30 days', value: 'USD 1,500' },
                { label: 'Yesterday', value: 'USD 350' },
            ]}
             mainVisual={
                 <div className="flex justify-end mt-4">
                     <a href="#" className="text-xs text-gray-400 hover:text-green-600 p-2">Details &gt;&gt;</a>
                 </div>
             }
        />
      </div>

      {/* Middle Row: Chart & Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow-sm border border-gray-100 w-full">
            <BookingChart />
        </div>

        {/* Calendar Section */}
        <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col w-full">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800 text-lg sm:text-xl">Calendar</h3>
                <button className="text-xs text-green-600 font-medium cursor-pointer p-1">&lt; March &gt;</button>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
                <button className="bg-gray-900 text-white text-[10px] px-3 py-2 rounded-full h-8">1 Bed (6)</button>
                <button className="bg-white border border-gray-200 text-gray-500 text-[10px] px-3 py-2 rounded-full h-8">2 Beds (12)</button>
                <button className="bg-white border border-gray-200 text-gray-500 text-[10px] px-3 py-2 rounded-full h-8">3 Beds (15)</button>
            </div>

            <div className="flex gap-1 mb-4 overflow-x-auto pb-2 no-scrollbar">
                {['#1012', '#1013', '#1014', '#1022', '#1023'].map(room => (
                    <span key={room} className={`text-[10px] px-2 py-1 rounded border whitespace-nowrap ${room === '#1014' ? 'border-gray-800 text-gray-900 font-bold' : 'border-gray-100 text-gray-400'}`}>{room}</span>
                ))}
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto max-h-56 sm:max-h-80 pr-1">
                {bookings.slice(0, 3).map((bk, i) => (
                    <div key={i} className={`flex items-center p-3 rounded-lg ${i % 2 === 0 ? 'bg-green-50/50' : 'bg-gray-50'}`}>
                        <div className="w-10 text-center mr-3 border-r border-gray-200 pr-3 shrink-0">
                            <span className="block text-xs font-bold text-gray-700">{13 + i}</span>
                            <span className="block text-[10px] text-gray-400">Wed</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-800 truncate">{bk.guestName}</p>
                        </div>
                        <img src={`https://picsum.photos/30/30?random=${i}`} className="w-6 h-6 rounded-full shrink-0" alt="guest" />
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;