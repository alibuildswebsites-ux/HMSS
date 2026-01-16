import React, { useEffect, useState } from 'react';
import { DataService, Room, Booking } from '../services/dataService';
import StatsCard from '../components/StatsCard';
import BookingChart from '../components/BookingChart';
import { Home, LogIn, LogOut, BedDouble, SprayCan } from 'lucide-react';

const Dashboard: React.FC = () => {
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
    <div className="p-4 sm:p-6 space-y-6 max-w-full overflow-hidden">
      {/* Top Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        
        {/* Reservation Stats */}
        <StatsCard 
            title="Reservation"
            stats={[
                { label: 'In home', value: bookings.length, icon: <Home className="w-4 h-4"/> },
                { label: 'Arrival', value: 14, icon: <LogIn className="w-4 h-4 text-green-500"/> },
                { label: 'Departure', value: 27, icon: <LogOut className="w-4 h-4 text-red-400"/> },
            ]}
            mainVisual={
                <div className="mt-4 flex flex-wrap gap-4 sm:gap-8">
                     <div className="flex items-center gap-2">
                        <SprayCan className="w-5 h-5 text-gray-400" />
                        <div>
                            <p className="text-xs text-gray-500">Rented & dirty</p>
                            <p className="font-bold text-gray-800">14</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-2">
                        <BedDouble className="w-5 h-5 text-gray-400" />
                        <div>
                            <p className="text-xs text-gray-500">Vacant & dirty</p>
                            <p className="font-bold text-gray-800">27</p>
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
                <div className="h-12 sm:h-16 w-full flex rounded-xl overflow-hidden mt-2">
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
                 <div className="flex justify-end mt-4 sm:mt-8">
                     <a href="#" className="text-xs text-gray-400 hover:text-green-600">Details &gt;&gt;</a>
                 </div>
             }
        />
      </div>

      {/* Middle Row: Chart & Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[350px]">
            <BookingChart />
        </div>

        {/* Calendar Section */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col min-h-[350px]">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800">Calendar</h3>
                <span className="text-xs text-green-600 font-medium cursor-pointer">&lt; March &gt;</span>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
                <button className="bg-gray-900 text-white text-[10px] px-3 py-1 rounded-full">1 Bed (6)</button>
                <button className="bg-white border border-gray-200 text-gray-500 text-[10px] px-3 py-1 rounded-full">2 Beds (12)</button>
                <button className="bg-white border border-gray-200 text-gray-500 text-[10px] px-3 py-1 rounded-full">3 Beds (15)</button>
            </div>

            <div className="flex gap-1 mb-4 overflow-x-auto pb-2 no-scrollbar">
                {['#1012', '#1013', '#1014', '#1022', '#1023'].map(room => (
                    <span key={room} className={`text-[10px] px-2 py-1 rounded border whitespace-nowrap ${room === '#1014' ? 'border-gray-800 text-gray-900 font-bold' : 'border-gray-100 text-gray-400'}`}>{room}</span>
                ))}
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto pr-1 max-h-[200px] sm:max-h-none">
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

      {/* Bottom List */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-800">New customer</h3>
                    <a href="#" className="text-xs text-gray-400">View all &gt;&gt;</a>
                </div>
                <div className="space-y-4">
                    {bookings.map((bk, i) => (
                        <div key={bk.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-3 min-w-0">
                                <img src={`https://picsum.photos/40/40?random=${i+10}`} className="w-8 h-8 rounded-full shrink-0" alt="customer" />
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-gray-800 truncate">{bk.guestName}</p>
                                    <p className="text-xs text-gray-400 truncate">Room #{bk.roomNumber}</p>
                                </div>
                            </div>
                            <span className="text-xs text-gray-500 shrink-0 ml-2">20/01 - 28/01</span>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                     <h3 className="font-bold text-gray-800">Recent activities</h3>
                     <a href="#" className="text-xs text-gray-400">View all &gt;&gt;</a>
                </div>
                 <div className="space-y-6 relative">
                    <div className="absolute left-[7px] top-2 bottom-2 w-[1px] bg-gray-100"></div>
                    {[1, 2, 3].map((_, i) => (
                        <div key={i} className="flex gap-4 relative">
                            <div className="w-4 h-4 rounded-full bg-green-500 border-4 border-white shadow-sm shrink-0 z-10"></div>
                            <div className="flex-1">
                                <p className="text-xs text-gray-400 mb-1">Room #1420</p>
                                <p className="text-sm text-gray-700"><strong>Zain ahmad</strong> requested for a coffee and water.</p>
                            </div>
                            <span className="text-xs text-gray-400 shrink-0">1 min</span>
                        </div>
                    ))}
                 </div>
            </div>
       </div>
    </div>
  );
};

export default Dashboard;
