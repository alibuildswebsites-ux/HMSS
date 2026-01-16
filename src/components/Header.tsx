import React from 'react';
import { Bell, Plus } from 'lucide-react';

interface HeaderProps {
  userName: string;
}

const Header: React.FC<HeaderProps> = ({ userName }) => {
  return (
    <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30 w-full">
      {/* Left side - Spaced for hamburger on mobile */}
      <div className="flex items-center pl-12 sm:pl-0">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mr-4 hidden md:block">Dashboard</h1>
        
        <div className="hidden sm:flex items-center bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
            <div className="w-8 h-8 rounded bg-green-100 flex items-center justify-center text-green-700 mr-3 shrink-0">
                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            </div>
            <div className="hidden lg:block">
                <h3 className="text-sm font-semibold text-gray-700">Hilton Garden Inn</h3>
                <p className="text-xs text-gray-500">Sylhet Financial District</p>
            </div>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-6">
        <div className="hidden md:flex items-center text-sm text-gray-500 gap-2">
            <span>Good morning! <strong>{userName}</strong></span>
        </div>
        
        <button className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-3 py-2 sm:px-4 rounded-lg text-sm font-medium transition-colors h-10">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New reservation</span>
            <span className="inline sm:hidden">New</span>
        </button>

        <div className="relative h-10 w-10 flex items-center justify-center">
          <Bell className="w-6 h-6 text-gray-400 cursor-pointer hover:text-gray-600" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </div>
        
        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-sm shrink-0">
            <img src="https://picsum.photos/100/100" alt="Profile" className="w-full h-full object-cover" />
        </div>
      </div>
    </header>
  );
};

export default Header;