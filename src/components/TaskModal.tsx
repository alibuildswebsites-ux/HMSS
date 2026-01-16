import React, { useState, useEffect } from 'react';
import { X, Calendar, User, SprayCan, FileText } from 'lucide-react';
import { Room, User as AppUser } from '../services/dataService';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  rooms: Room[];
  staff: AppUser[];
  onConfirm: (roomId: string, assignee: string, type: 'Cleaning' | 'Deep Clean' | 'Inspection', date: string, notes: string) => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, rooms, staff, onConfirm }) => {
  const [roomId, setRoomId] = useState('');
  const [assignee, setAssignee] = useState('');
  const [type, setType] = useState<'Cleaning' | 'Deep Clean' | 'Inspection'>('Cleaning');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  // Filter staff for housekeepers
  const housekeepers = staff.filter(u => u.role === 'Housekeeper');

  useEffect(() => {
    if (isOpen) {
        setRoomId(rooms.length > 0 ? rooms[0].id : '');
        setAssignee(housekeepers.length > 0 ? housekeepers[0].name : '');
        setNotes('');
        setError('');
    }
  }, [isOpen, rooms, staff]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomId) {
        setError('Please select a room.');
        return;
    }
    if (!assignee) {
        setError('Please select a housekeeper.');
        return;
    }
    onConfirm(roomId, assignee, type, date, notes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <SprayCan className="w-5 h-5 text-blue-500" /> Assign Cleaning
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Room</label>
            <select 
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none bg-white"
            >
                {rooms.map(r => (
                    <option key={r.id} value={r.id}>Room {r.id} ({r.status})</option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Task Type</label>
            <select 
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none bg-white"
            >
                <option value="Cleaning">Standard Cleaning</option>
                <option value="Deep Clean">Deep Clean</option>
                <option value="Inspection">Inspection</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assign To</label>
            <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select 
                    value={assignee}
                    onChange={(e) => setAssignee(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none bg-white"
                >
                    {housekeepers.map(h => (
                        <option key={h.id} value={h.name}>{h.name}</option>
                    ))}
                    {housekeepers.length === 0 && <option value="">No housekeepers available</option>}
                </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
            <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
                />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
            <div className="relative">
                <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <textarea 
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Special instructions..."
                    rows={2}
                    className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none resize-none"
                />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-xs bg-red-50 p-2 rounded border border-red-100">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all shadow-sm active:scale-[0.98]"
          >
            Assign Task
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;