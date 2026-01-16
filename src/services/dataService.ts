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
  ORDERS: 'hms_orders',
  TASKS: 'hms_tasks',
  ISSUES: 'hms_issues',
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
  roomId: string;
  roomNumber: string;
  guestName: string;
  userRole?: string;
  checkIn: string;
  checkOut: string;
  status: 'Active' | 'Confirmed' | 'Completed' | 'Cancelled';
}

export interface User {
  id: number;
  name: string;
  role: string;
  email: string;
  password?: string; // Included for auth
}

export interface MenuItem {
  id: number;
  item: string;
  price: number;
  category: string;
}

export interface OrderItem {
  id: number;
  item: string;
  price: number;
  qty: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  status: 'Pending' | 'Preparing' | 'Ready' | 'Served' | 'Cancelled';
  tableOrRoom: string;
  orderedBy: string;
  timestamp: string;
}

export interface Task {
  id: string;
  roomId: string;
  roomNumber: string;
  assignee: string; // Housekeeper name
  status: 'Pending' | 'In Progress' | 'Completed';
  type: 'Cleaning' | 'Deep Clean' | 'Inspection';
  date: string;
  notes?: string;
}

export interface Issue {
  id: string;
  roomId: string;
  roomNumber: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'In Progress' | 'Resolved';
  reportedBy: string;
  timestamp: string;
}

export const DataService = {
  /**
   * Initialize data from JSON files if not present in localStorage.
   */
  async initialize() {
    const isInitialized = localStorage.getItem(KEYS.INIT);

    if (!isInitialized) {
      try {
        // Use allSettled to allow some files to fail
        const results = await Promise.allSettled([
          fetch('/data/rooms.json'),
          fetch('/data/users.json'),
          fetch('/data/menu.json'),
          fetch('/data/bookings.json'),
          fetch('/data/orders.json'),
          fetch('/data/tasks.json'),
          fetch('/data/issues.json')
        ]);

        const handleResponse = async (result: PromiseSettledResult<Response>, key: string, defaultVal: any) => {
          if (result.status === 'fulfilled' && result.value.ok) {
            try {
              const data = await result.value.json();
              localStorage.setItem(key, JSON.stringify(data));
            } catch (e) {
              console.warn(`Failed to parse JSON for ${key}`, e);
              localStorage.setItem(key, JSON.stringify(defaultVal));
            }
          } else {
            localStorage.setItem(key, JSON.stringify(defaultVal));
          }
        };

        await handleResponse(results[0], KEYS.ROOMS, []);
        await handleResponse(results[1], KEYS.USERS, []);
        await handleResponse(results[2], KEYS.MENU, []);
        await handleResponse(results[3], KEYS.BOOKINGS, []);
        await handleResponse(results[4], KEYS.ORDERS, []);
        await handleResponse(results[5], KEYS.TASKS, []);
        await handleResponse(results[6], KEYS.ISSUES, []);

        localStorage.setItem(KEYS.INIT, 'true');
        console.log('HMS: Data initialized.');
      } catch (error) {
        console.error('HMS: Failed to initialize data', error);
      }
    }

    // Ensure default users exist (even if previously initialized)
    this.ensureDefaultUsers();
  },

  ensureDefaultUsers() {
    const REQUIRED_USERS = [
      { name: "Manager", role: "Manager", email: "manager@gmail.com", password: "manager123" },
      { name: "Receptionist", role: "Receptionist", email: "receptionist@gmail.com", password: "receptionist123" },
      { name: "Waiter", role: "Waiter", email: "waiter@gmail.com", password: "waiter123" },
      { name: "Cook", role: "Cook", email: "cook@gmail.com", password: "cook123" },
      { name: "Housekeeper", role: "Housekeeper", email: "housekeeper@gmail.com", password: "housekeeper123" },
      { name: "Customer", role: "Customer", email: "customer@gmail.com", password: "customer123" }
    ];

    const users = this.getUsers();
    let updated = false;

    REQUIRED_USERS.forEach(req => {
      if (!users.some(u => u.email.toLowerCase() === req.email.toLowerCase())) {
        users.push({
          id: Date.now() + Math.floor(Math.random() * 10000),
          ...req
        });
        updated = true;
      }
    });

    if (updated) {
      localStorage.setItem(KEYS.USERS, JSON.stringify(users));
      console.log('HMS: Default credentials enforced');
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
  
  addUser(user: Omit<User, 'id'>): User {
    const users = this.getUsers();
    const newUser: User = {
        ...user,
        id: Date.now() // Simple ID generation
    };
    users.push(newUser);
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
    return newUser;
  },

  updateUser(updatedUser: User) {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
      users[index] = updatedUser;
      localStorage.setItem(KEYS.USERS, JSON.stringify(users));
    }
  },

  getMenu(): MenuItem[] {
    const data = localStorage.getItem(KEYS.MENU);
    return data ? JSON.parse(data) : [];
  },

  getBookings(): Booking[] {
    const data = localStorage.getItem(KEYS.BOOKINGS);
    let bookings: Booking[] = data ? JSON.parse(data) : [];
    return bookings.map(b => ({
      ...b,
      roomId: b.roomId || b.roomNumber
    }));
  },

  getBookingsByRole(role: string, userName?: string): Booking[] {
    const all = this.getBookings();
    if (role === 'Customer' && userName) {
      return all.filter(b => b.guestName === userName);
    }
    return all;
  },

  saveBookings(bookings: Booking[]) {
    localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(bookings));
  },

  createBooking(booking: Omit<Booking, 'id' | 'status'>) {
    const bookings = this.getBookings();
    const newBooking: Booking = {
      ...booking,
      id: `BK-${Date.now().toString().slice(-6)}`,
      status: 'Confirmed'
    };
    bookings.unshift(newBooking);
    this.saveBookings(bookings);
    this.updateRoomStatus(booking.roomId, 'Occupied');
    return newBooking;
  },

  cancelBooking(bookingId: string) {
    const bookings = this.getBookings();
    const index = bookings.findIndex(b => b.id === bookingId);
    if (index !== -1) {
      const roomId = bookings[index].roomId;
      bookings[index].status = 'Cancelled';
      this.saveBookings(bookings);
      this.updateRoomStatus(roomId, 'Vacant');
    }
  },

  updateRoomStatus(roomId: string, status: Room['status']) {
    const rooms = this.getRooms();
    const index = rooms.findIndex(r => r.id === roomId);
    if (index !== -1) {
      rooms[index].status = status;
      localStorage.setItem(KEYS.ROOMS, JSON.stringify(rooms));
    }
  },

  // --- Order Methods ---

  getOrders(): Order[] {
    const data = localStorage.getItem(KEYS.ORDERS);
    return data ? JSON.parse(data) : [];
  },

  getOrdersByRole(role: string, userName?: string): Order[] {
    const all = this.getOrders();
    if (role === 'Customer' && userName) {
      return all.filter(o => o.orderedBy === userName);
    }
    return all;
  },

  createOrder(orderData: Omit<Order, 'id' | 'status' | 'timestamp'>): Order {
    const orders = this.getOrders();
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${Date.now().toString().slice(-6)}`,
      status: 'Pending',
      timestamp: new Date().toISOString()
    };
    orders.unshift(newOrder);
    localStorage.setItem(KEYS.ORDERS, JSON.stringify(orders));
    return newOrder;
  },

  updateOrderStatus(orderId: string, status: Order['status']) {
    const orders = this.getOrders();
    const index = orders.findIndex(o => o.id === orderId);
    if (index !== -1) {
      orders[index].status = status;
      localStorage.setItem(KEYS.ORDERS, JSON.stringify(orders));
    }
    return orders[index];
  },

  // --- Housekeeping Tasks ---

  getHousekeepingTasks(): Task[] {
    const data = localStorage.getItem(KEYS.TASKS);
    return data ? JSON.parse(data) : [];
  },

  createHousekeepingTask(task: Omit<Task, 'id' | 'status'>): Task {
    const tasks = this.getHousekeepingTasks();
    const newTask: Task = {
      ...task,
      id: `TSK-${Date.now().toString().slice(-6)}`,
      status: 'Pending'
    };
    tasks.unshift(newTask);
    localStorage.setItem(KEYS.TASKS, JSON.stringify(tasks));
    
    // Automatically mark room as Not Ready when task created if it's cleaning
    if (task.type.includes('Clean')) {
      this.updateRoomStatus(task.roomId, 'Not Ready');
    }
    
    return newTask;
  },

  updateHousekeepingTaskStatus(taskId: string, status: Task['status']) {
    const tasks = this.getHousekeepingTasks();
    const index = tasks.findIndex(t => t.id === taskId);
    if (index !== -1) {
      tasks[index].status = status;
      localStorage.setItem(KEYS.TASKS, JSON.stringify(tasks));
      
      // If completed, mark room as Vacant (Ready)
      if (status === 'Completed') {
        this.updateRoomStatus(tasks[index].roomId, 'Vacant');
      }
    }
  },

  // --- Maintenance Issues ---

  getMaintenanceIssues(): Issue[] {
    const data = localStorage.getItem(KEYS.ISSUES);
    return data ? JSON.parse(data) : [];
  },

  createMaintenanceIssue(issue: Omit<Issue, 'id' | 'status' | 'timestamp'>): Issue {
    const issues = this.getMaintenanceIssues();
    const newIssue: Issue = {
      ...issue,
      id: `ISS-${Date.now().toString().slice(-6)}`,
      status: 'Open',
      timestamp: new Date().toISOString()
    };
    issues.unshift(newIssue);
    localStorage.setItem(KEYS.ISSUES, JSON.stringify(issues));
    return newIssue;
  },

  updateMaintenanceIssueStatus(issueId: string, status: Issue['status']) {
    const issues = this.getMaintenanceIssues();
    const index = issues.findIndex(i => i.id === issueId);
    if (index !== -1) {
      issues[index].status = status;
      localStorage.setItem(KEYS.ISSUES, JSON.stringify(issues));
    }
  },

  // --- Analytics ---

  getAnalytics() {
    const rooms = this.getRooms();
    const bookings = this.getBookings();
    const orders = this.getOrders();
    const tasks = this.getHousekeepingTasks();
    const issues = this.getMaintenanceIssues();

    // Occupancy
    const totalRooms = rooms.length || 1;
    const occupiedRooms = rooms.filter(r => r.status === 'Occupied').length;
    const occupancyRate = Math.round((occupiedRooms / totalRooms) * 100);

    // Bookings
    const totalBookings = bookings.length;
    const confirmedBookings = bookings.filter(b => b.status === 'Confirmed').length;
    const activeBookings = bookings.filter(b => b.status === 'Active').length;
    const cancelledBookings = bookings.filter(b => b.status === 'Cancelled').length;
    const completedBookings = bookings.filter(b => b.status === 'Completed').length;

    // Orders
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'Pending').length;
    const servedOrders = orders.filter(o => o.status === 'Served').length;
    const cancelledOrders = orders.filter(o => o.status === 'Cancelled').length;

    // Housekeeping
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'Completed').length;
    const pendingTasks = tasks.filter(t => t.status === 'Pending').length;
    const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length;

    // Maintenance
    const totalIssues = issues.length;
    const openIssues = issues.filter(i => i.status === 'Open').length;
    const inProgressIssues = issues.filter(i => i.status === 'In Progress').length;
    const resolvedIssues = issues.filter(i => i.status === 'Resolved').length;

    return {
      occupancy: { rate: occupancyRate, total: totalRooms, occupied: occupiedRooms },
      bookings: { 
        total: totalBookings, 
        confirmed: confirmedBookings, 
        active: activeBookings, 
        cancelled: cancelledBookings, 
        completed: completedBookings 
      },
      orders: { 
        total: totalOrders, 
        pending: pendingOrders, 
        served: servedOrders, 
        cancelled: cancelledOrders 
      },
      housekeeping: { 
        total: totalTasks, 
        completed: completedTasks, 
        pending: pendingTasks, 
        inProgress: inProgressTasks 
      },
      maintenance: { 
        total: totalIssues, 
        open: openIssues, 
        inProgress: inProgressIssues,
        resolved: resolvedIssues 
      }
    };
  },

  resetToPublicData() {
    localStorage.clear();
    window.location.reload();
  }
};