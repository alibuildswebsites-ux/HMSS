import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import AdminLogin from './pages/Admin/AdminLogin';
import ProtectedRoute from './components/ProtectedRoute';

// Dashboards
import ManagerDashboard from './pages/ManagerDashboard';
import ReceptionistDashboard from './pages/ReceptionistDashboard';
import WaiterDashboard from './pages/WaiterDashboard';
import CookDashboard from './pages/CookDashboard';
import HousekeeperDashboard from './pages/HousekeeperDashboard';
import CustomerDashboard from './pages/CustomerDashboard';
import NotFound from './pages/NotFound';

import { DataService } from './services/dataService';

// Layout component to wrap authenticated pages
const MainLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-50 font-sans text-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50/50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  // Initialize data on app load
  useEffect(() => {
    DataService.initialize();
  }, []);

  return (
    <HashRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={<AdminLogin />} />

        {/* Protected Routes Wrapper */}
        <Route element={<MainLayout />}>
          
          <Route path="/manager-dashboard" element={
            <ProtectedRoute allowedRoles={['Manager']}>
              <ManagerDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/receptionist-dashboard" element={
            <ProtectedRoute allowedRoles={['Receptionist']}>
              <ReceptionistDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/waiter-dashboard" element={
            <ProtectedRoute allowedRoles={['Waiter']}>
              <WaiterDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/cook-dashboard" element={
            <ProtectedRoute allowedRoles={['Cook']}>
              <CookDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/housekeeper-dashboard" element={
            <ProtectedRoute allowedRoles={['Housekeeper']}>
              <HousekeeperDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/customer-dashboard" element={
            <ProtectedRoute allowedRoles={['Customer']}>
              <CustomerDashboard />
            </ProtectedRoute>
          } />

          {/* Fallback within protected layout */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;