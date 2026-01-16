import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, CalendarDays, Users, Coffee, MessageSquare, 
  Settings, Folder, Menu, X, ClipboardList, Utensils, LogIn, LogOut,
  ShoppingBag, SprayCan, BookOpen, FileText
} from 'lucide-react';
import { clsx } from 'clsx';

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  
  // Get role from storage
  const role = localStorage.getItem('currentRole') || 'Manager';

  // Define all possible items
  const allNavItems = {
    overview: { icon: LayoutDashboard, label: 'Overview', path: '/' },
    dashboard: { icon: LayoutDashboard, label: 'Dashboard', path: '/' }, // Generic dashboard link
    reports: { icon: FileText, label: 'Reports', path: '/reports' },
    bookings: { icon: CalendarDays, label: 'Bookings', path: '/bookings' },
    staff: { icon: Users, label: 'Staff', path: '/staff' },
    kitchen: { icon: Coffee, label: 'Kitchen', path: '/kitchen' },
    messages: { icon: MessageSquare, label: 'Messages', path: '/messages' },
    settings: { icon: Settings, label: 'Settings', path: '/settings' },
    files: { icon: Folder, label: 'Files', path: '/files' },
    
    // Role specific items
    checkin: { icon: LogIn, label: 'Check-In', path: '/check-in' },
    checkout: { icon: LogOut, label: 'Check-Out', path: '/check-out' },
    orders: { icon: ShoppingBag, label: 'Orders', path: '/orders' },
    kitchenOrders: { icon: Utensils, label: 'Kitchen Orders', path: '/kitchen-orders' },
    cleaningTasks: { icon: SprayCan, label: 'Cleaning Tasks', path: '/cleaning' },
    myBooking: { icon: BookOpen, label: 'My Booking', path: '/my-booking' }
  };

  // Select items based on role
  let navItems = [];
  
  switch(role) {
    case 'Manager':
      navItems = [
        allNavItems.overview,
        allNavItems.reports,
        allNavItems.staff, 
        allNavItems.bookings,
        allNavItems.settings
      ];
      break;
    case 'Receptionist':
      navItems = [
        allNavItems.dashboard,
        allNavItems.bookings, 
        allNavItems.checkin, 
        allNavItems.checkout
      ];
      break;
    case 'Waiter':
      navItems = [
        allNavItems.dashboard, 
        allNavItems.orders
      ];
      break;
    case 'Cook':
      navItems = [
        allNavItems.dashboard, 
        allNavItems.kitchenOrders
      ];
      break;
    case 'Housekeeper':
      navItems = [
        allNavItems.dashboard, 
        allNavItems.cleaningTasks
      ];
      break;
    case 'Customer':
      navItems = [
        allNavItems.dashboard, 
        allNavItems.myBooking, 
        allNavItems.orders
      ];
      break;
    default:
      navItems = [allNavItems.dashboard];
  }

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) closeSidebar();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen]);

  return (
    <>
      <button 
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-sm border border-gray-100 text-gray-600 hover:bg-gray-50 sm:hidden h-10 w-10 flex items-center justify-center"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 sm:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      <aside 
        className={clsx(
          "fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-200 h-screen flex flex-col transition-transform duration-300 ease-in-out w-64",
          "sm:sticky sm:top-0 sm:translate-x-0 sm:z-0",
          isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full sm:shadow-none"
        )}
      >
        <div className="absolute top-4 right-4 sm:hidden">
            <button 
                onClick={closeSidebar}
                className="p-2 text-gray-400 hover:text-gray-600 h-10 w-10 flex items-center justify-center"
                aria-label="Close menu"
            >
                <X className="w-5 h-5" />
            </button>
        </div>

        <div className="h-20 flex items-center px-8 border-b border-gray-100 shrink-0">
          <div className="w-10 h-10 bg-green-900 rounded-lg flex items-center justify-center text-white font-bold text-xl shrink-0">
            H
          </div>
          <span className="ml-3 font-bold text-gray-800 text-xl">HMS</span>
        </div>
        
        <div className="px-8 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          {role} View
        </div>

        <nav className="flex-1 py-4 space-y-2 px-3 overflow-y-auto">
          {navItems.map((item, index) => (
            <NavLink
              key={item.path}
              to={item.path}
              ref={index === 0 ? firstLinkRef : null}
              onClick={closeSidebar}
              className={({ isActive }) =>
                clsx(
                  "flex items-center p-3 rounded-xl transition-colors duration-200 group outline-none focus:ring-2 focus:ring-green-500/50",
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