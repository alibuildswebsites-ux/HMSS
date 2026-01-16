import React from 'react';
import ManagerDashboard from './ManagerDashboard';
import ReceptionistDashboard from './ReceptionistDashboard';
import WaiterDashboard from './WaiterDashboard';
import CookDashboard from './CookDashboard';
import HousekeeperDashboard from './HousekeeperDashboard';
import CustomerDashboard from './CustomerDashboard';

const Dashboard: React.FC = () => {
  // Read role from localStorage using correct key
  const role = localStorage.getItem('currentRole') || 'Manager';

  switch (role) {
    case 'Manager':
      return <ManagerDashboard />;
    case 'Receptionist':
      return <ReceptionistDashboard />;
    case 'Waiter':
      return <WaiterDashboard />;
    case 'Cook':
      return <CookDashboard />;
    case 'Housekeeper':
      return <HousekeeperDashboard />;
    case 'Customer':
      return <CustomerDashboard />;
    default:
      return <ManagerDashboard />;
  }
};

export default Dashboard;