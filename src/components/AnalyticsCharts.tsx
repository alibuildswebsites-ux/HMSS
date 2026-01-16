import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AnalyticsChartsProps {
  bookingData: {
    confirmed: number;
    active: number;
    cancelled: number;
    completed: number;
  };
  orderData: {
    pending: number;
    served: number;
    cancelled: number;
  };
}

const COLORS = ['#22c55e', '#3b82f6', '#ef4444', '#9ca3af']; // Green, Blue, Red, Gray

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ bookingData, orderData }) => {
  
  const pieData = [
    { name: 'Active', value: bookingData.active },
    { name: 'Confirmed', value: bookingData.confirmed },
    { name: 'Cancelled', value: bookingData.cancelled },
    { name: 'Completed', value: bookingData.completed },
  ].filter(d => d.value > 0);

  const barData = [
    { name: 'Pending', orders: orderData.pending },
    { name: 'Served', orders: orderData.served },
    { name: 'Cancelled', orders: orderData.cancelled },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      {/* Booking Distribution */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center">
        <h3 className="font-bold text-gray-800 mb-4 self-start">Booking Status Distribution</h3>
        <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                >
                    {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
            </ResponsiveContainer>
        </div>
      </div>

      {/* Order Status */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col">
        <h3 className="font-bold text-gray-800 mb-4">Order Status Overview</h3>
        <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} />
                <YAxis axisLine={false} tickLine={false} fontSize={12} />
                <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '8px', border: 'none' }} />
                <Bar dataKey="orders" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
            </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCharts;