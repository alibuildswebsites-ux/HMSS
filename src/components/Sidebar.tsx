import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CalendarDays, Users, Coffee, MessageSquare, Settings, Folder, Menu, X } from 'lucide-react';
import { clsx } from 'clsx';

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: CalendarDays, label: 'Bookings', path: '/bookings' },
    { icon: Users, label: 'Staff', path: '/staff' },
    { icon: Coffee, label: 'Kitchen', path: '/kitchen' },
    { icon: MessageSquare, label: 'Messages', path: '/messages' },
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: Folder, label: 'Files', path: '/files' },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Hamburger Button - Positioned to sit in the header area visually */}
      <button 
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-sm border border-gray-100 text-gray-600 hover:bg-gray-50 sm:hidden"
        aria-label="Toggle Navigation"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 sm:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={clsx(
          "fixed inset-y-0 left-0 z-40 bg-white border-r border-gray-200 h-screen flex flex-col transition-transform duration-300 ease-in-out sm:sticky sm:top-0 sm:translate-x-0 w-64",
          isOpen ? "translate-x-0 shadow-xl" : "-translate-x-full shadow-none"
        )}
      >
        <div className="h-20 flex items-center px-8 border-b border-gray-100 shrink-0">
          <div className="w-10 h-10 bg-green-900 rounded-lg flex items-center justify-center text-white font-bold text-xl shrink-0">
            H
          </div>
          <span className="ml-3 font-bold text-gray-800 text-xl">HMS</span>
        </div>

        <nav className="flex-1 py-6 space-y-2 px-3 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)} // Close drawer on mobile nav click
              className={({ isActive }) =>
                clsx(
                  "flex items-center p-3 rounded-xl transition-colors duration-200 group",
                  isActive
                    ? "bg-green-50 text-green-700 shadow-sm border border-green-100/50"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                )
              }
            >
              <item.icon className="w-6 h-6 shrink-0" strokeWidth={1.5} />
              <span className="ml-3 font-medium text-sm">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100 shrink-0">
          <div className="flex items-center p-3 bg-green-50 rounded-xl">
              <div className="w-8 h-8 rounded-full bg-green-200 flex items-center justify-center text-green-800 font-bold text-xs shrink-0">
                  ?
              </div>
              <div className="ml-3 overflow-hidden">
                  <p className="text-xs font-semibold text-green-900 truncate">Help Center</p>
                  <p className="text-[10px] text-green-700 truncate">Get assistance</p>
              </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
