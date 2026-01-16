import React from 'react';
import { motion } from 'framer-motion';

interface StatsCardProps {
  title: string;
  stats: { label: string; value: number | string; color?: string; icon?: React.ReactNode }[];
  mainVisual?: React.ReactNode;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, stats, mainVisual }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between"
    >
      <h3 className="text-gray-500 font-medium mb-4">{title}</h3>
      
      <div className="flex justify-between items-start mb-4">
        {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                    {stat.color && <span className={`w-2 h-2 rounded-full ${stat.color}`}></span>}
                    {stat.icon && <span className="text-gray-400">{stat.icon}</span>}
                    <span className="text-xs text-gray-500">{stat.label}</span>
                </div>
                <span className="text-2xl font-bold text-gray-800">{stat.value}</span>
            </div>
        ))}
      </div>

      {mainVisual && (
          <div className="mt-2">
              {mainVisual}
          </div>
      )}
    </motion.div>
  );
};

export default StatsCard;
