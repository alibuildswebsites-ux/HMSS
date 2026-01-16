import React, { useState } from 'react';
import { X, AlertTriangle, Wrench } from 'lucide-react';
import { Room } from '../services/dataService';

interface MaintenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  rooms: Room[];
  onConfirm: (roomId: string, description: string, priority: 'Low' | 'Medium' | 'High') => void;
  reporterName: string;
}

const MaintenanceModal: React.FC<MaintenanceModalProps> = ({ isOpen, onClose, rooms, onConfirm, reporterName }) => {
  const [roomId, setRoomId] = useState(rooms.length > 0 ? rooms[0].id : '');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
        setError('Please provide a description.');
        return;
    }
    onConfirm(roomId, description, priority);
    onClose();
    setDescription('');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" /> Report Issue
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
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500/20 outline-none bg-white"
            >
                {rooms.map(r => (
                    <option key={r.id} value={r.id}>Room {r.id}</option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <div className="flex gap-2">
                {(['Low', 'Medium', 'High'] as const).map(p => (
                    <button
                        key={p}
                        type="button"
                        onClick={() => setPriority(p)}
                        className={`flex-1 py-2 text-sm font-medium rounded-lg border transition-colors ${
                            priority === p 
                            ? (p === 'High' ? 'bg-red-50 text-red-700 border-red-200' : p === 'Medium' ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-green-50 text-green-700 border-green-200')
                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                        {p}
                    </button>
                ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Describe the maintenance issue..."
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500/20 outline-none resize-none"
            />
          </div>

          {error && (
            <div className="text-red-500 text-xs bg-red-50 p-2 rounded border border-red-100">
              {error}
            </div>
          )}

          <div className="bg-gray-50 p-2 rounded text-xs text-gray-500 flex items-center gap-2">
              <Wrench className="w-3 h-3" /> Reported by: {reporterName}
          </div>

          <button 
            type="submit" 
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg transition-all shadow-sm active:scale-[0.98]"
          >
            Submit Report
          </button>
        </form>
      </div>
    </div>
  );
};

export default MaintenanceModal;