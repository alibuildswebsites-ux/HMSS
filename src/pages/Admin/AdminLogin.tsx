import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthService } from '../../services/authService';
import { Lock } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const user = AuthService.login(email, password);

    if (user) {
        if (user.role === 'Customer') {
            AuthService.logout();
            setError('Customers must login from /login');
            return;
        }
        navigate(AuthService.getDashboardPath(user.role));
        window.location.reload(); // Ensure sidebar updates
    } else {
        setError('Invalid staff credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl">
        <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-4">
                <Lock className="w-6 h-6 text-gray-800" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Staff Portal</h2>
            <p className="text-gray-500">Secure Access Restricted</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Staff Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
              placeholder="name@hms.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
              required
            />
          </div>
          
          {error && (
              <div className="text-red-500 text-sm bg-red-50 p-2 rounded text-center">
                  {error}
              </div>
          )}

          <button 
            type="submit"
            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-2.5 rounded-lg transition-colors shadow-lg"
          >
            Access Dashboard
          </button>
        </form>

        <div className="mt-6 text-center">
            <Link to="/" className="text-xs text-gray-400 hover:text-gray-600">Back to Public Site</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;