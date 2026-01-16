import { DataService, User } from './dataService';

const CURRENT_USER_KEY = 'hms_user';
const CURRENT_ROLE_KEY = 'currentRole';

export const AuthService = {
    login(email: string, password: string): User | null {
        const users = DataService.getUsers();
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
        
        if (user) {
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
            localStorage.setItem(CURRENT_ROLE_KEY, user.role);
            return user;
        }
        return null;
    },

    register(name: string, email: string, password: string): User | string {
        const users = DataService.getUsers();
        if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
            return "Email already exists";
        }

        const newUser: Omit<User, 'id'> = {
            name,
            email,
            password,
            role: 'Customer'
        };

        const createdUser = DataService.addUser(newUser);
        return createdUser;
    },

    logout() {
        localStorage.removeItem(CURRENT_USER_KEY);
        localStorage.removeItem(CURRENT_ROLE_KEY);
    },

    getCurrentUser(): User | null {
        const userStr = localStorage.getItem(CURRENT_USER_KEY);
        return userStr ? JSON.parse(userStr) : null;
    },

    isAuthenticated(): boolean {
        return !!this.getCurrentUser();
    },

    // Helper to determine redirect path based on role
    getDashboardPath(role: string): string {
        switch (role) {
            case 'Manager': return '/manager-dashboard';
            case 'Receptionist': return '/receptionist-dashboard';
            case 'Waiter': return '/waiter-dashboard';
            case 'Cook': return '/cook-dashboard';
            case 'Housekeeper': return '/housekeeper-dashboard';
            case 'Customer': return '/customer-dashboard';
            default: return '/';
        }
    }
};