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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-between w-full max-w-full min-h-0"
    >
      <h3 className="text-gray-500 text-sm sm:text-base font-medium mb-4">{title}</h3>
      
      <div className="flex justify-between items-start mb-4 gap-2">
        {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                    {stat.color && <span className={`w-2 h-2 rounded-full ${stat.color} shrink-0`}></span>}
                    {stat.icon && <span className="text-gray-400 shrink-0">{stat.icon}</span>}
                    <span className="text-xs text-gray-500 truncate">{stat.label}</span>
                </div>
                <span className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 truncate leading-relaxed">{stat.value}</span>
            </div>
        ))}
      </div>

      {mainVisual && (
          <div className="mt-auto pt-2 w-full">
              {mainVisual}
          </div>
      )}
    </motion.div>
  );
};

export default StatsCard;