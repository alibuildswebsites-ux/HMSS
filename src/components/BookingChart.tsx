import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Booking } from '../services/dataService';

interface BookingChartProps {
  bookings: Booking[];
}

const BookingChart: React.FC<BookingChartProps> = ({ bookings }) => {
  const data = useMemo(() => {
    const days = 7;
    const result = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      
      // Construct YYYY-MM-DD in local time to match stored date format
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      
      // Format for display (e.g., 27-Oct)
      const displayDate = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });

      // Count bookings created/checked-in on this date
      const count = bookings.filter(b => b.checkIn === dateStr).length;

      result.push({ name: displayDate, value: count });
    }
    return result;
  }, [bookings]);

  return (
    <div className="w-full flex flex-col h-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
        <div className="flex items-center gap-2">
            <h3 className="font-bold text-gray-800 text-lg sm:text-xl">Booking Trends</h3>
            <span className="text-xs text-gray-400">Last 7 days (Check-ins)</span>
        </div>
      </div>

      {/* Aspect Ratio Container for Chart */}
      <div className="relative w-full pb-[56.25%] sm:pb-[40%] lg:pb-[30%] min-h-[200px]">
        <div className="absolute inset-0">
            <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 10, fill: '#9ca3af'}} 
                    dy={10}
                    interval="preserveStartEnd"
                />
                <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    cursor={{ stroke: '#e5e7eb', strokeWidth: 1 }}
                />
                <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#65a30d" 
                    strokeWidth={3} 
                    dot={false}
                    activeDot={{ r: 6, fill: '#65a30d', stroke: '#fff', strokeWidth: 2 }}
                />
            </LineChart>
            </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default BookingChart;