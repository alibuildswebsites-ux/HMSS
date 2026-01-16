import React, { useState } from 'react';
import { X, Calendar, User } from 'lucide-react';
import { Room } from '../services/dataService';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: Room | null;
  onConfirm: (checkIn: string, checkOut: string, guestName: string) => void;
  currentUserRole: string;
  currentUserName: string;
}

const BookingModal: React.FC<BookingModalProps> = ({ 
  isOpen, onClose, room, onConfirm, currentUserRole, currentUserName 
}) => {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guestName, setGuestName] = useState(currentUserName);
  const [error, setError] = useState('');

  if (!isOpen || !room) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!checkIn || !checkOut) {
      setError('Please select both check-in and check-out dates.');
      return;
    }

    if (new Date(checkOut) <= new Date(checkIn)) {
      setError('Check-out date must be after check-in date.');
      return;
    }

    if (!guestName.trim()) {
      setError('Guest name is required.');
      return;
    }

    onConfirm(checkIn, checkOut, guestName);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50">
          <h3 className="font-bold text-gray-800">Book Room {room.id}</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-green-50 p-3 rounded-lg border border-green-100 flex justify-between items-center">
            <div>
              <p className="text-xs text-green-600 font-bold uppercase tracking-wide">{room.type}</p>
              <p className="text-lg font-bold text-green-900">${room.price} <span className="text-sm font-normal text-green-700">/ night</span></p>
            </div>
            <div className="text-right">
                <span className="inline-block px-2 py-1 bg-white text-green-700 text-xs font-bold rounded shadow-sm">
                    Floor {room.floor}
                </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Guest Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                readOnly={currentUserRole === 'Customer'}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none ${currentUserRole === 'Customer' ? 'bg-gray-50 text-gray-500' : 'bg-white'}`}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Check In</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="date" 
                  value={checkIn}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full pl-10 pr-2 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Check Out</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="date" 
                  value={checkOut}
                  min={checkIn || new Date().toISOString().split('T')[0]}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full pl-10 pr-2 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none text-sm"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-xs bg-red-50 p-2 rounded border border-red-100">
              {error}
            </div>
          )}

          <div className="pt-2">
            <button 
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-all shadow-sm active:scale-[0.98]"
            >
              Confirm Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;