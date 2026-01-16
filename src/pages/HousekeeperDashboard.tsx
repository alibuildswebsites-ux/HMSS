import React, { useEffect, useState } from 'react';
import StatsCard from '../components/StatsCard';
import MaintenanceModal from '../components/MaintenanceModal';
import { DataService, Task, Room } from '../services/dataService';
import { AuthService } from '../services/authService';
import { SprayCan, ClipboardList, CheckCircle, Clock, AlertTriangle, Play, CheckSquare } from 'lucide-react';
import clsx from 'clsx';

const HousekeeperDashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const [feedback, setFeedback] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  // Get current user via AuthService
  const user = AuthService.getCurrentUser();

  const loadData = () => {
    if (!user) return;
    // Filter tasks for this housekeeper
    const allTasks = DataService.getHousekeepingTasks();
    const myTasks = allTasks.filter(t => t.assignee === user.name);
    setTasks(myTasks);
    setRooms(DataService.getRooms());
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, [user?.name]);

  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  if (!user) return null;

  const updateTaskStatus = (taskId: string, status: Task['status']) => {
      DataService.updateHousekeepingTaskStatus(taskId, status);
      loadData();
      if (status === 'Completed') {
          setFeedback({ message: 'Task completed. Room marked as Vacant.', type: 'success' });
      } else {
          setFeedback({ message: 'Task status updated.', type: 'success' });
      }
  };

  const handleReportIssue = (roomId: string, description: string, priority: 'Low' | 'Medium' | 'High') => {
      DataService.createMaintenanceIssue({
          roomId,
          roomNumber: roomId,
          description,
          priority,
          reportedBy: user.name
      });
      loadData();
      setFeedback({ message: 'Maintenance issue reported.', type: 'success' });
  };

  const pendingCount = tasks.filter(t => t.status === 'Pending').length;
  const inProgressCount = tasks.filter(t => t.status === 'In Progress').length;
  const completedCount = tasks.filter(t => t.status === 'Completed').length;

  return (
    <div className="w-full p-4 sm:p-6 space-y-6 relative">
       {/* Feedback Toast */}
       {feedback && (
        <div className={clsx(
          "fixed top-20 right-4 z-50 px-4 py-2 rounded-lg shadow-lg text-white font-medium animate-in fade-in slide-in-from-top-2",
          feedback.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        )}>
          {feedback.message}
        </div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">My Tasks</h2>
        <button 
            onClick={() => setIsMaintenanceModalOpen(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm"
        >
            <AlertTriangle className="w-4 h-4" /> Report Issue
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard 
          title="To Do"
          stats={[
            { label: 'Pending', value: pendingCount, icon: <SprayCan className="w-4 h-4 text-red-500"/> },
            { label: 'In Progress', value: inProgressCount, icon: <Clock className="w-4 h-4 text-blue-500"/> }
          ]}
        />
        <StatsCard 
          title="Performance"
          stats={[
            { label: 'Completed Today', value: completedCount, icon: <CheckCircle className="w-4 h-4 text-green-500"/> }
          ]}
        />
        <StatsCard 
          title="Profile"
          stats={[
            { label: 'Assigned Rooms', value: pendingCount + inProgressCount, icon: <ClipboardList className="w-4 h-4 text-gray-500"/> }
          ]}
        />
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-gray-700 flex items-center gap-2">
            <ClipboardList className="w-5 h-5"/> Task List
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.filter(t => t.status !== 'Completed').map(task => (
                <div key={task.id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-all animate-in fade-in duration-300">
                    <div className="flex justify-between items-start mb-3">
                        <div>
                            <span className="text-2xl font-bold text-gray-800">{task.roomNumber}</span>
                            <span className="block text-xs text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded mt-1 w-fit">{task.type}</span>
                        </div>
                        <span className={clsx(
                            "text-[10px] font-bold px-2 py-1 rounded-full uppercase",
                            task.status === 'Pending' ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                        )}>
                            {task.status}
                        </span>
                    </div>
                    
                    {task.notes && (
                        <div className="bg-yellow-50 p-2 rounded text-xs text-gray-600 italic mb-2 border border-yellow-100">
                           "{task.notes}"
                        </div>
                    )}
                    
                    <div className="text-xs text-gray-400 mb-4 flex items-center gap-1">
                        <Clock className="w-3 h-3"/> Due: {task.date}
                    </div>

                    <div className="flex justify-between items-center mt-auto pt-2 border-t border-gray-50">
                        {task.status === 'Pending' ? (
                             <button 
                                onClick={() => updateTaskStatus(task.id, 'In Progress')}
                                className="w-full bg-blue-50 text-blue-600 hover:bg-blue-100 font-semibold py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors"
                             >
                                <Play className="w-4 h-4" /> Start Task
                             </button>
                        ) : (
                            <button 
                                onClick={() => updateTaskStatus(task.id, 'Completed')}
                                className="w-full bg-green-50 text-green-600 hover:bg-green-100 font-semibold py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors"
                            >
                                <CheckSquare className="w-4 h-4" /> Complete
                            </button>
                        )}
                    </div>
                </div>
            ))}
            {tasks.filter(t => t.status !== 'Completed').length === 0 && (
                <div className="col-span-full py-12 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200 text-gray-400">
                    <CheckCircle className="w-10 h-10 mx-auto mb-3 text-green-200" />
                    <p>No pending tasks assigned to you.</p>
                </div>
            )}
        </div>
      </div>

      <MaintenanceModal 
        isOpen={isMaintenanceModalOpen}
        onClose={() => setIsMaintenanceModalOpen(false)}
        rooms={rooms}
        onConfirm={handleReportIssue}
        reporterName={user.name}
      />
    </div>
  );
};

export default HousekeeperDashboard;