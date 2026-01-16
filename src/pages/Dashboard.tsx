import React from 'react';
import ManagerDashboard from './ManagerDashboard';
import { 
  ReceptionistDashboard, 
  WaiterDashboard, 
  CookDashboard, 
  HousekeeperDashboard, 
  CustomerDashboard 
} from './RoleDashboards';

const Dashboard: React.FC = () => {
  // Read role from localStorage, default to 'Manager' if not found
  const role = localStorage.getItem('hms_role') || 'Manager';

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