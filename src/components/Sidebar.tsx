import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CalendarDays, Users, Coffee, MessageSquare, Settings, Folder } from 'lucide-react';
import { clsx } from 'clsx';

const Sidebar: React.FC = () => {
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: CalendarDays, label: 'Bookings', path: '/bookings' },
    { icon: Users, label: 'Staff', path: '/staff' },
    { icon: Coffee, label: 'Kitchen', path: '/kitchen' },
    { icon: MessageSquare, label: 'Messages', path: '/messages' },
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: Folder, label: 'Files', path: '/files' },
  ];

  return (
    <aside className="w-20 lg:w-64 bg-sidebar border-r border-gray-200 h-screen flex flex-col sticky top-0 overflow-y-auto">
      <div className="h-20 flex items-center justify-center lg:justify-start lg:px-8 border-b border-gray-100">
        <div className="w-10 h-10 bg-green-900 rounded-lg flex items-center justify-center text-white font-bold text-xl">
          H
        </div>
        <span className="hidden lg:block ml-3 font-bold text-gray-800 text-xl">HMS</span>
      </div>

      <nav className="flex-1 py-6 space-y-2 px-3">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              clsx(
                "flex items-center p-3 rounded-xl transition-colors duration-200 group",
                isActive
                  ? "bg-white text-green-700 shadow-sm border border-gray-100"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              )
            }
          >
            <item.icon className="w-6 h-6" strokeWidth={1.5} />
            <span className="hidden lg:block ml-3 font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div className="hidden lg:flex items-center p-3 bg-green-50 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-green-200 flex items-center justify-center text-green-800 font-bold text-xs">
                ?
            </div>
            <div className="ml-3">
                <p className="text-xs font-semibold text-green-900">Help Center</p>
                <p className="text-[10px] text-green-700">Get assistance</p>
            </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
