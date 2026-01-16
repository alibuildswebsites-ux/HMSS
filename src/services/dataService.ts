/**
 * DataService
 * Handles data fetching and persistence using localStorage.
 * mimics a backend by initializing data from public/data/*.json on first run.
 */

const KEYS = {
  ROOMS: 'hms_rooms',
  USERS: 'hms_users',
  MENU: 'hms_menu',
  BOOKINGS: 'hms_bookings',
  INIT: 'hms_initialized'
};

export interface Room {
  id: string;
  type: string;
  status: 'Vacant' | 'Occupied' | 'Not Ready';
  price: number;
  floor: number;
}

export interface Booking {
  id: string;
  guestName: string;
  roomNumber: string;
  checkIn: string;
  checkOut: string;
  status: 'Active' | 'Confirmed' | 'Completed' | 'Cancelled';
}

export interface User {
  id: number;
  name: string;
  role: string;
  email: string;
}

export const DataService = {
  /**
   * Initialize data from JSON files if not present in localStorage.
   */
  async initialize() {
    if (localStorage.getItem(KEYS.INIT)) {
      return; // Data already exists
    }

    try {
      const [roomsRes, usersRes, menuRes, bookingsRes] = await Promise.all([
        fetch('/data/rooms.json'),
        fetch('/data/users.json'),
        fetch('/data/menu.json'),
        fetch('/data/bookings.json')
      ]);

      const rooms = await roomsRes.json();
      const users = await usersRes.json();
      const menu = await menuRes.json();
      const bookings = await bookingsRes.json();

      localStorage.setItem(KEYS.ROOMS, JSON.stringify(rooms));
      localStorage.setItem(KEYS.USERS, JSON.stringify(users));
      localStorage.setItem(KEYS.MENU, JSON.stringify(menu));
      localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(bookings));
      localStorage.setItem(KEYS.INIT, 'true');
      
      console.log('HMS: Data initialized from public JSON files.');
    } catch (error) {
      console.error('HMS: Failed to initialize data', error);
    }
  },

  getRooms(): Room[] {
    const data = localStorage.getItem(KEYS.ROOMS);
    return data ? JSON.parse(data) : [];
  },

  getUsers(): User[] {
    const data = localStorage.getItem(KEYS.USERS);
    return data ? JSON.parse(data) : [];
  },

  getBookings(): Booking[] {
    const data = localStorage.getItem(KEYS.BOOKINGS);
    return data ? JSON.parse(data) : [];
  },

  saveBookings(bookings: Booking[]) {
    localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(bookings));
  },

  /**
   * Clears localStorage to force a re-fetch of initial data on next reload.
   */
  resetToPublicData() {
    localStorage.removeItem(KEYS.ROOMS);
    localStorage.removeItem(KEYS.USERS);
    localStorage.removeItem(KEYS.MENU);
    localStorage.removeItem(KEYS.BOOKINGS);
    localStorage.removeItem(KEYS.INIT);
    window.location.reload();
  }
};
