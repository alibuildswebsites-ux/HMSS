import React from 'react';
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: '01-Mar', value: 25 },
  { name: '02-Mar', value: 38 },
  { name: '03-Mar', value: 15 },
  { name: '04-Mar', value: 65 },
  { name: '05-Mar', value: 45 },
  { name: '06-Mar', value: 25 },
  { name: '07-Mar', value: 58 },
];

const BookingChart: React.FC = () => {
  return (
    <div className="w-full h-full">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
            <h3 className="font-bold text-gray-800">Booking</h3>
            <span className="text-xs text-gray-400">Last update 1m ago</span>
        </div>
        <select className="text-xs bg-transparent text-green-700 font-medium outline-none cursor-pointer">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
        </select>
      </div>

      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
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
  );
};

export default BookingChart;
